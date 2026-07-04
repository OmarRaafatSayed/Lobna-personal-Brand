'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Briefcase, PenSquare, Wrench,
  User, Clock, LogOut, Menu, X, ExternalLink, Sparkles, Globe,
} from 'lucide-react'
import api from '@/lib/api'
import { useAdminLang } from '@/contexts/AdminLanguageContext'

const DARK_BG   = 'linear-gradient(160deg,#0F0A14 0%,#2A1040 55%,#3D1060 100%)'
const ROSE      = '#FD93C3'
const ROSE_DK   = '#E8609A'
const ROSE_GRAD = 'linear-gradient(135deg,#FD93C3 0%,#E8609A 100%)'
const FONT_BODY = "'Bricolage Grotesque', sans-serif"
const FONT_HEAD = "'Edu QLD Beginner', cursive"

const navItems = [
  { href: '/admin',               Icon: LayoutDashboard, en: 'Dashboard',     ar: 'الرئيسية' },
  { href: '/admin/bookings',      Icon: Calendar,        en: 'Bookings',       ar: 'الحجوزات' },
  { href: '/admin/jobs',          Icon: Briefcase,       en: 'Jobs',           ar: 'الوظائف' },
  { href: '/admin/blog',          Icon: PenSquare,       en: 'Blog',           ar: 'المدونة' },
  { href: '/admin/tools',         Icon: Wrench,          en: 'Tools',          ar: 'الأدوات' },
  { href: '/admin/profile',       Icon: User,            en: 'Profile',        ar: 'الملف الشخصي' },
  { href: '/admin/working-hours', Icon: Clock,           en: 'Working Hours',  ar: 'ساعات العمل' },
]

/* ── Sidebar content (extracted so mobile + desktop share it) ── */
function SidebarContent({
  pathname, onClose, onLogout,
}: {
  pathname: string
  onClose: () => void
  onLogout: () => void
}) {
  const { locale, toggle, dir, t } = useAdminLang()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} dir={dir} suppressHydrationWarning>

      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(253,147,195,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: ROSE_GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(253,147,195,0.4)', flexShrink: 0 }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: '1.3rem', lineHeight: 1, background: ROSE_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {locale === 'ar' ? 'لبنى' : 'Lobna'}
            </div>
            <div style={{ color: 'rgba(253,147,195,0.4)', fontSize: '0.6rem', marginTop: '2px', fontFamily: FONT_BODY, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {t('Admin Panel', 'لوحة التحكم')}
            </div>
          </div>
        </div>
        <button className="lg:hidden" onClick={onClose}
          style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '8px' }}
          onMouseEnter={e => (e.currentTarget.style.color = ROSE)}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
          <X size={18} />
        </button>
      </div>

      {/* Nav section label */}
      <div style={{ padding: '1rem 1.25rem 0.4rem', fontFamily: FONT_BODY, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(253,147,195,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {t('Menu', 'القائمة')}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 0.75rem' }}>
        {navItems.map(({ href, Icon, en, ar }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '0.65rem 0.875rem', borderRadius: '11px', marginBottom: '2px',
                textDecoration: 'none', fontFamily: FONT_BODY, fontSize: '0.875rem',
                fontWeight: active ? 600 : 400,
                color: active ? '#fff' : 'rgba(255,255,255,0.48)',
                background: active ? ROSE_GRAD : 'transparent',
                boxShadow: active ? '0 4px 14px rgba(253,147,195,0.28)' : 'none',
                transition: 'all 0.18s',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!active) { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(253,147,195,0.08)'; el.style.color = ROSE } }}
              onMouseLeave={e => { if (!active) { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'transparent'; el.style.color = 'rgba(255,255,255,0.48)' } }}>
              <Icon size={17} style={{ flexShrink: 0 }} />
              <span>{locale === 'ar' ? ar : en}</span>
              {active && <span style={{ position: 'absolute', [dir === 'rtl' ? 'right' : 'left']: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '50%', borderRadius: dir === 'rtl' ? '3px 0 0 3px' : '0 3px 3px 0', background: 'rgba(255,255,255,0.55)' }} />}
            </Link>
          )
        })}
      </nav>

      {/* Lang toggle */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(253,147,195,0.08)' }}>
        <button onClick={toggle}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 0.875rem', borderRadius: '11px', width: '100%', background: 'rgba(253,147,195,0.06)', border: '1px solid rgba(253,147,195,0.12)', cursor: 'pointer', fontFamily: FONT_BODY, fontSize: '0.82rem', fontWeight: 600, color: ROSE, transition: 'all 0.2s' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ROSE_GRAD; el.style.color = '#fff'; el.style.border = '1px solid transparent' }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'rgba(253,147,195,0.06)'; el.style.color = ROSE; el.style.border = '1px solid rgba(253,147,195,0.12)' }}>
          <Globe size={16} />
          <span>{locale === 'en' ? 'العربية' : 'English'}</span>
        </button>
      </div>

      {/* Logout */}
      <div style={{ padding: '0 0.75rem 0.75rem' }}>
        <button onClick={onLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.65rem 0.875rem', borderRadius: '11px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT_BODY, fontSize: '0.875rem', color: 'rgba(255,255,255,0.3)', transition: 'all 0.2s' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'rgba(239,68,68,0.1)'; el.style.color = '#f87171' }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'none'; el.style.color = 'rgba(255,255,255,0.3)' }}>
          <LogOut size={17} />
          <span>{t('Logout', 'تسجيل الخروج')}</span>
        </button>
      </div>
    </div>
  )
}

/* ── Main Layout ── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const { locale, toggle, dir, t } = useAdminLang()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const token = localStorage.getItem('lobna_token')
    if (!token) { router.push('/admin/login'); return }
    api.get('/auth/me')
      .then(() => setAuthChecked(true))
      .catch(() => { localStorage.removeItem('lobna_token'); router.push('/admin/login') })
  }, [router])

  const handleLogout = () => { localStorage.removeItem('lobna_token'); router.push('/admin/login') }

  if (!mounted) return null

  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: DARK_BG }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid rgba(253,147,195,0.2)', borderTopColor: ROSE, animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: FONT_BODY, fontSize: '0.875rem' }}>Authenticating...</p>
        </div>
      </div>
    )
  }

  const activeLabel = navItems.find(n => n.href === pathname)
  const currentLabel = activeLabel ? (locale === 'ar' ? activeLabel.ar : activeLabel.en) : (locale === 'ar' ? 'الرئيسية' : 'Dashboard')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F5F3FF' }}>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex"
        style={{ width: '252px', flexShrink: 0, background: DARK_BG, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', boxShadow: '2px 0 28px rgba(15,10,20,0.3)', zIndex: 20 }}>
        <SidebarContent pathname={pathname} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(15,10,20,0.6)', backdropFilter: 'blur(4px)' }} />
            <motion.aside key="panel"
              initial={{ x: dir === 'rtl' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: dir === 'rtl' ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              style={{ position: 'fixed', top: 0, [dir === 'rtl' ? 'right' : 'left']: 0, height: '100vh', width: '252px', zIndex: 50, background: DARK_BG, boxShadow: '4px 0 28px rgba(15,10,20,0.45)' }}
              className="lg:hidden">
              <SidebarContent pathname={pathname} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }} dir={dir} suppressHydrationWarning>

        {/* Topbar */}
        <header style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', height: '60px', background: 'rgba(245,243,255,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(253,147,195,0.1)', boxShadow: '0 1px 12px rgba(15,10,20,0.04)' }}>
          
          {/* Left side: hamburger + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '7px', borderRadius: '9px', color: '#4B3A6E', transition: 'background 0.2s', display: 'flex' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(253,147,195,0.1)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}>
              <Menu size={20} />
            </button>
            <span style={{ fontFamily: FONT_BODY, fontSize: '0.875rem', fontWeight: 600, color: '#4B3A6E' }}>
              {currentLabel}
            </span>
          </div>

          {/* Right side: lang toggle + view site */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Lang toggle */}
            <motion.button
              onClick={toggle}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '99px', background: 'rgba(253,147,195,0.08)', border: '1px solid rgba(253,147,195,0.2)', color: ROSE_DK, fontFamily: FONT_BODY, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ROSE_GRAD; el.style.color = '#fff'; el.style.border = '1px solid transparent'; el.style.boxShadow = '0 4px 14px rgba(253,147,195,0.35)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'rgba(253,147,195,0.08)'; el.style.color = ROSE_DK; el.style.border = '1px solid rgba(253,147,195,0.2)'; el.style.boxShadow = 'none' }}>
              <Globe size={13} />
              {locale === 'en' ? 'عربي' : 'EN'}
            </motion.button>

            {/* View site */}
            <Link href="/" target="_blank"
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '99px', border: '1px solid rgba(253,147,195,0.18)', color: '#8B6BA8', textDecoration: 'none', fontFamily: FONT_BODY, fontSize: '0.78rem', fontWeight: 500, transition: 'all 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ROSE_GRAD; el.style.color = '#fff'; el.style.border = '1px solid transparent'; el.style.boxShadow = '0 4px 12px rgba(253,147,195,0.3)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'transparent'; el.style.color = '#8B6BA8'; el.style.border = '1px solid rgba(253,147,195,0.18)'; el.style.boxShadow = 'none' }}>
              <ExternalLink size={12} />
              {t('View Site', 'عرض الموقع')}
            </Link>
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
