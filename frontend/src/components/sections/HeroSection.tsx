'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Profile } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

/* ─── Brand colors ─── */
const C = {
  rose:       '#FD93C3',
  cream:      '#FBF9F7',
  green:      '#B2BA0C',
  blue:       '#8EB5D2',
  dark:       '#0F0A14',
  dark2:      '#1A1025',
  purple:     '#2A1040',
  deepPurple: '#3D1060',
} as const

/* ─── Typography ─── */
const FD = 'Boldonse, cursive'
const FH = "'Edu QLD Beginner', cursive"
const FB = "'Bricolage Grotesque', sans-serif"

function useCounter(target: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return count
}

function StatItem({ value, suffix, label, delay, inView }: {
  value: number; suffix: string; label: string; delay: number; inView: boolean
}) {
  const count = useCounter(value, inView, 1600)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay, duration: 0.4 }}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 6,
      }}
    >
      {/* Number — Boldonse */}
      <span style={{
        fontFamily: FD,
        /* clamp: 1.5rem on tiny phone → scales up to 2.5rem on desktop */
        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
        lineHeight: 1.2,
        background: `linear-gradient(135deg, ${C.rose}, #E8609A)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        fontWeight: 700, whiteSpace: 'nowrap',
        display: 'block',
        paddingTop: '0.25rem',
      }}>
        {count}{suffix}
      </span>
      {/* Label — Bricolage */}
      <span style={{
        fontFamily: FB, fontSize: '0.75rem', fontWeight: 500,
        color: 'rgba(255,255,255,0.5)', letterSpacing: '0.03em',
        textAlign: 'center', display: 'block',
        /* allow label to wrap on very small screens */
        whiteSpace: 'normal', maxWidth: 80,
      }}>
        {label}
      </span>
    </motion.div>
  )
}

/* ─── Text column ─── */
function TextColumn({ name, tagline, title, bio, t, locale }: {
  name: string; tagline: string; title: string; bio: string
  t: (k: string) => string; locale: string
}) {
  return (
    <div className="hero-text-col">

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="hero-text-center"
      >
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 22px', borderRadius: 99,
          background: 'rgba(253,147,195,0.1)',
          border: '1.5px solid rgba(253,147,195,0.3)',
          color: C.rose,
          fontFamily: FB, fontSize: '0.8rem', fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          ✦ {tagline}
        </span>
      </motion.div>

      {/* H1 — Boldonse — mobile-first: 2.5rem → desktop: 6rem */}
      <motion.h1
        initial={{ opacity: 0, x: locale === 'en' ? -25 : 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, delay: 0.3 }}
        className="hero-text-center"
        style={{
          fontFamily: FD,
          fontSize: 'clamp(2.5rem, 10vw, 6rem)',
          lineHeight: 1.05, color: '#fff', margin: 0,
        }}
      >
        {name}
      </motion.h1>

      {/* H2 — Edu QLD Beginner */}
      <motion.h2
        initial={{ opacity: 0, x: locale === 'en' ? -25 : 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, delay: 0.5 }}
        className="hero-text-center"
        style={{
          fontFamily: FH,
          fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
          fontWeight: 600, lineHeight: 1.5,
          background: `linear-gradient(135deg, ${C.rose}, #E8609A, ${C.blue})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          margin: 0,
        }}
      >
        {title}
      </motion.h2>

      {/* Paragraph — Bricolage */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="hero-text-center"
        style={{
          fontFamily: FB,
          fontSize: 'clamp(0.9rem, 1.8vw, 1.125rem)',
          fontWeight: 400, lineHeight: 1.85,
          color: 'rgba(255,255,255,0.65)',
          maxWidth: 540, margin: '0 auto',
        }}
      >
        {bio}
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="hero-cta-row"
      >
        <Link href="#booking" className="btn-primary">{t('bookConsultation')}</Link>
        <Link href="#about" className="btn-outline">{t('getToKnow')}</Link>
      </motion.div>
    </div>
  )
}

/* ─── Photo column ─── */
function PhotoColumn({ name }: { name: string }) {
  return (
    <motion.div
      className="hero-photo-wrap"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.85, delay: 0.25 }}
    >
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '4/5',
        borderRadius: '2rem', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        border: '2px solid rgba(253,147,195,0.2)',
      }}>
        <Image
          src="/lobna.jpg" alt={name} fill
          sizes="(max-width: 767px) 260px, 380px"
          priority
          style={{ objectFit: 'cover', objectPosition: 'top center' }}
        />
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function HeroSection({ profile }: { profile: Profile | null }) {
  const { t, locale, dir } = useLanguage()
  const [statsVisible, setStatsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const timer = setTimeout(() => setStatsVisible(true), 800)
    return () => clearTimeout(timer)
  }, [mounted])

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [mounted])

  const name    = locale === 'en' ? 'Lobna' : (profile?.name ?? 'لبنى')
  const title   = locale === 'en' ? t('title')   : (profile?.title ?? t('title'))
  const bio     = locale === 'en' ? t('bio')     : (profile?.heroSubtitle ?? t('bio'))
  const tagline = locale === 'en' ? t('tagline') : (profile?.heroTagline ?? t('tagline'))

  const stats = [
    { value: profile?.stats?.clients     ?? 150, suffix: '+', label: t('statClients') },
    { value: profile?.stats?.experience  ?? 8,   suffix: '+', label: t('statExperience') },
    { value: profile?.stats?.companies   ?? 12,  suffix: '+', label: t('statCompanies') },
    { value: profile?.stats?.successRate ?? 95,  suffix: '%', label: t('statSuccess') },
  ]

  if (!mounted) {
    return (
      <section style={{ minHeight: '100vh', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: FB, color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading…</span>
      </section>
    )
  }

  return (
    <section style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', background: C.dark,
      direction: dir, position: 'relative',
    }}>
      {/* Background blobs container */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <motion.div aria-hidden
          animate={{ background: [
            `radial-gradient(ellipse 100% 80% at 50% 35%, ${C.deepPurple} 0%, ${C.dark} 55%)`,
            `radial-gradient(ellipse 110% 85% at 55% 40%, ${C.purple} 0%, ${C.dark} 60%)`,
            `radial-gradient(ellipse 100% 80% at 50% 35%, ${C.deepPurple} 0%, ${C.dark} 55%)`,
          ]}}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0 }}
        />
        <motion.div aria-hidden
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.9, 0.6], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '-10%', right: '-6%', width: 650, height: 650, borderRadius: '50%', background: `radial-gradient(circle, rgba(253,147,195,0.15) 0%, transparent 70%)`, filter: 'blur(100px)' }}
        />
        <motion.div aria-hidden
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.75, 0.5], x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ position: 'absolute', bottom: '-12%', left: '-8%', width: 580, height: 580, borderRadius: '50%', background: `radial-gradient(circle, rgba(142,181,210,0.12) 0%, transparent 70%)`, filter: 'blur(120px)' }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="wrap" style={{
        position: 'relative', zIndex: 1, flex: 1,
        display: 'flex', alignItems: 'center',
        paddingTop: 'clamp(5.5rem, 12vh, 8.5rem)',
        paddingBottom: 'clamp(2rem, 5vh, 3.5rem)',
      }}>
        {/*
          Hero grid:
          - Mobile (< 1024px): single column, photo on top, text below
          - Desktop (≥ 1024px): two columns side by side (locale-aware order)
        */}
        <div className={`hero-grid ${locale}`}>
          {/* Photo always renders; CSS controls order */}
          <PhotoColumn name={name} />
          <TextColumn name={name} tagline={tagline} title={title} bio={bio} t={t} locale={locale} />
        </div>
      </div>

      {/* ── Stats bar — 2×2 grid on mobile, 4-col row on desktop ── */}
      <div
        ref={statsRef}
        style={{
          position: 'relative', zIndex: 1,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        <div className="wrap hero-stats-grid" style={{
          paddingTop: 'clamp(2rem, 5vw, 3.5rem)',
          paddingBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
        }}>
          {stats.map((s, i) => (
            <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={i * 0.1} inView={statsVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
