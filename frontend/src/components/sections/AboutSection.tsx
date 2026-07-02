'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Download } from 'lucide-react'
import type { Profile } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

/* ─── Typography — documentation ─── */
const FD = 'Boldonse, cursive'                    // H1
const FH = "'Edu QLD Beginner', cursive"           // H2 / section subheadings
const FB = "'Bricolage Grotesque', sans-serif"     // Body / paragraph

const fade = (delay = 0) => ({
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
})

const gradText: React.CSSProperties = {
  background: 'linear-gradient(135deg,#FD93C3,#E8609A)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

export default function AboutSection({ profile }: { profile: Profile | null }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { t, dir, locale } = useLanguage()

  const badgeLabel = t('aboutTitle')
  const headingA   = t('aboutHeading')
  const headingB   = t('aboutSubheading')
  // EN: always use i18n translations. AR: use profile data if available
  const subtitle   = locale === 'en' ? t('title')  : (profile?.title || t('title'))
  const bio        = locale === 'en' ? t('bio')    : (profile?.bio   || t('bio'))
  const workedWith = t('workedWith')
  const yearsExp   = t('yearsExp')
  const inField    = t('inSalesField')

  return (
    <section id="about" ref={ref} style={{
      background: '#FBF9F7',
      padding: 'clamp(5rem, 10vw, 8rem) 0',
      direction: dir,
    }}>
      <div className="wrap">

        {/* ── Section header ── */}
        <motion.div
          variants={fade(0)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 99,
            background: 'rgba(253,147,195,0.1)',
            border: '1px solid rgba(253,147,195,0.22)',
            color: '#E8609A',
            fontFamily: FB, fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            ✦ {badgeLabel}
          </span>

          {/* H1 — Boldonse */}
          <h1 style={{
            fontFamily: FD,
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            color: '#0F0A14',
            marginTop: '1rem',
            lineHeight: 1.1,
          }}>
            {headingA}{' '}
            <span style={gradText}>{headingB}</span>
          </h1>
        </motion.div>

        {/* ── Two-column grid ── */}
        <div className="about-grid">

          {/* Image column */}
          <motion.div
            variants={fade(0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{ position: 'relative' }}
          >
            <div style={{
              position: 'absolute', top: -20, right: -20, left: 20, bottom: 20,
              borderRadius: '2rem', background: 'rgba(253,147,195,0.07)', zIndex: 0,
            }} />
            <div style={{
              position: 'absolute', top: 20, right: 20, left: -20, bottom: -20,
              borderRadius: '2rem', background: 'rgba(142,181,210,0.07)', zIndex: 0,
            }} />

            <div style={{
              position: 'relative', zIndex: 1,
              borderRadius: '1.75rem', overflow: 'hidden',
              aspectRatio: '4/5',
              boxShadow: '0 20px 60px rgba(15,10,20,0.12)',
            }}>
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src="/lobna.jpg" alt="Lobna"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
              )}
            </div>

            {/* Floating badge — clipped to safe area on mobile */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                position: 'absolute',
                bottom: -20, left: -16, zIndex: 2,
                padding: '0.875rem', borderRadius: '1rem',
                background: '#fff',
                boxShadow: '0 12px 32px rgba(253,147,195,0.25)',
                border: '1px solid rgba(253,147,195,0.15)',
                display: 'flex', alignItems: 'center', gap: 10,
                maxWidth: 'calc(100% - 1rem)',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg,#FD93C3,#E8609A)',
                boxShadow: '0 4px 16px rgba(253,147,195,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FD, color: '#fff', fontSize: '1rem',
              }}>
                {(profile?.stats?.experience || 8)}+
              </div>
              <div>
                {/* H2 — Edu QLD Beginner */}
                <p style={{ fontFamily: FH, fontWeight: 700, fontSize: '0.85rem', color: '#0F0A14' }}>
                  {yearsExp}
                </p>
                <p style={{ fontFamily: FB, fontSize: '0.75rem', color: 'rgba(15,10,20,0.45)' }}>
                  {inField}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Content column */}
          <motion.div
            variants={fade(0.2)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* H2 — Edu QLD Beginner */}
            <h2 style={{
              fontFamily: FH,
              fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)',
              color: 'rgba(15,10,20,0.75)',
              margin: 0,
            }}>
              {subtitle}
            </h2>

            {/* Paragraph — Bricolage Grotesque */}
            <p style={{ fontFamily: FB, fontSize: '1.05rem', lineHeight: 1.9, color: 'rgba(15,10,20,0.6)', margin: 0 }}>
              {bio}
            </p>

            {/* Previous companies */}
            {profile?.previousCompanies && profile.previousCompanies.length > 0 && (
              <div>
                <p style={{
                  fontFamily: FB, fontSize: '0.72rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'rgba(15,10,20,0.35)', marginBottom: 12,
                }}>
                  {workedWith}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {profile.previousCompanies.map((c, i) => (
                    <div key={i} style={{
                      padding: '8px 16px', borderRadius: 12,
                      fontFamily: FB, fontSize: '0.875rem', fontWeight: 600,
                      background: '#fff',
                      boxShadow: '0 2px 12px rgba(15,10,20,0.06)',
                      border: '1px solid rgba(15,10,20,0.07)',
                      color: 'rgba(15,10,20,0.7)',
                      display: 'flex', alignItems: 'center',
                    }}>
                      {c.logo
                        ? <img src={c.logo} alt={c.name} style={{ height: 20, objectFit: 'contain' }} />
                        : c.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mini stats */}
            <div className="about-stats-grid">
              {[
                { n: (profile?.stats?.clients     || 150) + '+', label: t('statClients') },
                { n: (profile?.stats?.companies   || 12)  + '+', label: t('statCompanies') },
                { n: (profile?.stats?.successRate || 95)  + '%', label: t('statSuccess') },
              ].map(s => (
                <div key={s.label} style={{
                  borderRadius: 18, padding: 'clamp(0.75rem, 2vw, 1rem)', textAlign: 'center',
                  background: '#fff',
                  boxShadow: '0 4px 16px rgba(15,10,20,0.05)',
                  border: '1px solid rgba(15,10,20,0.05)',
                }}>
                  <div style={{ fontFamily: FD, fontSize: 'clamp(1.25rem, 4vw, 1.6rem)', ...gradText }}>
                    {s.n}
                  </div>
                  <div style={{ fontFamily: FB, fontSize: '0.72rem', color: 'rgba(15,10,20,0.45)', marginTop: 4 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, paddingTop: 8 }}>
              {profile?.cvFile && (
                <a href={profile.cvFile} download className="btn-primary">
                  <Download size={16} /> {t('downloadCV')}
                </a>
              )}
              <Link href="#booking" className="btn-outline">
                {t('bookConsultationShort')}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ── Testimonials ── */}
        {profile?.testimonials && profile.testimonials.length > 0 && (
          <div style={{ marginTop: 'clamp(5rem, 10vw, 7rem)' }}>
            <motion.div
              variants={fade(0)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}
            >
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 99,
                background: 'rgba(253,147,195,0.1)',
                border: '1px solid rgba(253,147,195,0.22)',
                color: '#E8609A',
                fontFamily: FB, fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                marginBottom: 16,
              }}>
                ✦ {t('testimonialsTitle')}
              </span>
              {/* H1 — Boldonse */}
              <h1 style={{
                fontFamily: FD,
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: '#0F0A14',
                display: 'block',
              }}>
                {t('testimonialsHeading')}
              </h1>
            </motion.div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}>
              {profile.testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  variants={fade(i * 0.08)}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  className="lift"
                  style={{
                    borderRadius: 20, padding: 24,
                    background: '#fff',
                    boxShadow: '0 4px 24px rgba(15,10,20,0.06)',
                    border: '1px solid rgba(15,10,20,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} style={{ fontSize: '1rem', color: j < testimonial.rating ? '#facc15' : '#e5e7eb' }}>★</span>
                    ))}
                  </div>
                  <p style={{ fontFamily: FB, fontSize: '0.9rem', lineHeight: 1.8, color: 'rgba(15,10,20,0.6)', marginBottom: 20 }}>
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(253,147,195,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      {testimonial.avatar
                        ? <img src={testimonial.avatar} alt={testimonial.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontFamily: FD, color: '#FD93C3', fontSize: '0.9rem' }}>{testimonial.name[0]}</span>
                      }
                    </div>
                    <div>
                      <p style={{ fontFamily: FB, fontWeight: 700, fontSize: '0.875rem', color: '#0F0A14' }}>{testimonial.name}</p>
                      <p style={{ fontFamily: FB, fontSize: '0.75rem', color: 'rgba(15,10,20,0.4)' }}>{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
