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

const typeColors: Record<string,string> = {
  full_time:  'bg-brand-green/10 text-brand-green border-brand-green/25',
  part_time:  'bg-brand-blue/10  text-brand-blue  border-brand-blue/25',
  remote:     'bg-rose/10        text-rose-dark    border-rose/25',
  freelance:  'bg-purple-100     text-purple-600   border-purple-200',
  internship: 'bg-yellow-100     text-yellow-700   border-yellow-200',
}

export default function JobsPage() {
  const { t, locale } = useLanguage()
  const JOB_TYPE_LABELS = locale === 'ar' ? JOB_TYPE_LABELS_AR : JOB_TYPE_LABELS_EN
  const [jobs,     setJobs]     = useState<Job[]>([])
  const [filtered, setFiltered] = useState<Job[]>([])
  const [search,   setSearch]   = useState('')
  const [type,     setType]     = useState('')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get<{ jobs: Job[] }>('/jobs')
      .then(r => { setJobs(r.jobs); setFiltered(r.jobs) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let r = jobs
    if (search) r = r.filter(j => j.title.includes(search) || j.company.includes(search))
    if (type)   r = r.filter(j => j.type === type)
    setFiltered(r)
  }, [search, type, jobs])

  const searchPlaceholder = locale === 'ar' ? 'ابحثي عن وظيفة...' : 'Search for a job...'
  const allTypes          = locale === 'ar' ? 'كل الأنواع' : 'All Types'
  const noJobs            = locale === 'ar' ? 'لا توجد وظائف حالياً' : 'No jobs available right now'
  const deadline          = locale === 'ar' ? 'آخر موعد:' : 'Deadline:'
  const dateLocale        = locale === 'ar' ? 'ar-EG' : 'en-US'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div style={{ background: 'linear-gradient(135deg,#0F0A14 0%,#2A1040 100%)' }} className="pt-32 pb-16 relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-rose/10 blur-[100px] rounded-full" />
          <div className="wrap relative z-10 text-center">
            <span className="pill bg-rose/10 border border-rose/25 text-rose mb-4">✦ {t('jobsTitle')}</span>
            <h1 className="font-display text-6xl md:text-7xl text-white mt-3">
              {t('jobsHeading')} <span className="text-grad">{t('jobsSubheading')}</span>
            </h1>
            <p className="text-white/50 mt-3 max-w-lg mx-auto">{t('jobsDesc')}</p>
          </div>
        </div>

        <div className="wrap py-12 pb-24">
          {/* Filters */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/30" size={18} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={searchPlaceholder} className="input-field pr-12" />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/30" size={16} />
              <select value={type} onChange={e => setType(e.target.value)} className="input-field pr-11 min-w-[180px]">
                <option value="">{allTypes}</option>
                {Object.entries(JOB_TYPE_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-72 rounded-2xl shimmer" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Briefcase className="text-dark/15 mx-auto mb-4" size={64} />
              <p className="text-dark/40 text-lg">{noJobs}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((job, i) => (
                <motion.div key={job._id} initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                  className="bg-white rounded-2xl overflow-hidden shadow-card border border-dark/5 lift flex flex-col">
                  {job.image && (
                    <div className="h-44 overflow-hidden">
                      <img src={job.image} alt={job.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div>
                        <h2 className="font-bold text-dark text-lg leading-tight">{job.title}</h2>
                        <p className="text-rose font-semibold text-sm mt-1">{job.company}</p>
                      </div>
                      <span className={`pill border text-xs shrink-0 ${typeColors[job.type] || ''}`}>
                        {JOB_TYPE_LABELS[job.type]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-dark/40 mb-3">
                      <span className="flex items-center gap-1"><MapPin size={11}/>{job.location}</span>
                      {job.salary && <span className="flex items-center gap-1"><Briefcase size={11}/>{job.salary}</span>}
                    </div>
                    <p className="text-dark/55 text-sm line-clamp-3 mb-4 flex-1">{job.description}</p>
                    {job.requirements.length > 0 && (
                      <ul className="mb-4 space-y-1">
                        {job.requirements.slice(0,3).map((r,j) => (
                          <li key={j} className="text-dark/40 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose/60 shrink-0" />{r}
                          </li>
                        ))}
                      </ul>
                    )}
                    {job.deadline && (
                      <p className="text-dark/35 text-xs mb-3">
                        {deadline} {new Date(job.deadline).toLocaleDateString(dateLocale)}
                      </p>
                    )}
                    <a href={job.applyLink} target="_blank" rel="noopener noreferrer"
                      className="btn-primary text-sm py-3 flex items-center justify-center gap-2">
                      <ExternalLink size={15}/> {t('applyNow')}
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
