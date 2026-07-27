import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiOutlineShare, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineChat, HiOutlineShieldCheck, HiOutlineEye, HiOutlineFlag, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { IoBedOutline, IoWaterOutline } from 'react-icons/io5';
import { TbBath, TbParking, TbRulerMeasure, TbStairs, TbCompass, TbFileText } from 'react-icons/tb';
import { StarRating, Badge, Modal } from '@/components/ui/index';
import { mockProperties, mockReviews } from '@/lib/mockData';
import { formatPrice, formatArea, getCategoryLabel, formatDate, getStatusColor } from '@/lib/utils';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [showBookVisit, setShowBookVisit] = useState(false);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const property = mockProperties.find((p) => p.id === id) || mockProperties[0];
  const propertyReviews = mockReviews.filter((r) => r.propertyId === property.id);
  const allImages = property.images.length > 0 ? property.images : [{ id: '0', url: 'https://placehold.co/800x600/0F766E/white?text=Property', isPrimary: true, order: 0 }];

  const specs = [
    property.area && { icon: <TbRulerMeasure className="w-5 h-5" />, label: 'Area', value: formatArea(property.area, property.areaUnit) },
    property.bedrooms != null && { icon: <IoBedOutline className="w-5 h-5" />, label: 'Bedrooms', value: property.bedrooms },
    property.bathrooms != null && { icon: <TbBath className="w-5 h-5" />, label: 'Bathrooms', value: property.bathrooms },
    property.floors != null && { icon: <TbStairs className="w-5 h-5" />, label: 'Floors', value: property.floors },
    property.parking && { icon: <TbParking className="w-5 h-5" />, label: 'Parking', value: property.parkingSpaces ? `${property.parkingSpaces} spots` : 'Yes' },
    property.facingDirection && { icon: <TbCompass className="w-5 h-5" />, label: 'Facing', value: property.facingDirection },
    property.roadWidth && { icon: <TbRulerMeasure className="w-5 h-5" />, label: 'Road Width', value: property.roadWidth },
    property.ownershipType && { icon: <TbFileText className="w-5 h-5" />, label: 'Ownership', value: property.ownershipType },
    property.builtYear && { icon: <HiOutlineCalendar className="w-5 h-5" />, label: 'Built Year', value: property.builtYear },
    { icon: <IoWaterOutline className="w-5 h-5" />, label: 'Water Supply', value: property.waterSupply ? 'Available' : 'N/A' },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string | number }[];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-700">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-primary-700">Properties</Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[200px]">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column — Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
              <div className="relative aspect-[16/10] bg-gray-100">
                <img src={allImages[currentImage]?.url} alt={property.title} className="w-full h-full object-cover" />
                {/* Nav arrows */}
                {allImages.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImage((p) => (p > 0 ? p - 1 : allImages.length - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow">
                      <HiOutlineChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setCurrentImage((p) => (p < allImages.length - 1 ? p + 1 : 0))} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow">
                      <HiOutlineChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                {/* Counter */}
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/50 text-white text-xs backdrop-blur-sm">
                  {currentImage + 1} / {allImages.length}
                </span>
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {property.isFeatured && <span className="px-3 py-1 rounded-lg bg-accent/90 text-white text-xs font-semibold">⭐ Featured</span>}
                  {property.isVerified && <span className="px-3 py-1 rounded-lg bg-green-500/90 text-white text-xs font-semibold">✓ Verified</span>}
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(property.status)}`}>{property.status}</span>
                </div>
              </div>
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto scrollbar-thin">
                  {allImages.map((img, i) => (
                    <button key={img.id} onClick={() => setCurrentImage(i)} className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === currentImage ? 'border-primary-700' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Title & Location */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="primary">{getCategoryLabel(property.category)}</Badge>
                    <Badge variant={property.priceType === 'SALE' ? 'accent' : 'gray'}>
                      {property.priceType === 'SALE' ? 'For Sale' : 'For Rent'}
                    </Badge>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
                  <div className="flex items-center gap-1 mt-2 text-gray-500">
                    <HiOutlineLocationMarker className="w-4 h-4" />
                    <span className="text-sm">{property.municipality ? `${property.municipality}, ` : ''}{property.city}, {property.district}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"><HiOutlineHeart className="w-5 h-5 text-gray-500" /></button>
                  <button className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"><HiOutlineShare className="w-5 h-5 text-gray-500" /></button>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><HiOutlineEye className="w-4 h-4" /> {property.viewCount} views</span>
                <span>Listed {formatDate(property.createdAt)}</span>
              </div>
            </div>

            {/* Price */}
            <div className="card p-6">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-primary-700">{formatPrice(property.price, property.priceType)}</span>
              </div>
            </div>

            {/* Specs */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <span className="text-primary-700">{spec.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500">{spec.label}</p>
                      <p className="text-sm font-medium text-gray-900">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a.amenity.id} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
                      <span>{a.amenity.icon}</span>
                      <span className="text-sm text-gray-700">{a.amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
              <div className="aspect-[16/9] rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                {!isLoaded ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Loading Map...</p>
                  </div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{ lat: property.latitude || 27.7172, lng: property.longitude || 85.3240 }}
                    zoom={15}
                  >
                    {(property.latitude && property.longitude) && (
                      <Marker position={{ lat: property.latitude, lng: property.longitude }} />
                    )}
                  </GoogleMap>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">{property.latitude && `${property.latitude}, ${property.longitude}`}</p>
            </div>

            {/* Reviews */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews ({propertyReviews.length})</h2>
              {propertyReviews.length > 0 ? (
                <div className="space-y-4">
                  {propertyReviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-700 font-semibold text-xs">{review.reviewer?.profile?.fullName?.[0] || 'U'}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{review.reviewer?.profile?.fullName}</p>
                          <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                        </div>
                        <div className="ml-auto"><StarRating rating={review.rating} size="sm" /></div>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Owner Card */}
            <div className="card p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-bold text-lg">{property.owner?.profile?.fullName?.[0] || 'O'}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-gray-900">{property.owner?.profile?.fullName}</p>
                    {property.owner?.isVerified && <HiOutlineShieldCheck className="w-4 h-4 text-green-500" />}
                  </div>
                  <p className="text-xs text-gray-500">Property Owner</p>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={() => setShowBookVisit(true)} className="btn-primary w-full">
                  <HiOutlineCalendar className="w-5 h-5" /> Book Visit
                </button>
                <Link to="/chat" className="btn-secondary w-full flex items-center justify-center gap-2">
                  <HiOutlineChat className="w-5 h-5" /> Chat Now
                </Link>
                <Link to="/finance" className="btn-ghost w-full text-primary-700 border border-primary-200 hover:bg-primary-50">
                  💰 Finance Options
                </Link>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
                  <HiOutlineFlag className="w-3.5 h-3.5" /> Report this listing
                </button>
              </div>
            </div>

            {/* Nearby Info Placeholder */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Nearby Places</h3>
              <div className="space-y-3">
                {[
                  { icon: '🏫', name: 'Schools', distance: 'Within 1 km' },
                  { icon: '🏥', name: 'Hospitals', distance: 'Within 2 km' },
                  { icon: '🛒', name: 'Markets', distance: 'Within 500m' },
                  { icon: '🚌', name: 'Bus Stop', distance: 'Within 300m' },
                ].map((place) => (
                  <div key={place.name} className="flex items-center gap-3">
                    <span className="text-lg">{place.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{place.name}</p>
                      <p className="text-xs text-gray-400">{place.distance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Visit Modal */}
      <Modal isOpen={showBookVisit} onClose={() => setShowBookVisit(false)} title="Book a Visit" size="sm">
        <form onSubmit={(e) => { e.preventDefault(); setShowBookVisit(false); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
            <input type="date" className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
            <select className="input"><option>Morning (9-12)</option><option>Afternoon (12-3)</option><option>Evening (3-6)</option></select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
            <textarea className="input" rows={3} placeholder="Any specific requests..." />
          </div>
          <button type="submit" className="btn-primary w-full">Send Visit Request</button>
        </form>
      </Modal>
    </div>
  );
}
