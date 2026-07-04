'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { MapPin, Briefcase, ExternalLink, Search, SlidersHorizontal } from 'lucide-react'
import api from '@/lib/api'
import type { Job } from '@/lib/types'
import { JOB_TYPE_LABELS_AR, JOB_TYPE_LABELS_EN } from '@/lib/constants'
import { useLanguage } from '@/contexts/LanguageContext'

/* ─── Typography ─── */
const FD = 'Boldonse, cursive'
const FH = "'Edu QLD Beginner', cursive"
const FB = "'Bricolage Grotesque', sans-serif"

const typeColors: Record<string, string> = {
  full_time:  'bg-green/10 text-green border-green/25',
  part_time:  'bg-blue/10 text-blue border-blue/25',
  remote:     'bg-rose/10 text-rose-dark border-rose/25',
  freelance:  'bg-purple-100 text-purple-600 border-purple-200',
  internship: 'bg-yellow-100 text-yellow-700 border-yellow-200',
}

export default function JobsPage() {
  const { t, locale, dir } = useLanguage()
  const JOB_TYPE_LABELS = locale === 'ar' ? JOB_TYPE_LABELS_AR : JOB_TYPE_LABELS_EN
  const [jobs, setJobs] = useState<Job[]>([])
  const [filtered, setFiltered] = useState<Job[]>([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ jobs: Job[] }>('/jobs')
      .then(r => { setJobs(r.jobs); setFiltered(r.jobs) })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let r = jobs
    if (search) r = r.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()))
    if (type) r = r.filter(j => j.type === type)
    setFiltered(r)
  }, [search, type, jobs])

  const searchPlaceholder = locale === 'ar' ? 'ابحثي عن وظيفة...' : 'Search for a job...'
  const allTypes = locale === 'ar' ? 'كل الأنواع' : 'All Types'
  const noJobs = locale === 'ar' ? 'لا توجد وظائف حالياً' : 'No jobs available right now'
  const deadline = locale === 'ar' ? 'آخر موعد:' : 'Deadline:'
  const dateLocale = locale === 'ar' ? 'ar-EG' : 'en-US'

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#FBF9F7', direction: dir }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0F0A14 0%, #2A1040 100%)',
          padding: 'clamp(8rem, 15vh, 10rem) 0 clamp(4rem, 8vh, 6rem)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background blobs */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: 400, height: 400, borderRadius: '50%',
            background: 'rgba(253,147,195,0.08)', filter: 'blur(120px)',
            pointerEvents: 'none',
          }} />

          <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 99,
                background: 'rgba(253,147,195,0.1)',
                border: '1px solid rgba(253,147,195,0.25)',
                color: '#FD93C3',
                fontFamily: FB, fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
              ✦ {t('jobsTitle')}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: FD,
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: '1rem',
              }}>
              {t('jobsHeading')}{' '}
              <span style={{
                background: 'linear-gradient(135deg,#FD93C3,#E8609A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {t('jobsSubheading')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontFamily: FB,
                color: 'rgba(255,255,255,0.5)',
                fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
                maxWidth: 540,
                margin: '0 auto',
              }}>
              {t('jobsDesc')}
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="wrap" style={{
          padding: 'clamp(3rem, 6vw, 5rem) 1.5rem clamp(5rem, 8vw, 7rem)',
        }}>
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              flexDirection: window.innerWidth < 640 ? 'column' : 'row',
              gap: '1rem',
              marginBottom: 'clamp(2rem, 4vw, 3rem)',
            }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{
                position: 'absolute',
                left: dir === 'rtl' ? 'auto' : '1rem',
                right: dir === 'rtl' ? '1rem' : 'auto',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(15,10,20,0.3)',
              }} size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="input-field"
                style={{
                  paddingLeft: dir === 'rtl' ? '1rem' : '3rem',
                  paddingRight: dir === 'rtl' ? '3rem' : '1rem',
                }}
              />
            </div>

            {/* Type filter */}
            <div style={{ position: 'relative', minWidth: 200 }}>
              <SlidersHorizontal style={{
                position: 'absolute',
                left: dir === 'rtl' ? 'auto' : '1rem',
                right: dir === 'rtl' ? '1rem' : 'auto',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(15,10,20,0.3)',
              }} size={16} />
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="input-field"
                style={{
                  paddingLeft: dir === 'rtl' ? '1rem' : '2.75rem',
                  paddingRight: dir === 'rtl' ? '2.75rem' : '1rem',
                  appearance: 'auto',
                }}>
                <option value="">{allTypes}</option>
                {Object.entries(JOB_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="cards-grid-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="shimmer" style={{ height: 400, borderRadius: '1.5rem' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <Briefcase style={{ color: 'rgba(15,10,20,0.15)', margin: '0 auto 1rem' }} size={64} />
              <p style={{ fontFamily: FB, color: 'rgba(15,10,20,0.4)', fontSize: '1.1rem' }}>
                {noJobs}
              </p>
            </div>
          ) : (
            <div className="cards-grid-3">
              {filtered.map((job, i) => (
                <motion.div
                  key={job._id || `job-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="lift"
                  style={{
                    background: '#fff',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(15,10,20,0.06)',
                    border: '1px solid rgba(15,10,20,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                  {/* Image */}
                  {job.image && (
                    <div style={{ height: 180, overflow: 'hidden' }}>
                      <img
                        src={job.image}
                        alt={job.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s',
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <h2 style={{ fontFamily: FB, fontWeight: 700, fontSize: '1.125rem', color: '#0F0A14', lineHeight: 1.3 }}>
                          {job.title}
                        </h2>
                        <p style={{ fontFamily: FB, color: '#E8609A', fontWeight: 600, fontSize: '0.875rem', marginTop: '0.25rem' }}>
                          {job.company}
                        </p>
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.375rem 0.75rem',
                        borderRadius: 99,
                        border: '1px solid',
                        whiteSpace: 'nowrap',
                        fontFamily: FB,
                        fontWeight: 600,
                      }}
                        className={typeColors[job.type] || ''}>
                        {JOB_TYPE_LABELS[job.type]}
                      </span>
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: 'rgba(15,10,20,0.4)', marginBottom: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={11} />{job.location}
                      </span>
                      {job.salary && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Briefcase size={11} />{job.salary}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p style={{
                      fontFamily: FB,
                      fontSize: '0.875rem',
                      color: 'rgba(15,10,20,0.55)',
                      lineHeight: 1.7,
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1,
                    }}>
                      {job.description}
                    </p>

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                      <ul style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        {job.requirements.slice(0, 3).map((r, j) => (
                          <li key={j} style={{
                            fontFamily: FB,
                            fontSize: '0.75rem',
                            color: 'rgba(15,10,20,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}>
                            <span style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: 'rgba(253,147,195,0.6)',
                              flexShrink: 0,
                            }} />
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Deadline */}
                    {job.deadline && (
                      <p style={{
                        fontFamily: FB,
                        fontSize: '0.75rem',
                        color: 'rgba(15,10,20,0.35)',
                        marginBottom: '0.75rem',
                      }}>
                        {deadline} {new Date(job.deadline).toLocaleDateString(dateLocale)}
                      </p>
                    )}

                    {/* Apply Button */}
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{
                        fontSize: '0.875rem',
                        padding: '0.75rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}>
                      <ExternalLink size={15} /> {t('applyNow')}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
