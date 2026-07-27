import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { HiOutlineX, HiOutlinePhotograph, HiOutlineChevronLeft } from 'react-icons/hi';
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

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<PropertyForm>({
    resolver: zodResolver(schema),
  });

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

  const priceType = watch('priceType');

  // Load property data
  useEffect(() => {
    const loadProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        const p = data.data;
        reset({
          title: p.title,
          description: p.description,
          category: p.category,
          priceType: p.priceType,
          price: p.price,
          area: p.area,
          areaUnit: p.areaUnit,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          floors: p.floors,
          parking: p.parking,
          waterSupply: p.waterSupply,
          roadAccess: p.roadAccess,
          district: p.district,
          city: p.city,
          municipality: p.municipality,
          ward: p.ward,
          streetAddress: p.streetAddress,
          facingDirection: p.facingDirection,
          roadWidth: p.roadWidth,
          latitude: p.latitude,
          longitude: p.longitude,
        });
        if (p.latitude && p.longitude) {
          setMarkerPos({ lat: p.latitude, lng: p.longitude });
        }
        setExistingImages(p.images || []);
      } catch {
        toast.error('Failed to load property');
        navigate('/dashboard/owner');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) loadProperty();
  }, [id, reset, navigate]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const combined = [...newImageFiles, ...files].slice(0, 10 - existingImages.length);
    setNewImageFiles(combined);
    setNewImagePreviews(combined.map((f) => URL.createObjectURL(f)));
  };

  const removeExistingImage = (imgId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  const onSubmit = async (data: PropertyForm) => {
    setIsSubmitting(true);
    try {
      await api.put(`/properties/${id}`, data);

      // Upload new images if any
      if (newImageFiles.length > 0) {
        const formData = new FormData();
        newImageFiles.forEach((f) => formData.append('images', f));
        await api.post(`/properties/${id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('✅ Property updated successfully!');
      navigate('/dashboard/owner');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update property');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-[68px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-primary-200 border-t-primary-700 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-[68px]">
      <div className="container-custom py-6 md:py-10 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 -ml-1">
            <HiOutlineChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-500 text-sm mt-1">Update your property listing details</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5 md:p-7 space-y-5">
            <h2 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Basic Information</h2>

            {/* Listing Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type *</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'SALE', label: '🏷️ For Sale', desc: 'Selling this property' },
                  { value: 'RENT', label: '🔑 For Rent', desc: 'Renting out this property' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setValue('priceType', type.value as 'SALE' | 'RENT')}
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all text-center ${
                      priceType === type.value
                        ? 'border-primary-700 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="text-xl">{type.label.split(' ')[0]}</span>
                    <span className="font-semibold text-sm">{type.label.split(' ').slice(1).join(' ')}</span>
                    <span className="text-xs opacity-70">{type.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input {...register('title')} className={`input ${errors.title ? 'input-error' : ''}`} />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea {...register('description')} className={`input resize-none ${errors.description ? 'input-error' : ''}`} rows={4} />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select {...register('category')} className="input">
                  <option value="">Select category</option>
                  {mockCategories.map((c) => (
                    <option key={c.id} value={c.slug.toUpperCase().replace(/-/g, '_')}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Rs.){priceType === 'RENT' ? ' /month' : ''} *
                </label>
                <input {...register('price', { valueAsNumber: true })} type="number" min="0" className="input" />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
                <input {...register('area', { valueAsNumber: true })} type="number" min="0" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area Unit</label>
                <select {...register('areaUnit')} className="input">
                  {['sq.ft', 'ropani', 'anna', 'dhur', 'bigha', 'kattha'].map(u => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Property Details */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5 md:p-7 space-y-5">
            <h2 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Property Details</h2>
            <div className="grid grid-cols-3 gap-3">
              {[{ n: 'bedrooms', l: '🛏️ Beds' }, { n: 'bathrooms', l: '🚿 Baths' }, { n: 'floors', l: '🏗️ Floors' }].map(f => (
                <div key={f.n}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.l}</label>
                  <input {...register(f.n as keyof PropertyForm, { valueAsNumber: true })} type="number" min="0" className="input text-center" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facing Direction</label>
                <select {...register('facingDirection')} className="input">
                  <option value="">Select</option>
                  {['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Road Width</label>
                <input {...register('roadWidth')} className="input" placeholder="e.g. 20 feet" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'parking', label: '🚗 Parking' },
                { name: 'waterSupply', label: '💧 Water Supply' },
                { name: 'roadAccess', label: '🛣️ Road Access' },
              ].map((field) => (
                <label key={field.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-primary-300 cursor-pointer">
                  <input {...register(field.name as keyof PropertyForm)} type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-700" />
                  <span className="text-sm text-gray-700">{field.label}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Location */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5 md:p-7 space-y-4">
            <h2 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Location</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                <select {...register('district')} className="input">
                  <option value="">Select district</option>
                  {nepalDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input {...register('city')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
                <input {...register('municipality')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                <input {...register('ward')} className="input" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input {...register('streetAddress')} className="input" />
            </div>

            {/* Map UI */}
            <div className="aspect-[16/9] rounded-xl bg-gray-100 flex flex-col items-center justify-center border-2 border-gray-300 overflow-hidden relative mt-4">
              {!isLoaded ? (
                <p className="text-sm text-gray-500">Loading Map...</p>
              ) : (
                <>
                  <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-xs font-medium text-gray-700 pointer-events-none">
                    Click map to update exact location
                  </div>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={markerPos}
                    zoom={15}
                    onClick={handleMapClick}
                    options={{ mapTypeControl: false, streetViewControl: false, fullscreenControl: true }}
                  >
                    <Marker position={markerPos} draggable={true} onDragEnd={handleMapClick} />
                  </GoogleMap>
                </>
              )}
            </div>
          </motion.div>

          {/* Photos */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5 md:p-7">
            <h2 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100 mb-4">Photos</h2>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Current Photos</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative group aspect-square">
                      <img src={img.url} alt="" className="w-full h-full object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <HiOutlineX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all cursor-pointer"
            >
              <HiOutlinePhotograph className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Add more photos</p>
              <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP • up to {10 - existingImages.length} more</p>
              <input ref={imageInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} />
            </div>

            {newImagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                {newImagePreviews.map((src, idx) => (
                  <div key={idx} className="relative group aspect-square">
                    <img src={src} alt="" className="w-full h-full object-cover rounded-xl" />
                    <button type="button" onClick={() => { setNewImageFiles(f => f.filter((_, i) => i !== idx)); setNewImagePreviews(p => p.filter((_, i) => i !== idx)); }} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <HiOutlineX className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-[10px] font-semibold bg-green-500/80 text-white px-1.5 py-0.5 rounded-md">New</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost flex-1 sm:flex-none">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 sm:flex-none">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving...
                </span>
              ) : '✅ Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
