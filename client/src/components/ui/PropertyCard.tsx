import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Property } from '@/types';
import { formatPrice, formatArea, getCategoryLabel, getStatusColor } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiOutlineLocationMarker, HiOutlineEye } from 'react-icons/hi';
import { IoBedOutline, IoWaterOutline } from 'react-icons/io5';
import { TbBath, TbParking } from 'react-icons/tb';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const primaryImage = property.images?.find((img) => img.isPrimary) || property.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/properties/${property.id}`} className="block">
        <div className="card overflow-hidden border border-slate-100 bg-white/95 shadow-soft">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={primaryImage?.url || 'https://placehold.co/800x600/0F766E/white?text=Property'}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {property.isFeatured && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-[11px] font-semibold backdrop-blur-sm">
                  ⭐ Featured
                </span>
              )}
              {property.isVerified && (
                <span className="px-2.5 py-1 rounded-lg bg-green-500/90 text-white text-[11px] font-semibold backdrop-blur-sm">
                  ✓ Verified
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-red-500 transition-all"
            >
              <HiOutlineHeart className="w-4 h-4" />
            </button>

            {/* Price tag */}
            <div className="absolute bottom-3 left-3">
              <div className="px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm shadow-sm">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(property.price, property.priceType)}
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="absolute bottom-3 right-3">
              <span className="px-2.5 py-1 rounded-lg bg-primary-600/90 text-white text-[11px] font-medium backdrop-blur-sm">
                {getCategoryLabel(property.category)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-base font-semibold text-slate-900 line-clamp-1 group-hover:text-primary-700 transition-colors">
              {property.title}
            </h3>

            <div className="flex items-center gap-1 mt-1.5 text-gray-500">
              <HiOutlineLocationMarker className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs truncate">
                {property.municipality ? `${property.municipality}, ` : ''}{property.city}, {property.district}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
              {property.area && (
                <div className="flex items-center gap-1 text-gray-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                  <span className="text-xs font-medium">{formatArea(property.area, property.areaUnit)}</span>
                </div>
              )}
              {property.bedrooms !== undefined && property.bedrooms !== null && (
                <div className="flex items-center gap-1 text-gray-500">
                  <IoBedOutline className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms !== undefined && property.bathrooms !== null && (
                <div className="flex items-center gap-1 text-gray-500">
                  <TbBath className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{property.bathrooms}</span>
                </div>
              )}
              {property.parking && (
                <div className="flex items-center gap-1 text-gray-500">
                  <TbParking className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Yes</span>
                </div>
              )}
              <div className="ml-auto flex items-center gap-1 text-gray-400">
                <HiOutlineEye className="w-3.5 h-3.5" />
                <span className="text-xs">{property.viewCount}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
