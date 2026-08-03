import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { HiOutlineX, HiOutlinePhotograph, HiOutlineDocumentText, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { mockCategories, nepalDistricts } from '@/lib/mockData';
import api from '@/lib/api';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  priceType: z.enum(['SALE', 'RENT']),
  price: z.number({ invalid_type_error: 'Enter a valid price' }).min(1, 'Price is required'),
  area: z.number({ invalid_type_error: 'Enter a valid area' }).min(1, 'Area is required'),
  areaUnit: z.string().default('sq.ft'),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  floors: z.number().int().min(0).optional(),
  parking: z.boolean().default(false),
  waterSupply: z.boolean().default(true),
  roadAccess: z.boolean().default(true),
  district: z.string().min(1, 'District is required'),
  city: z.string().min(1, 'City is required'),
  municipality: z.string().optional(),
  ward: z.string().optional(),
  streetAddress: z.string().optional(),
  facingDirection: z.string().optional(),
  roadWidth: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type PropertyForm = z.infer<typeof schema>;

const LISTING_TYPES = [
  { value: 'SALE', label: 'For Sale', emoji: '🏷️', desc: 'Selling this property' },
  { value: 'RENT', label: 'For Rent', emoji: '🔑', desc: 'Renting out this property' },
];

const steps = [
  { num: 1, label: 'Basic Info', icon: '📋' },
  { num: 2, label: 'Details', icon: '🔨' },
  { num: 3, label: 'Location', icon: '📍' },
  { num: 4, label: 'Media', icon: '📸' },
];

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });
  const [markerPos, setMarkerPos] = useState({ lat: 27.7172, lng: 85.3240 });

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPos({ lat, lng });
      setValue('latitude', lat);
      setValue('longitude', lng);
    }
  };

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<PropertyForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      priceType: 'SALE',
      areaUnit: 'sq.ft',
      parking: false,
      waterSupply: true,
      roadAccess: true,
    },
  });

  const priceType = watch('priceType');

  // Step validation fields
  const stepFields: Record<number, (keyof PropertyForm)[]> = {
    1: ['title', 'description', 'category', 'priceType', 'price', 'area'],
    2: [],
    3: ['district', 'city'],
    4: [],
  };

  const handleNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep(step + 1);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...imageFiles, ...files].slice(0, 10);
    setImageFiles(newFiles);
    const previews = newFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  const removeImage = (idx: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== idx);
    const newPreviews = imagePreviews.filter((_, i) => i !== idx);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const onSubmit = async (data: PropertyForm) => {
    setIsSubmitting(true);
    try {
      // First create the property
      const { data: res } = await api.post('/properties', data);
      const propertyId = res.data.id;

      // Then upload images if any
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((f) => formData.append('images', f));
        await api.post(`/properties/${propertyId}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('🏠 Property submitted for review! Our team will verify it within 24 hours.');
      navigate('/dashboard/owner');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to submit property. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-[68px]">
      <div className="container-custom py-6 md:py-10 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 -ml-1">
            <HiOutlineChevronLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">List Your Property</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details to list on Hamro Awas</p>
        </div>

        {/* Step Indicator — scrollable on mobile */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1 scroll-x-touch">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => step > s.num && setStep(s.num)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  step === s.num
                    ? 'bg-primary-700 text-white shadow-sm'
                    : step > s.num
                    ? 'bg-primary-50 text-primary-700 cursor-pointer hover:bg-primary-100'
                    : 'bg-gray-100 text-gray-400 cursor-default'
                }`}
              >
                <span>{s.icon}</span>
                <span className="hidden xs:inline">{s.label}</span>
                <span className="xs:hidden">{s.num}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-4 h-0.5 flex-shrink-0 ${step > s.num ? 'bg-primary-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card p-5 md:p-8">
            <AnimatePresence mode="wait">
              {/* ---- STEP 1: Basic Info ---- */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

                  {/* Listing Type — prominent toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What are you doing with this property? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {LISTING_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setValue('priceType', type.value as 'SALE' | 'RENT')}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
                            priceType === type.value
                              ? 'border-primary-700 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <span className="text-2xl">{type.emoji}</span>
                          <span className="font-semibold text-sm">{type.label}</span>
                          <span className="text-xs opacity-70">{type.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
                    <input
                      {...register('title')}
                      className={`input ${errors.title ? 'input-error' : ''}`}
                      placeholder="e.g. Beautiful 3BHK House in Budhanilkantha"
                    />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      {...register('description')}
                      className={`input resize-none ${errors.description ? 'input-error' : ''}`}
                      rows={4}
                      placeholder="Describe your property — features, nearby amenities, condition..."
                    />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select {...register('category')} className={`input ${errors.category ? 'input-error' : ''}`}>
                      <option value="">Select category</option>
                      {mockCategories.map((c) => (
                        <option key={c.id} value={c.slug.toUpperCase().replace(/-/g, '_')}>{c.name}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (Rs.) *{priceType === 'RENT' ? ' /month' : ''}
                      </label>
                      <input
                        {...register('price', { valueAsNumber: true })}
                        type="number"
                        className={`input ${errors.price ? 'input-error' : ''}`}
                        placeholder="0"
                        min="0"
                      />
                      {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
                      <div className="flex gap-2">
                        <input
                          {...register('area', { valueAsNumber: true })}
                          type="number"
                          className={`input flex-1 ${errors.area ? 'input-error' : ''}`}
                          placeholder="0"
                          min="0"
                        />
                        <select {...register('areaUnit')} className="input w-24 flex-shrink-0">
                          <option value="sq.ft">sq.ft</option>
                          <option value="ropani">ropani</option>
                          <option value="anna">anna</option>
                          <option value="dhur">dhur</option>
                          <option value="bigha">bigha</option>
                          <option value="kattha">kattha</option>
                        </select>
                      </div>
                      {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ---- STEP 2: Property Details ---- */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'bedrooms', label: '🛏️ Bedrooms' },
                      { name: 'bathrooms', label: '🚿 Bathrooms' },
                      { name: 'floors', label: '🏗️ Floors' },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
                        <input
                          {...register(field.name as keyof PropertyForm, { valueAsNumber: true })}
                          type="number"
                          min="0"
                          className="input text-center"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facing Direction</label>
                      <select {...register('facingDirection')} className="input">
                        <option value="">Select</option>
                        {['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map(d => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Road Width</label>
                      <input {...register('roadWidth')} className="input" placeholder="e.g. 20 feet" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Amenities & Features</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { name: 'parking', label: '🚗 Parking Available' },
                        { name: 'waterSupply', label: '💧 Water Supply' },
                        { name: 'roadAccess', label: '🛣️ Road Access' },
                      ].map((field) => (
                        <label key={field.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-primary-300 cursor-pointer transition-colors">
                          <input
                            {...register(field.name as keyof PropertyForm)}
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 font-medium">{field.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ---- STEP 3: Location ---- */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="text-lg font-semibold text-gray-900">Location</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                      <select {...register('district')} className={`input ${errors.district ? 'input-error' : ''}`}>
                        <option value="">Select district</option>
                        {nepalDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City / Town *</label>
                      <input {...register('city')} className={`input ${errors.city ? 'input-error' : ''}`} placeholder="e.g. Kathmandu" />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Municipality / VDC</label>
                      <input {...register('municipality')} className="input" placeholder="e.g. Kathmandu Metropolitan" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ward No.</label>
                      <input {...register('ward')} className="input" placeholder="e.g. Ward 4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input {...register('streetAddress')} className="input" placeholder="Street / Tole name" />
                  </div>

                  <div className="aspect-[16/9] rounded-2xl bg-gray-100 flex flex-col items-center justify-center border-2 border-gray-300 overflow-hidden relative">
                    {!isLoaded ? (
                      <p className="text-sm text-gray-500">Loading Map...</p>
                    ) : (
                      <>
                        <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-xs font-medium text-gray-700 pointer-events-none">
                          Click map to set exact location
                        </div>
                        <GoogleMap
                          mapContainerStyle={{ width: '100%', height: '100%' }}
                          center={markerPos}
                          zoom={13}
                          onClick={handleMapClick}
                          options={{
                            mapTypeControl: false,
                            streetViewControl: false,
                            fullscreenControl: true,
                          }}
                        >
                          <Marker position={markerPos} draggable={true} onDragEnd={handleMapClick} />
                        </GoogleMap>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ---- STEP 4: Media ---- */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900">Photos & Documents</h2>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Photos</label>
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all cursor-pointer"
                    >
                      <HiOutlinePhotograph className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700">Drop images here or click to upload</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP • Max 10 images • 5MB each</p>
                      <input
                        ref={imageInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                        {imagePreviews.map((src, idx) => (
                          <div key={idx} className="relative group aspect-square">
                            <img src={src} alt="" className="w-full h-full object-cover rounded-xl" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <HiOutlineX className="w-3.5 h-3.5" />
                            </button>
                            {idx === 0 && (
                              <span className="absolute bottom-1 left-1 text-[10px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded-md">Cover</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Document Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Documents</label>
                    <div
                      onClick={() => docInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all cursor-pointer"
                    >
                      <HiOutlineDocumentText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700">Upload ownership documents</p>
                      <p className="text-xs text-gray-400 mt-1">PDF • Ownership certificate, land certificate, tax clearance</p>
                      <input
                        ref={docInputRef}
                        type="file"
                        multiple
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => setDocFiles(Array.from(e.target.files || []))}
                      />
                    </div>
                    {docFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {docFiles.map((f, i) => (
                          <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl text-sm">
                            <span className="truncate text-gray-700">{f.name}</span>
                            <button type="button" onClick={() => setDocFiles(docFiles.filter((_, j) => j !== i))}>
                              <HiOutlineX className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Review Summary */}
                  <div className="bg-primary-50 rounded-2xl p-4 text-sm text-primary-800">
                    <p className="font-semibold mb-1">📋 What happens next?</p>
                    <ul className="space-y-1 text-primary-700 text-xs list-disc list-inside">
                      <li>Our team verifies your property within 24 hours</li>
                      <li>You'll receive an email confirmation once approved</li>
                      <li>Your property will be listed on the marketplace</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-ghost flex items-center gap-1"
                >
                  <HiOutlineChevronLeft className="w-4 h-4" /> Previous
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-1"
                >
                  Next <HiOutlineChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary btn-lg disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : '🏠 Submit Property'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
