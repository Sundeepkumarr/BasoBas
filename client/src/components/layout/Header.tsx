import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMenu, HiOutlineX, HiOutlineBell, HiOutlineChat,
  HiOutlineHeart, HiOutlineUser, HiOutlinePlus, HiOutlineViewGrid,
  HiOutlineLogout, HiOutlineCog,
} from 'react-icons/hi';
import { useAuth } from '@/stores/AuthContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/finance', label: 'Finance' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // Shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === 'OWNER') return { href: '/dashboard/owner', label: '📊 Owner Dashboard' };
    if (user.role === 'ADMIN') return { href: '/dashboard/admin', label: '🛡️ Admin Dashboard' };
    return { href: '/dashboard/buyer', label: '📋 My Dashboard' };
  };

  const dashboardLink = getDashboardLink();

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 glass border-b transition-shadow duration-200 ${scrolled ? 'shadow-soft' : 'border-gray-100/50'}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-[68px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <img src="/basobas-logo.svg" alt="Basobas" className="w-11 h-11 object-contain" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Baso<span className="text-primary-700">bas</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {/* List Property shortcut for owners */}
                  {user?.role === 'OWNER' && (
                    <Link
                      to="/dashboard/owner/add-property"
                      className="btn-primary btn-sm gap-1"
                    >
                      <HiOutlinePlus className="w-4 h-4" /> List Property
                    </Link>
                  )}

                  <Link to="/wishlist" className="p-2.5 rounded-xl text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-all" title="Wishlist">
                    <HiOutlineHeart className="w-5 h-5" />
                  </Link>
                  <Link to="/chat" className="p-2.5 rounded-xl text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-all" title="Chat">
                    <HiOutlineChat className="w-5 h-5" />
                  </Link>
                  <Link to="/notifications" className="p-2.5 rounded-xl text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-all relative" title="Notifications">
                    <HiOutlineBell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative ml-1">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-50 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-sm">
                          {user?.profile?.fullName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                        {user?.profile?.fullName?.split(' ')[0] || 'User'}
                      </span>
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <>
                          {/* Backdrop */}
                          <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-soft-lg border border-gray-100 py-2 z-50"
                          >
                            <div className="px-4 py-3 border-b border-gray-100">
                              <p className="text-sm font-semibold text-gray-900">{user?.profile?.fullName || 'User'}</p>
                              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                              <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-primary-700 uppercase tracking-wide">
                                {user?.role}
                              </span>
                            </div>

                            <div className="py-1">
                              {dashboardLink && (
                                <Link to={dashboardLink.href} onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                  <HiOutlineViewGrid className="w-4 h-4 text-gray-400" /> Dashboard
                                </Link>
                              )}
                              <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <HiOutlineUser className="w-4 h-4 text-gray-400" /> Profile
                              </Link>
                              {user?.role === 'OWNER' && (
                                <Link to="/dashboard/owner/add-property" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 transition-colors font-medium">
                                  <HiOutlinePlus className="w-4 h-4" /> Add Property
                                </Link>
                              )}
                              <Link to="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <HiOutlineCog className="w-4 h-4 text-gray-400" /> Settings
                              </Link>
                            </div>

                            <div className="border-t border-gray-100 pt-1">
                              <button
                                onClick={() => { logout(); setShowUserMenu(false); }}
                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <HiOutlineLogout className="w-4 h-4" /> Logout
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth/login" className="btn-ghost btn-sm">Log In</Link>
                  <Link to="/auth/register" className="btn-primary btn-sm">Get Started</Link>
                </div>
              )}
            </div>

            {/* Mobile Right Actions */}
            <div className="flex items-center gap-1 lg:hidden">
              {isAuthenticated && (
                <>
                  <Link to="/notifications" className="p-2.5 rounded-xl text-gray-500 hover:text-primary-700 relative">
                    <HiOutlineBell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
                  </Link>
                  {user?.role === 'OWNER' && (
                    <Link to="/dashboard/owner/add-property" className="p-2.5 rounded-xl text-primary-700 bg-primary-50">
                      <HiOutlinePlus className="w-5 h-5" />
                    </Link>
                  )}
                </>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white z-50 shadow-2xl flex flex-col lg:hidden overflow-y-auto"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <img src="/basobas-logo.svg" alt="Basobas" className="w-8 h-8 object-contain" />
                  <span className="font-bold text-gray-900">Basobas</span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>

              {/* User Info (if logged in) */}
              {isAuthenticated && (
                <div className="px-5 py-4 bg-primary-50/50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold">
                        {user?.profile?.fullName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{user?.profile?.fullName || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-100 text-primary-700 uppercase">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav Links */}
              <div className="flex-1 px-3 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Authenticated extras */}
                {isAuthenticated && (
                  <div className="pt-3 mt-3 border-t border-gray-100 space-y-1">
                    {dashboardLink && (
                      <Link to={dashboardLink.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <HiOutlineViewGrid className="w-5 h-5 text-gray-400" /> Dashboard
                      </Link>
                    )}
                    {user?.role === 'OWNER' && (
                      <Link to="/dashboard/owner/add-property" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100">
                        <HiOutlinePlus className="w-5 h-5" /> Add Property
                      </Link>
                    )}
                    <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                      <HiOutlineHeart className="w-5 h-5 text-gray-400" /> Wishlist
                    </Link>
                    <Link to="/chat" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                      <HiOutlineChat className="w-5 h-5 text-gray-400" /> Messages
                    </Link>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                      <HiOutlineUser className="w-5 h-5 text-gray-400" /> Profile
                    </Link>
                    <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                      <HiOutlineCog className="w-5 h-5 text-gray-400" /> Settings
                    </Link>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="px-4 py-4 border-t border-gray-100 safe-area-pb">
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <HiOutlineLogout className="w-5 h-5" /> Logout
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/auth/register" onClick={() => setIsOpen(false)} className="btn-primary w-full justify-center">
                      Get Started — It's Free
                    </Link>
                    <Link to="/auth/login" onClick={() => setIsOpen(false)} className="btn-ghost w-full justify-center">
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
