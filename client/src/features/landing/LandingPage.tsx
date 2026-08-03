import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineShieldCheck, HiOutlineDocumentText, HiOutlineChatAlt2, HiOutlineCurrencyDollar, HiOutlineChevronDown, HiOutlineArrowRight } from 'react-icons/hi';
import PropertyCard from '@/components/ui/PropertyCard';
import { StarRating } from '@/components/ui/index';
import { mockProperties, mockCategories, mockTestimonials, mockStats, mockFAQs } from '@/lib/mockData';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<string | null>('1');
  const navigate = useNavigate();
  const featuredProperties = mockProperties.filter((p) => p.isFeatured).slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="overflow-hidden">
      {/* ============================== HERO ============================== */}
      <section className="relative min-h-[92vh] flex items-center bg-[linear-gradient(135deg,#f8fbff_0%,#eaf3ff_45%,#bfdbfe_100%)] text-slate-800">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-accent/10 blur-3xl" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5" />
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white/70 text-sm text-slate-700 mb-6 shadow-sm">
                🏠 Nepal's #1 Digital Real Estate Marketplace
              </motion.span>

              <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-slate-900">
                Find Your Dream<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-primary-500">Property</span> in Nepal
              </motion.h1>

              <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-slate-600 max-w-xl mb-8 leading-relaxed">
                Connect directly with property owners. No middlemen, no hidden fees. Just verified properties and trusted transactions.
              </motion.p>

              {/* Search Bar */}
              <motion.form variants={fadeUp} custom={3} onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                <div className="flex-1 relative">
                  <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location, property type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-soft-lg border border-slate-200"
                  />
                </div>
                <button type="submit" className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all hover:shadow-lg active:scale-[0.98]">
                  Search
                </button>
              </motion.form>

              {/* Quick Stats */}
              <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-8 mt-10">
                {[
                  { value: '1,200+', label: 'Properties' },
                  { value: '850+', label: 'Happy Customers' },
                  { value: '340+', label: 'Verified Owners' },
                  { value: '25+', label: 'Cities' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================== CATEGORIES ============================== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="section-title">Browse by Category</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="section-subtitle mx-auto mt-3">
              Explore properties across 10 categories tailored for Nepal's market
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {mockCategories.map((cat, i) => (
              <motion.div key={cat.id} variants={fadeUp} custom={i}>
                <Link
                  to={`/properties?category=${cat.slug.toUpperCase().replace(/-/g, '_')}`}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 border border-transparent hover:border-primary-100 transition-all group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700 transition-colors">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================== FEATURED PROPERTIES ============================== */}
      <section className="section-padding bg-[#f7f3eb]">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Properties</h2>
              <p className="section-subtitle mt-2">Hand-picked properties verified by our team</p>
            </div>
            <Link to="/properties" className="hidden md:flex items-center gap-1 text-primary-700 font-medium hover:gap-2 transition-all">
              View All <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/properties" className="btn-primary">View All Properties</Link>
          </div>
        </div>
      </section>

      {/* ============================== HOW IT WORKS ============================== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fadeUp} className="section-title">How Hamro Awas Works</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="section-subtitle mx-auto mt-3">
              Simple, transparent, and hassle-free property transactions
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: '🔍', title: 'Search & Discover', desc: 'Browse thousands of verified properties across Nepal with advanced filters.' },
              { step: '02', icon: '📋', title: 'Connect & Visit', desc: 'Schedule property visits and connect directly with verified owners.' },
              { step: '03', icon: '📄', title: 'Documentation', desc: 'Get complete documentation support, legal assistance, and verification.' },
              { step: '04', icon: '🎉', title: 'Close the Deal', desc: 'Complete your property transaction with confidence and transparency.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl group-hover:bg-primary-100 transition-colors">
                  {item.icon}
                </div>
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-6xl font-black text-gray-100 select-none -z-10">{item.step}</span>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== WHY CHOOSE US ============================== */}
      <section className="section-padding bg-gradient-dark text-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Hamro Awas?</h2>
            <p className="text-white/85 mt-3 max-w-xl mx-auto">
              We're not just a marketplace — we're your trusted partner in every step of your property journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <HiOutlineShieldCheck className="w-7 h-7" />, title: 'Verified Properties', desc: 'Every property is physically inspected and documents are verified by our team.' },
              { icon: <HiOutlineDocumentText className="w-7 h-7" />, title: 'Legal Support', desc: 'Complete legal assistance from agreement to registration with expert guidance.' },
              { icon: <HiOutlineChatAlt2 className="w-7 h-7" />, title: 'Direct Communication', desc: 'Chat directly with property owners — no middlemen, no hidden commissions.' },
              { icon: <HiOutlineCurrencyDollar className="w-7 h-7" />, title: 'Fair Pricing', desc: 'Market analysis based fair price guidance so you never overpay.' },
              { icon: <HiOutlineLocationMarker className="w-7 h-7" />, title: 'Location Intelligence', desc: 'Nearby schools, hospitals, and markets info for every property listing.' },
              { icon: <HiOutlineSearch className="w-7 h-7" />, title: 'Smart Search', desc: 'Advanced filters and AI-powered recommendations for perfect matches.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-primary-300 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== STATISTICS ============================== */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: `${mockStats.totalProperties.toLocaleString()}+`, label: 'Listed Properties', icon: '🏠' },
              { value: `${mockStats.happyCustomers.toLocaleString()}+`, label: 'Happy Customers', icon: '😊' },
              { value: `${mockStats.verifiedOwners}+`, label: 'Verified Owners', icon: '✅' },
              { value: `${mockStats.citiesCovered}+`, label: 'Cities Covered', icon: '📍' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className="text-3xl mb-2 block">{stat.icon}</span>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== TESTIMONIALS ============================== */}
      <section className="section-padding bg-[#f7f3eb]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle mx-auto mt-3">Real stories from real people who found their perfect property</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTestimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <StarRating rating={testimonial.rating} size="sm" />
                <p className="text-sm text-gray-600 mt-4 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-sm">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role} • {testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== FAQ ============================== */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle mx-auto mt-3">Got questions? We've got answers.</p>
          </div>

          <div className="space-y-3">
            {mockFAQs.slice(0, 6).map((faq) => (
              <motion.div key={faq.id} layout className="rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
                  <HiOutlineChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFAQ === faq.id ? 'rotate-180' : ''}`} />
                </button>
                {openFAQ === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/faq" className="btn-secondary btn-sm">View All FAQs</Link>
          </div>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="py-20 bg-[linear-gradient(135deg,#ffffff_0%,#dbeafe_100%)]">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Ready to Find Your Perfect Property?</h2>
          <p className="text-slate-700 max-w-xl mx-auto mb-8">
            Join thousands of satisfied customers who found their dream property through Hamro Awas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/properties" className="btn bg-white text-primary-700 hover:bg-gray-50 btn-lg font-semibold">
              Browse Properties
            </Link>
            <Link to="/auth/register" className="btn border-2 border-slate-300 text-slate-800 hover:bg-slate-100 btn-lg">
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
