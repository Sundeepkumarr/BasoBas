import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSearch, HiOutlineAdjustments, HiOutlineX,
  HiOutlineViewGrid, HiOutlineViewList,
} from 'react-icons/hi';
import PropertyCard from '@/components/ui/PropertyCard';
import { PropertyCardSkeleton } from '@/components/ui/index';
import { mockProperties, mockCategories, nepalDistricts } from '@/lib/mockData';
import { getCategoryLabel } from '@/lib/utils';

export default function PropertyListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading] = useState(false);

  // Close drawer on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowFilters(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Lock scroll when drawer open on mobile
  useEffect(() => {
    if (showFilters && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showFilters]);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const priceType = searchParams.get('priceType') || '';
  const district = searchParams.get('district') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const filteredProperties = useMemo(() => {
    let result = [...mockProperties];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    }
    if (category) result = result.filter((p) => p.category === category);
    if (priceType) result = result.filter((p) => p.priceType === priceType);
    if (district) result = result.filter((p) => p.district.toLowerCase() === district.toLowerCase());

    result.sort((a, b) => {
      if (sortBy === 'price') return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      if (sortBy === 'area') return sortOrder === 'asc' ? a.area - b.area : b.area - a.area;
      return sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [search, category, priceType, district, sortBy, sortOrder]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});
  const activeFilterCount = [search, category, priceType, district].filter(Boolean).length;

  // Shared filter form (used in both desktop inline + mobile drawer)
  const FilterForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
          <select value={category} onChange={(e) => updateFilter('category', e.target.value)} className="input text-sm">
            <option value="">All Categories</option>
            {mockCategories.map((c) => (
              <option key={c.id} value={c.slug.toUpperCase().replace(/-/g, '_')}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Listing Type</label>
          <select value={priceType} onChange={(e) => updateFilter('priceType', e.target.value)} className="input text-sm">
            <option value="">Buy & Rent</option>
            <option value="SALE">For Sale / Buy</option>
            <option value="RENT">For Rent</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">District</label>
          <select value={district} onChange={(e) => updateFilter('district', e.target.value)} className="input text-sm">
            <option value="">All Districts</option>
            {nepalDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Sort By</label>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              updateFilter('sortBy', sb);
              updateFilter('sortOrder', so);
            }}
            className="input text-sm"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="area-desc">Largest First</option>
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
          {search && (
            <span className="badge-primary flex items-center gap-1">
              "{search}" <button onClick={() => updateFilter('search', '')}><HiOutlineX className="w-3 h-3" /></button>
            </span>
          )}
          {category && (
            <span className="badge-primary flex items-center gap-1">
              {getCategoryLabel(category)} <button onClick={() => updateFilter('category', '')}><HiOutlineX className="w-3 h-3" /></button>
            </span>
          )}
          {priceType && (
            <span className="badge-primary flex items-center gap-1">
              {priceType === 'SALE' ? 'For Sale' : 'For Rent'} <button onClick={() => updateFilter('priceType', '')}><HiOutlineX className="w-3 h-3" /></button>
            </span>
          )}
          {district && (
            <span className="badge-primary flex items-center gap-1">
              {district} <button onClick={() => updateFilter('district', '')}><HiOutlineX className="w-3 h-3" /></button>
            </span>
          )}
          <button onClick={clearFilters} className="text-xs text-red-600 font-medium hover:underline flex items-center gap-1">
            <HiOutlineX className="w-3 h-3" /> Clear all
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-[68px]">
      <div className="container-custom py-6 md:py-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Find Properties</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {isLoading ? 'Loading...' : `Showing ${filteredProperties.length} properties`}
          </p>
        </div>

        {/* Search + Controls Bar */}
        <div className="flex gap-2 md:gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search properties, locations..."
              className="input pl-12 text-sm"
            />
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn relative flex-shrink-0 ${activeFilterCount > 0 ? 'btn-primary' : 'btn-secondary'}`}
          >
            <HiOutlineAdjustments className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort (desktop only) */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              updateFilter('sortBy', sb);
              updateFilter('sortOrder', so);
            }}
            className="input w-auto hidden md:block text-sm flex-shrink-0"
          >
            <option value="createdAt-desc">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="area-desc">Largest</option>
          </select>

          {/* Grid/List toggle (desktop) */}
          <div className="hidden md:flex border border-gray-200 rounded-xl overflow-hidden flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-primary-50 text-primary-700' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <HiOutlineViewGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-primary-50 text-primary-700' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <HiOutlineViewList className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Inline Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card p-5 mb-6 hidden lg:block overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-1 rounded-lg hover:bg-gray-100">
                  <HiOutlineX className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <FilterForm />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {showFilters && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="drawer-overlay"
                onClick={() => setShowFilters(false)}
              />
              {/* Drawer */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="drawer-panel lg:hidden"
              >
                <div className="drawer-handle" />
                <div className="px-5 pb-2">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-gray-900 text-base">Filters</h3>
                    {activeFilterCount > 0 && (
                      <button onClick={clearFilters} className="text-sm text-red-600 font-medium">
                        Clear all
                      </button>
                    )}
                  </div>
                  <FilterForm />
                  <button
                    onClick={() => setShowFilters(false)}
                    className="btn-primary w-full mt-6 mb-4"
                  >
                    Show {filteredProperties.length} Properties
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No properties found</h3>
            <p className="text-sm text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary btn-sm">Clear Filters</button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6'
              : 'space-y-4'
          }>
            {filteredProperties.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        )}

        {/* Load more space on mobile for safe area */}
        <div className="h-4 md:h-0" />
      </div>
    </div>
  );
}
