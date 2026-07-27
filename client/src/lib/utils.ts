export const formatPrice = (price: number, priceType?: string): string => {
  if (priceType === 'RENT') {
    return `Rs. ${price.toLocaleString('en-IN')}/mo`;
  }
  if (price >= 10000000) return `Rs. ${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `Rs. ${(price / 100000).toFixed(2)} Lakh`;
  return `Rs. ${price.toLocaleString('en-IN')}`;
};

export const formatArea = (area: number, unit: string = 'sq.ft'): string => {
  return `${area.toLocaleString('en-IN')} ${unit}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatRelativeTime = (date: string): string => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    LAND: 'Land',
    HOUSE: 'House',
    APARTMENT: 'Apartment',
    FLAT: 'Flat',
    ROOM_RENTAL: 'Room Rental',
    COMMERCIAL_BUILDING: 'Commercial Building',
    OFFICE_SPACE: 'Office Space',
    SHOP: 'Shop',
    HOSTEL: 'Hostel',
    WAREHOUSE: 'Warehouse',
  };
  return labels[category] || category;
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    LAND: '🏞️',
    HOUSE: '🏠',
    APARTMENT: '🏢',
    FLAT: '🏬',
    ROOM_RENTAL: '🛏️',
    COMMERCIAL_BUILDING: '🏗️',
    OFFICE_SPACE: '💼',
    SHOP: '🏪',
    HOSTEL: '🏨',
    WAREHOUSE: '🏭',
  };
  return icons[category] || '🏠';
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    AVAILABLE: 'bg-green-50 text-green-700',
    SOLD: 'bg-red-50 text-red-700',
    RENTED: 'bg-blue-50 text-blue-700',
    PENDING: 'bg-yellow-50 text-yellow-700',
  };
  return colors[status] || 'bg-gray-50 text-gray-700';
};

export const getVisitStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700',
    ACCEPTED: 'bg-green-50 text-green-700',
    REJECTED: 'bg-red-50 text-red-700',
    COMPLETED: 'bg-blue-50 text-blue-700',
    CANCELLED: 'bg-gray-50 text-gray-700',
  };
  return colors[status] || 'bg-gray-50 text-gray-700';
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};
