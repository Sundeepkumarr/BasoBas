import { cn } from '@/lib/utils';

// ==========================================
// LOADING SKELETON
// ==========================================

export function PropertyCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-3 pt-3 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-10" />
          <div className="h-4 bg-gray-200 rounded w-10" />
        </div>
      </div>
    </div>
  );
}

export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-4 bg-gray-200 rounded animate-pulse ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

// ==========================================
// EMPTY STATE
// ==========================================

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ icon, value, label, trend, trendUp }: StatCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

// ==========================================
// STAR RATING
// ==========================================

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export function StarRating({ rating, size = 'md', showValue = false }: StarRatingProps) {
  const sizeClass = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' }[size];
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={cn(sizeClass, star <= rating ? 'text-accent' : 'text-gray-300')}>
          ★
        </span>
      ))}
      {showValue && <span className="text-sm font-medium text-gray-600 ml-1">{rating.toFixed(1)}</span>}
    </div>
  );
}

// ==========================================
// BADGE
// ==========================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'success' | 'error' | 'gray';
  className?: string;
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  const variants = {
    primary: 'bg-primary-50 text-primary-700',
    accent: 'bg-accent-50 text-accent-700',
    success: 'bg-green-50 text-green-700',
    error: 'bg-red-50 text-red-700',
    gray: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={cn('badge', variants[variant], className)}>{children}</span>
  );
}

// ==========================================
// MODAL
// ==========================================

import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX } from 'react-icons/hi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const sizeClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size];
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn('relative bg-white rounded-2xl shadow-soft-xl w-full overflow-hidden', sizeClass)}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <HiOutlineX className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
