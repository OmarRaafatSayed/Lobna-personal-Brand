'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Briefcase, Wrench, BookOpen, Calendar } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const ROSE      = '#E8609A'
const ROSE_GRAD = 'linear-gradient(135deg,#FD93C3,#E8609A)'
const FB        = "'Bricolage Grotesque', sans-serif"

export default function BottomNav() {
  const { locale, t } = useLanguage()
  const pathname = usePathname()

  const items = [
    { href: `/${locale}`,        icon: Home,      labelEn: 'Home',    labelAr: 'الرئيسية' },
    { href: `/${locale}/jobs`,   icon: Briefcase, labelEn: 'Jobs',    labelAr: 'وظائف'    },
    { href: `#booking`,          icon: Calendar,  labelEn: 'Book',    labelAr: 'حجز',  special: true },
    { href: `/${locale}/tools`,  icon: Wrench,    labelEn: 'Tools',   labelAr: 'أدوات'    },
    { href: `/${locale}/blog`,   icon: BookOpen,  labelEn: 'Blog',    labelAr: 'مدونة'    },
  ]

  const isActive = (href: string) => {
    if (href.startsWith('#')) return false
    if (href === `/${locale}` || href === `/${locale}/`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(15,10,20,0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(253,147,195,0.12)',
        boxShadow: '0 -8px 32px rgba(15,10,20,0.4)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {items.map(({ href, icon: Icon, labelEn, labelAr, special }) => {
        const active = isActive(href)
        const label = locale === 'ar' ? labelAr : labelEn

        if (special) {
          // Center "Book" button — elevated pill style
          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: '0.55rem',
                textDecoration: 'none',
                position: 'relative',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  position: 'absolute',
                  top: '-18px',
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: ROSE_GRAD,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(232,96,154,0.45), 0 0 0 4px rgba(15,10,20,0.96)',
                }}
              >
                <Icon size={22} color="#fff" strokeWidth={2.2} />
              </motion.div>
              <span
                style={{
                  fontFamily: FB,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: ROSE,
                  letterSpacing: '0.02em',
                  marginTop: '2px',
                }}
              >
                {label}
              </span>
            </Link>
          )
        }

        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              padding: '0.6rem 0.25rem 0.55rem',
              textDecoration: 'none',
              position: 'relative',
              transition: 'opacity 0.2s',
            }}
          >
            {/* Active top indicator */}
            {active && (
              <motion.div
                layoutId="bottom-nav-indicator"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '28px',
                  height: '2.5px',
                  borderRadius: '0 0 4px 4px',
                  background: ROSE_GRAD,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            <motion.div
              animate={{ scale: active ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.2 : 1.8}
                color={active ? ROSE : 'rgba(255,255,255,0.38)'}
              />
            </motion.div>

            <span
              style={{
                fontFamily: FB,
                fontSize: '0.62rem',
                fontWeight: active ? 700 : 500,
                color: active ? ROSE : 'rgba(255,255,255,0.38)',
                letterSpacing: '0.01em',
                transition: 'color 0.2s',
              }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
