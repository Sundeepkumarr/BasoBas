import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineChat,
  HiOutlineEye, HiOutlineCheckCircle, HiOutlineXCircle,
} from 'react-icons/hi';
import { StatCard, Badge } from '@/components/ui/index';
import PropertyCard from '@/components/ui/PropertyCard';
import { mockProperties, mockNotifications } from '@/lib/mockData';
import { formatPrice, formatDate, getVisitStatusColor } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────
// Owner Dashboard
// ─────────────────────────────────────────────────────────────
export function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'visits' | 'reviews'>('overview');
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load owner's properties from API
  const loadProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/properties/owner');
      setProperties(data.data?.properties || data.data || []);
    } catch {
      // Fallback to mock data if API not ready
      setProperties(mockProperties.filter((p) => p.ownerId === '2'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadProperties(); }, [loadProperties]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/properties/${id}`);
      toast.success('Property deleted successfully');
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error('Failed to delete property. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const mockVisits = [
    { id: '1', propertyTitle: 'House in Budhanilkantha', visitor: 'Hari Bahadur', date: '2026-07-20', time: 'Morning', status: 'PENDING', message: 'Interested in buying' },
    { id: '2', propertyTitle: 'Land in Thamel', visitor: 'Gita Tamang', date: '2026-07-18', time: 'Afternoon', status: 'ACCEPTED' },
    { id: '3', propertyTitle: 'House in Budhanilkantha', visitor: 'Sunil Rai', date: '2026-07-15', time: 'Evening', status: 'COMPLETED' },
  ];

  const tabs = ['overview', 'properties', 'visits', 'reviews'] as const;

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-[68px]">
      <div className="container-custom py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage your properties and visitor requests</p>
          </div>
          <Link to="/dashboard/owner/add-property" className="btn-primary self-start sm:self-auto">
            <HiOutlinePlus className="w-5 h-5" /> Add Property
          </Link>
        </div>

        {/* Stats — 2-col on mobile, 4-col on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard icon="🏠" value={isLoading ? '—' : properties.length} label="Total Properties" trend="+2 this month" trendUp />
          <StatCard icon="👁️" value="1,430" label="Total Views" trend="+15%" trendUp />
          <StatCard icon="📅" value="8" label="Visit Requests" trend="+3 new" trendUp />
          <StatCard icon="⭐" value="4.8" label="Avg Rating" />
        </div>

        {/* Tab Bar — scrollable on mobile */}
        <div className="tab-bar mb-6 bg-gray-100 rounded-xl p-1 w-fit max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-item ${activeTab === tab ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Recent Properties */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Recent Properties</h3>
                  <button onClick={() => setActiveTab('properties')} className="text-sm text-primary-700 font-medium hover:underline">View All</button>
                </div>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl animate-pulse">
                        <div className="w-16 h-12 rounded-lg bg-gray-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="text-4xl block mb-3">🏠</span>
                    <p className="text-sm text-gray-500 mb-4">You haven't listed any properties yet</p>
                    <Link to="/dashboard/owner/add-property" className="btn-primary btn-sm">
                      <HiOutlinePlus className="w-4 h-4" /> Add Your First Property
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {properties.slice(0, 4).map((property) => (
                      <div key={property.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <img
                          src={property.images?.[0]?.url || `https://placehold.co/64x48/0F766E/white?text=${property.category || 'P'}`}
                          alt=""
                          className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{property.title}</p>
                          <p className="text-xs text-gray-500">{formatPrice(property.price, property.priceType)}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Badge variant={property.status === 'AVAILABLE' ? 'success' : 'gray'}>
                            {property.status}
                          </Badge>
                          <Link to={`/dashboard/owner/edit-property/${property.id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-primary-700 hover:bg-primary-50">
                            <HiOutlinePencil className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Visits */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Recent Visit Requests</h3>
                  <button onClick={() => setActiveTab('visits')} className="text-sm text-primary-700 font-medium hover:underline">View All</button>
                </div>
                <div className="space-y-2">
                  {mockVisits.map((visit) => (
                    <div key={visit.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{visit.visitor}</p>
                        <p className="text-xs text-gray-500 truncate">{visit.propertyTitle}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{visit.date} · {visit.time}</p>
                      </div>
                      <span className={`badge flex-shrink-0 ${getVisitStatusColor(visit.status)}`}>{visit.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-1">
                  <Link to="/dashboard/owner/add-property" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    <HiOutlinePlus className="w-5 h-5 text-primary-700" /> Add New Property
                  </Link>
                  <Link to="/chat" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    <HiOutlineChat className="w-5 h-5 text-primary-700" /> View Messages
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    <HiOutlinePencil className="w-5 h-5 text-primary-700" /> Edit Profile
                  </Link>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Notifications</h3>
                <div className="space-y-2">
                  {mockNotifications.slice(0, 4).map((notif) => (
                    <div key={notif.id} className={`p-3 rounded-xl ${notif.isRead ? 'bg-gray-50' : 'bg-primary-50 border border-primary-100'}`}>
                      <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── PROPERTIES TAB ─── */}
        {activeTab === 'properties' && (
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card p-4 animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-5xl block mb-4">🏠</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties listed yet</h3>
                <p className="text-gray-500 text-sm mb-6">Start by adding your first property</p>
                <Link to="/dashboard/owner/add-property" className="btn-primary">
                  <HiOutlinePlus className="w-5 h-5" /> Add Property
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {properties.map((property, i) => (
                  <motion.div key={property.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="relative group">
                    <PropertyCard property={property} index={i} />
                    {/* Edit/Delete overlay */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/dashboard/owner/edit-property/${property.id}`}
                        className="w-9 h-9 flex items-center justify-center bg-white rounded-xl shadow-md text-primary-700 hover:bg-primary-50"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(property.id, property.title)}
                        disabled={deletingId === property.id}
                        className="w-9 h-9 flex items-center justify-center bg-white rounded-xl shadow-md text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === property.id ? (
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        ) : (
                          <HiOutlineTrash className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── VISITS TAB ─── */}
        {activeTab === 'visits' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto scroll-x-touch">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Visitor', 'Property', 'Date & Time', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockVisits.map((visit) => (
                    <tr key={visit.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 whitespace-nowrap">{visit.visitor}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 max-w-[200px] truncate">{visit.propertyTitle}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">{visit.date} · {visit.time}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${getVisitStatusColor(visit.status)}`}>{visit.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        {visit.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100">
                              <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100">
                              <HiOutlineXCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── REVIEWS TAB ─── */}
        {activeTab === 'reviews' && (
          <div className="card p-6 text-center">
            <span className="text-4xl block mb-3">⭐</span>
            <p className="text-gray-500 text-sm">Reviews from buyers and visitors will appear here once you receive them.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Buyer Dashboard
// ─────────────────────────────────────────────────────────────
export function BuyerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-[68px]">
      <div className="container-custom py-6 md:py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Buyer Dashboard</h1>
        <p className="text-gray-500 text-sm mb-6 md:mb-8">Track your property search journey</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard icon="❤️" value={3} label="Saved Properties" />
          <StatCard icon="📅" value={2} label="Visit Requests" />
          <StatCard icon="💬" value={4} label="Active Chats" />
          <StatCard icon="🔍" value={15} label="Views" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card p-5 mb-5">
              <h3 className="font-semibold text-gray-900 mb-4">Recommended Properties</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockProperties.slice(0, 4).map((property, i) => (
                  <PropertyCard key={property.id} property={property} index={i} />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
              <div className="space-y-1">
                {[
                  { to: '/properties', icon: '🔍', label: 'Search Properties' },
                  { to: '/wishlist', icon: '❤️', label: 'My Wishlist' },
                  { to: '/chat', icon: '💬', label: 'Messages' },
                  { to: '/finance', icon: '💰', label: 'Finance Tools' },
                ].map((link) => (
                  <Link key={link.to} to={link.to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700">
                    <span>{link.icon}</span> {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {['Viewed "Luxurious 3BHK House" — 2h ago', 'Saved "Modern Apartment" — 1d ago', 'Booked visit for "Villa in Godawari" — 3d ago'].map((a, i) => (
                  <p key={i} className="text-sm text-gray-600 p-3 bg-gray-50 rounded-xl">{a}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Admin Dashboard
// ─────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'properties' | 'requests'>('overview');

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-[68px]">
      <div className="container-custom py-6 md:py-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage platform operations</p>
          </div>
          <Badge variant="primary">🛡️ Admin</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard icon="👥" value="1,250" label="Users" trend="+12%" trendUp />
          <StatCard icon="🏠" value="486" label="Properties" trend="+8%" trendUp />
          <StatCard icon="⏳" value="12" label="Pending" />
          <StatCard icon="📅" value="45" label="Visits" />
          <StatCard icon="⭐" value="324" label="Reviews" />
          <StatCard icon="💰" value="18" label="Finance" />
        </div>

        <div className="tab-bar mb-6 bg-gray-100 rounded-xl p-1 w-fit max-w-full">
          {(['overview', 'users', 'properties', 'requests'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-item ${activeTab === tab ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Pending Approvals</h3>
              <div className="space-y-3">
                {mockProperties.slice(0, 3).map((prop) => (
                  <div key={prop.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <img src={prop.images[0]?.url} alt="" className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{prop.title}</p>
                      <p className="text-xs text-gray-500">{prop.owner?.profile?.fullName}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button className="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100">Approve</button>
                      <button className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Users</h3>
              <div className="space-y-3">
                {[
                  { name: 'Ramesh Shrestha', role: 'OWNER', email: 'ramesh@example.com', verified: true },
                  { name: 'Hari Bahadur', role: 'BUYER', email: 'buyer@example.com', verified: true },
                  { name: 'New User', role: 'TENANT', email: 'new@example.com', verified: false },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 font-semibold text-sm">{user.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Badge variant={user.role === 'OWNER' ? 'accent' : 'gray'}>{user.role}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Revenue Overview</h3>
              <div className="flex items-center justify-center h-36 bg-gray-50 rounded-xl text-gray-400 text-sm">📊 Revenue chart coming soon</div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Analytics</h3>
              <div className="flex items-center justify-center h-36 bg-gray-50 rounded-xl text-gray-400 text-sm">📈 Analytics coming soon</div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockProperties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
          </div>
        )}

        {(activeTab === 'users' || activeTab === 'requests') && (
          <div className="card p-6 text-center">
            <span className="text-4xl block mb-3">🚧</span>
            <p className="text-sm text-gray-500">This section is coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
