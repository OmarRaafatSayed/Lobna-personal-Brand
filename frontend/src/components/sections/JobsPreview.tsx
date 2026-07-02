'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Briefcase, ArrowLeft, ExternalLink } from 'lucide-react'
import api from '@/lib/api'
import type { Job } from '@/lib/types'
import { JOB_TYPE_LABELS_AR, JOB_TYPE_LABELS_EN } from '@/lib/constants'
import { useLanguage } from '@/contexts/LanguageContext'

/* ─── Typography ─── */
const FD = 'Boldonse, cursive'
const FH = "'Edu QLD Beginner', cursive"
const FB = "'Bricolage Grotesque', sans-serif"

const typeBadge: Record<string, { bg: string; color: string; border: string }> = {
  full_time:  { bg: 'rgba(178,186,12,0.1)',  color: '#8A920A', border: 'rgba(178,186,12,0.3)' },
  part_time:  { bg: 'rgba(142,181,210,0.1)', color: '#5A90B8', border: 'rgba(142,181,210,0.3)' },
  remote:     { bg: 'rgba(253,147,195,0.1)', color: '#E8609A', border: 'rgba(253,147,195,0.3)' },
  freelance:  { bg: 'rgba(167,139,250,0.1)', color: '#7c3aed', border: 'rgba(167,139,250,0.3)' },
  internship: { bg: 'rgba(251,191,36,0.1)',  color: '#b45309', border: 'rgba(251,191,36,0.3)' },
}

const gradText: React.CSSProperties = {
  background: 'linear-gradient(135deg,#FD93C3,#E8609A)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

export default function JobsPreview() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { t, dir } = useLanguage()
  const JOB_TYPE_LABELS = dir === 'rtl' ? JOB_TYPE_LABELS_AR : JOB_TYPE_LABELS_EN
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    api.get<{ jobs: Job[] }>('/jobs')
      .then(r => setJobs(r.jobs.slice(0, 3)))
      .catch(() => {})
  }, [])

  if (!jobs.length) return null

  return (
    <section ref={ref} style={{ background: '#FBF9F7', padding: 'clamp(5rem, 10vw, 8rem) 0', direction: dir }}>
      <div className="wrap">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 99,
            background: 'rgba(253,147,195,0.1)', border: '1px solid rgba(253,147,195,0.22)',
            color: '#E8609A', fontFamily: FB, fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            ✦ {t('jobsTitle')}
          </span>
          {/* H1 — Boldonse */}
          <h1 style={{ fontFamily: FD, fontSize: 'clamp(2.4rem, 6vw, 4rem)', color: '#0F0A14', marginTop: '1rem', marginBottom: 0 }}>
            {t('jobsHeading')} <span style={gradText}>{t('jobsSubheading')}</span>
          </h1>
          {/* Paragraph — Bricolage Grotesque */}
          <p style={{ fontFamily: FB, color: 'rgba(15,10,20,0.5)', marginTop: 12 }}>
            {t('jobsDesc')}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="cards-grid-3">
          {jobs.map((job, i) => {
            const badge = typeBadge[job.type] || { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' }
            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="lift"
                style={{
                  borderRadius: 20, overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                  background: '#fff',
                  boxShadow: '0 4px 24px rgba(15,10,20,0.06)',
                  border: '1px solid rgba(15,10,20,0.05)',
                }}
              >
                {job.image && (
                  <div style={{ height: 176, overflow: 'hidden' }}>
                    <img src={job.image} alt={job.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                  </div>
                )}
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                    <div>
                      {/* H2 — Edu QLD Beginner */}
                      <h2 style={{ fontFamily: FH, fontWeight: 700, fontSize: '1.1rem', color: '#0F0A14', lineHeight: 1.3, margin: 0 }}>
                        {job.title}
                      </h2>
                      <p style={{ fontFamily: FB, fontWeight: 600, fontSize: '0.875rem', color: '#FD93C3', marginTop: 4 }}>
                        {job.company}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: 99,
                      fontFamily: FB, fontSize: '0.72rem', fontWeight: 600,
                      whiteSpace: 'nowrap', background: badge.bg, color: badge.color,
                      border: `1px solid ${badge.border}`,
                    }}>
                      {JOB_TYPE_LABELS[job.type] || job.type}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontFamily: FB, fontSize: '0.78rem', color: 'rgba(15,10,20,0.4)', marginBottom: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} />{job.location}
                    </span>
                    {job.salary && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Briefcase size={12} />{job.salary}
                      </span>
                    )}
                  </div>

                  <p style={{
                    fontFamily: FB, fontSize: '0.875rem', color: 'rgba(15,10,20,0.55)',
                    lineHeight: 1.7, marginBottom: 20, flex: 1,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {job.description}
                  </p>

                  <a href={job.applyLink} target="_blank" rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ width: '100%', fontSize: '0.875rem', padding: '0.75rem' }}>
                    <ExternalLink size={14} /> {t('applyNow')}
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.35 }}
          style={{ textAlign: 'center', marginTop: 40 }}
        >
          <Link href="/jobs" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {t('viewAllJobs')} <ArrowLeft size={17} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
