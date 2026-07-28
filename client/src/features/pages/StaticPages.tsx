import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineLightBulb, HiOutlineHeart } from 'react-icons/hi';
import { mockServices, mockFAQs, mockBlogPosts, mockStats, mockProperties } from '@/lib/mockData';
import PropertyCard from '@/components/ui/PropertyCard';
import { StarRating } from '@/components/ui/index';
import { useState } from 'react';
import { HiOutlineChevronDown, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

// ==================== ABOUT ====================
export function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="section-padding bg-gradient-hero text-white text-center">
        <div className="container-custom">
          <motion.h1 initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="text-4xl md:text-5xl font-bold mb-4">About Basobas</motion.h1>
          <motion.p initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }} className="text-xl text-white/85 max-w-2xl mx-auto">
            Organizing Nepal's unorganized real estate market through technology, trust, and transparency.
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Basobas was born from a simple observation: Nepal's real estate market is fragmented, opaque, and dominated by middlemen who add cost without adding value.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We're building a digital platform that connects property owners directly with buyers and renters, eliminating unnecessary intermediaries while providing the verification, legal support, and documentation services that make transactions safe and transparent.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <HiOutlineShieldCheck className="w-8 h-8" />, title: 'Trust', desc: 'Verified properties & owners' },
                { icon: <HiOutlineUserGroup className="w-8 h-8" />, title: 'Direct', desc: 'No middlemen involved' },
                { icon: <HiOutlineLightBulb className="w-8 h-8" />, title: 'Smart', desc: 'AI-powered features' },
                { icon: <HiOutlineHeart className="w-8 h-8" />, title: 'Care', desc: 'Full support & guidance' },
              ].map((v) => (
                <div key={v.title} className="card p-5 text-center">
                  <div className="text-primary-700 mb-2 flex justify-center">{v.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-sm">{v.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="section-title mb-10">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {['CEO', 'CTO', 'Head of Legal', 'Head of Operations'].map((role, i) => (
              <div key={role} className="card p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 mx-auto mb-3 flex items-center justify-center"><span className="text-primary-700 text-xl font-bold">{role[0]}</span></div>
                <p className="text-sm font-semibold text-gray-900">Team Member</p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ==================== SERVICES ====================
export function ServicesPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="section-padding bg-gradient-hero text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-white/85 max-w-xl mx-auto">Comprehensive support for every step of your property journey</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockServices.map((s, i) => (
              <motion.div key={s.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="card p-8 text-center hover:border-primary-100 border border-transparent transition-all">
                <span className="text-4xl mb-4 block">{s.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{s.description}</p>
                {s.price && <p className="text-lg font-bold text-primary-700">Rs. {s.price.toLocaleString()}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ==================== CONTACT ====================
export function ContactPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
            <p className="text-gray-500">Have questions? We'd love to hear from you.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 card p-8">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" className="input" placeholder="Your name" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="input" placeholder="you@example.com" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" className="input" placeholder="+977" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject</label><input type="text" className="input" placeholder="How can we help?" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label><textarea className="input" rows={5} placeholder="Your message..." /></div>
                <button type="submit" className="btn-primary w-full">Send Message</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {[
                { icon: <HiOutlineMail className="w-6 h-6" />, label: 'Email', value: 'info@basobas.com' },
                { icon: <HiOutlinePhone className="w-6 h-6" />, label: 'Phone', value: '+977 980-0000000' },
                { icon: <HiOutlineLocationMarker className="w-6 h-6" />, label: 'Address', value: 'Kathmandu, Nepal' },
              ].map((c) => (
                <div key={c.label} className="card p-6 flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary-50 text-primary-700">{c.icon}</div>
                  <div><p className="text-sm font-medium text-gray-900">{c.label}</p><p className="text-sm text-gray-500">{c.value}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ==================== FAQ ====================
export function FAQPage() {
  const [openId, setOpenId] = useState<string | null>('1');
  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h1>
            <p className="text-gray-500">Everything you need to know about Basobas</p>
          </div>
          <div className="space-y-3">
            {mockFAQs.map((faq) => (
              <div key={faq.id} className="rounded-2xl border border-gray-100 overflow-hidden">
                <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)} className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
                  <HiOutlineChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`} />
                </button>
                {openId === faq.id && <div className="px-6 pb-4"><p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ==================== BLOG ====================
export function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12"><h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Blog & Insights</h1><p className="text-gray-500">Latest updates, guides, and market analysis</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockBlogPosts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay: i*0.1 }}>
                <Link to={`/blog/${post.slug}`} className="block card overflow-hidden group">
                  <div className="aspect-[16/9] overflow-hidden"><img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /></div>
                  <div className="p-5">
                    <div className="flex gap-2 mb-2">{post.tags.slice(0,2).map((t) => <span key={t} className="badge-primary text-[10px]">{t}</span>)}</div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>
                    <p className="text-xs text-gray-400 mt-3">{post.publishedAt}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ==================== WISHLIST ====================
export function WishlistPage() {
  const savedProperties = mockProperties.slice(0, 3);
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-500 text-sm mb-8">{savedProperties.length} saved properties</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
        </div>
      </div>
    </div>
  );
}

// ==================== PROFILE ====================
export function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
        <div className="card p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center"><span className="text-primary-700 text-3xl font-bold">H</span></div>
            <div><h2 className="text-xl font-semibold text-gray-900">Hari Bahadur</h2><p className="text-gray-500 text-sm">buyer@example.com</p><span className="badge-primary mt-1">Buyer</span></div>
          </div>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" className="input" defaultValue="Hari Bahadur" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" className="input" placeholder="+977" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">District</label><input type="text" className="input" defaultValue="Bhaktapur" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" className="input" defaultValue="Bhaktapur" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Bio</label><textarea className="input" rows={3} placeholder="Tell us about yourself..." /></div>
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==================== SETTINGS ====================
export function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
        <div className="space-y-6">
          <div className="card p-6"><h3 className="font-semibold text-gray-900 mb-4">Account</h3>
            <div className="space-y-3"><div className="flex justify-between items-center py-2"><span className="text-sm text-gray-700">Email</span><span className="text-sm text-gray-500">buyer@example.com</span></div>
            <div className="flex justify-between items-center py-2"><span className="text-sm text-gray-700">Password</span><button className="text-sm text-primary-700 font-medium">Change</button></div></div></div>
          <div className="card p-6"><h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-3">{['Email notifications','Push notifications','Visit updates','Chat messages'].map((n)=>(
              <div key={n} className="flex justify-between items-center py-2"><span className="text-sm text-gray-700">{n}</span>
              <button className="w-10 h-6 rounded-full bg-primary-700 relative"><span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" /></button></div>
            ))}</div></div>
          <div className="card p-6"><h3 className="font-semibold text-gray-900 mb-4">Privacy</h3>
            <div className="space-y-3"><div className="flex justify-between items-center py-2"><span className="text-sm text-gray-700">Profile visibility</span><span className="text-sm text-gray-500">Public</span></div></div></div>
          <div className="card p-6 border border-red-100"><h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3><p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back.</p>
            <button className="btn bg-red-50 text-red-600 hover:bg-red-100 text-sm">Delete Account</button></div>
        </div>
      </div>
    </div>
  );
}

// ==================== PRICING ====================
export function PricingPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="section-padding">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Simple, Transparent Pricing</h1>
          <p className="text-gray-500 max-w-xl mx-auto mb-12">Choose the plan that fits your needs. No hidden fees.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Basic', price: 'Free', desc: 'For buyers and tenants', features: ['Browse properties','Save favorites','Contact owners','Book visits','Basic search'] },
              { name: 'Owner', price: 'Rs. 999/mo', desc: 'For property owners', features: ['List up to 10 properties','Property analytics','Chat with buyers','Priority support','Verification badge'], popular: true },
              { name: 'Enterprise', price: 'Custom', desc: 'For agencies & builders', features: ['Unlimited listings','Bulk upload','API access','Dedicated manager','Custom branding'] },
            ].map((plan) => (
              <div key={plan.name} className={`card p-8 text-center relative ${plan.popular ? 'border-2 border-primary-700 ring-4 ring-primary-50' : ''}`}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary-700 text-white text-xs font-semibold">Most Popular</span>}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-3xl font-bold text-primary-700 mt-3 mb-1">{plan.price}</p>
                <p className="text-sm text-gray-500 mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span>{f}</li>)}
                </ul>
                <button className={plan.popular ? 'btn-primary w-full' : 'btn-secondary w-full'}>{plan.price === 'Custom' ? 'Contact Us' : 'Get Started'}</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ==================== PRIVACY & TERMS ====================
export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white pt-20"><div className="container-custom py-12 max-w-3xl prose prose-gray">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-gray-600 text-sm mb-4">Last updated: July 2026</p>
      <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
        <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Information We Collect</h2><p>We collect information you provide directly to us, including your name, email, phone number, and property preferences when you create an account or use our services.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-2">How We Use Your Information</h2><p>We use the information to provide, maintain, and improve our services, to communicate with you, and to personalize your property search experience.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Data Security</h2><p>We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h2><p>If you have questions about this Privacy Policy, please contact us at privacy@basobas.com.</p></section>
      </div>
    </div></div>
  );
}

export function TermsPage() {
  return (
    <div className="min-h-screen bg-white pt-20"><div className="container-custom py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <p className="text-gray-600 text-sm mb-4">Last updated: July 2026</p>
      <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
        <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Acceptance of Terms</h2><p>By accessing and using Basobas, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Use of Service</h2><p>You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use the service for any fraudulent or misleading activities.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-2">User Accounts</h2><p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p></section>
        <section><h2 className="text-lg font-semibold text-gray-900 mb-2">Property Listings</h2><p>Property owners are responsible for the accuracy of their listings. Basobas reserves the right to remove any listing that violates our guidelines.</p></section>
      </div>
    </div></div>
  );
}

// ==================== NOTIFICATIONS ====================
export function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id:'1', title:'Welcome to Basobas!', message:'Start exploring properties.', type:'SYSTEM', isRead:false, createdAt:'2026-07-17T10:00:00Z' },
    { id:'2', title:'Property Verified', message:'Your property has been verified.', type:'VERIFICATION', isRead:false, createdAt:'2026-07-16T15:30:00Z' },
    { id:'3', title:'New Visit Request', message:'Hari Bahadur wants to visit your property.', type:'BOOKING', isRead:true, createdAt:'2026-07-15T09:00:00Z' },
    { id:'4', title:'Finance Approved', message:'Your finance request has been approved.', type:'FINANCE', isRead:true, createdAt:'2026-07-14T11:00:00Z' },
  ]);
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <button className="text-sm text-primary-700 font-medium">Mark all as read</button></div>
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className={`card p-4 flex gap-4 ${!n.isRead ? 'border-l-4 border-primary-700 bg-primary-50/30' : ''}`}>
              <span className="text-xl">{n.type==='SYSTEM'?'🔔':n.type==='VERIFICATION'?'✅':n.type==='BOOKING'?'📅':'💰'}</span>
              <div className="flex-1"><p className="text-sm font-medium text-gray-900">{n.title}</p><p className="text-xs text-gray-500 mt-0.5">{n.message}</p></div>
              {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary-700 mt-2" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
