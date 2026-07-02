'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

/* ─── Typography ─── */
const FD = 'Boldonse, cursive'
const FH = "'Edu QLD Beginner', cursive"
const FB = "'Bricolage Grotesque', sans-serif"

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const socialIcons = [
  { icon: <LinkedinIcon />,  href: '#' },
  { icon: <InstagramIcon />, href: '#' },
  { icon: <TwitterIcon />,   href: '#' },
]

export default function Footer() {
  const { t, dir, locale } = useLanguage()

  const navLinks = [
    { href: `/${locale}`,         label: locale === 'ar' ? 'الرئيسية' : 'Home' },
    { href: `/${locale}/jobs`,    label: t('jobs') },
    { href: `/${locale}/tools`,   label: t('tools') },
    { href: `/${locale}/blog`,    label: t('blog') },
    { href: '#booking',           label: t('bookConsultationShort') },
  ]

  const contactItems = [
    { icon: '📅', text: t('workDays') },
    { icon: '🕐', text: t('workHours') },
    { icon: '💬', text: t('whatsappAfterBooking') },
  ]

  return (
    <footer style={{ background: '#0F0A14', position: 'relative', overflow: 'hidden', direction: dir }}>

      {/* Top separator */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(253,147,195,0.3), transparent)' }} />

      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 384, height: 384, borderRadius: '50%', background: 'rgba(253,147,195,0.04)', filter: 'blur(120px)', pointerEvents: 'none' }} />

      <div className="wrap" style={{ position: 'relative', zIndex: 10, padding: 'clamp(3.5rem, 8vw, 5rem) 1.5rem' }}>

        <div className="footer-grid" style={{ marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>

          {/* Brand */}
          <div>
            <Link href={`/${locale}`} style={{
              fontFamily: FD, fontSize: '2.5rem', textDecoration: 'none',
              display: 'block', marginBottom: '1rem',
              background: 'linear-gradient(135deg,#FD93C3,#E8609A)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {locale === 'ar' ? 'لبنى' : 'Lobna'}
            </Link>
            <p style={{ fontFamily: FB, fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.4)', maxWidth: 280, marginBottom: '1.5rem' }}>
              {t('footerDesc')}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {socialIcons.map(({ icon, href }, i) => (
                <motion.a key={i} href={href}
                  whileHover={{ scale: 1.1, backgroundColor: '#FD93C3', color: '#fff', borderColor: '#FD93C3' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', transition: 'all 0.2s' }}>
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            {/* H2 — Edu QLD Beginner */}
            <h2 style={{ fontFamily: FH, fontSize: '1.125rem', color: '#FD93C3', marginBottom: '1.25rem' }}>
              {t('quickLinks')}
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {navLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    style={{ fontFamily: FB, fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#FD93C3')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(253,147,195,0.4)', flexShrink: 0 }} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            {/* H2 — Edu QLD Beginner */}
            <h2 style={{ fontFamily: FH, fontSize: '1.125rem', color: '#FD93C3', marginBottom: '1.25rem' }}>
              {t('contactMe')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1.5rem' }}>
              {contactItems.map(item => (
                <p key={item.text} style={{ fontFamily: FB, fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{item.icon}</span> {item.text}
                </p>
              ))}
            </div>
            <Link href="#booking" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.75rem 1.5rem' }}>
              {t('bookNow')}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          fontFamily: FB, fontSize: '0.75rem', color: 'rgba(255,255,255,0.22)',
        }}>
          <p>© {new Date().getFullYear()} {locale === 'ar' ? 'لبنى — جميع الحقوق محفوظة' : t('copyright')}</p>
          <p>{t('madeWith')}</p>
        </div>
      </div>
    </footer>
  )
}
