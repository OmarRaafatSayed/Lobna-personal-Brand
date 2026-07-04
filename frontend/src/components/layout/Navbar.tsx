'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { Globe } from 'lucide-react'
import BottomNav from './BottomNav'

export default function Navbar() {
  const { locale, setLocale, t, dir } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const links = mounted
    ? [
        { href: '#about', label: t('about') },
        { href: `/${locale}/jobs`, label: t('jobs') },
        { href: `/${locale}/tools`, label: t('tools') },
        { href: `/${locale}/blog`, label: t('blog') },
      ]
    : []

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const toggleLanguage = () => {
    if (!mounted) return
    setLocale(locale === 'ar' ? 'en' : 'ar')
  }

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    padding: scrolled ? '0.75rem 0' : '1.25rem 0',
    background: scrolled ? 'rgba(15,10,20,0.90)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
    boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
    transition: 'all 0.3s ease',
  }

  if (!mounted) {
    return (
      <header style={headerStyle}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'Boldonse, cursive',
              fontSize: '1.6rem',
              textDecoration: 'none',
              background: 'linear-gradient(135deg,#FD93C3,#E8609A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Lobna
          </Link>
        </div>
      </header>
    )
  }

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
        style={headerStyle}
      >
        <div
          className="wrap"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: dir }}
        >
          <Link
            href={`/${locale}`}
            style={{
              fontFamily: 'Boldonse, cursive',
              fontSize: '1.6rem',
              textDecoration: 'none',
              background: 'linear-gradient(135deg,#FD93C3,#E8609A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {locale === 'ar' ? 'لبنى' : 'Lobna'}
          </Link>

          <nav className="desktop-nav" style={{ alignItems: 'center', gap: '2rem' }}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: 'rgba(255,255,255,0.72)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FD93C3')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.72)')}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="desktop-nav" style={{ alignItems: 'center', gap: '0.75rem' }}>
            <motion.button
              onClick={toggleLanguage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '0.5rem 0.875rem',
                borderRadius: 99,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(253,147,195,0.12)'
                e.currentTarget.style.borderColor = 'rgba(253,147,195,0.3)'
                e.currentTarget.style.color = '#FD93C3'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
              }}
            >
              <Globe size={14} />
              {locale === 'ar' ? 'EN' : 'AR'}
            </motion.button>

            <Link
              href="#booking"
              className="btn-primary"
              style={{ fontSize: '0.875rem', padding: '0.625rem 1.5rem' }}
            >
              {t('bookNow')}
            </Link>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={t('menu')}
            className="mobile-hamburger"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              flexDirection: 'column',
              gap: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                display: 'block',
                width: 24,
                height: 2,
                background: '#fff',
                borderRadius: 2,
                transition: 'all 0.3s',
                transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: 24,
                height: 2,
                background: '#fff',
                borderRadius: 2,
                transition: 'all 0.3s',
                opacity: open ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: 24,
                height: 2,
                background: '#fff',
                borderRadius: 2,
                transition: 'all 0.3s',
                transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
              }}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed',
              top: 64,
              left: 0,
              right: 0,
              zIndex: 40,
              background: 'rgba(15,10,20,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              direction: dir,
            }}
          >
            <div className="wrap" style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    color: 'rgba(255,255,255,0.78)',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    padding: '6px 0',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FD93C3')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.78)')}
                >
                  {l.label}
                </Link>
              ))}

              <button
                onClick={() => {
                  toggleLanguage()
                  setOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '0.75rem',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: 8,
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                <Globe size={16} />
                {locale === 'ar' ? 'English' : 'Arabic'}
              </button>

              <Link
                href="#booking"
                onClick={() => setOpen(false)}
                className="btn-primary"
                style={{ marginTop: 8, textAlign: 'center' }}
              >
                {t('bookNow')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </>
  )
}
