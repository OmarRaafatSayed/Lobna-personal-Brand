'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Calendar, Briefcase, PenSquare, Users, TrendingUp } from 'lucide-react'
import api from '@/lib/api'
import type { Booking } from '@/lib/types'
import { useAdminLang } from '@/contexts/AdminLanguageContext'
import { BOOKING_STATUS_LABELS_EN, BOOKING_STATUS_LABELS_AR } from '@/lib/constants'

const FONT_BODY = "'Bricolage Grotesque', sans-serif"
const FONT_HEAD = "'Edu QLD Beginner', cursive"
const FONT_DISP = "'Boldonse', cursive"
const ROSE_DK   = '#E8609A'

const statusStyles: Record<string, { bg: string; color: string; dot: string }> = {
  pending:   { bg: 'rgba(251,191,36,0.12)',  color: '#92400e', dot: '#F59E0B' },
  confirmed: { bg: 'rgba(34,197,94,0.12)',   color: '#14532d', dot: '#22C55E' },
  cancelled: { bg: 'rgba(239,68,68,0.12)',   color: '#7f1d1d', dot: '#EF4444' },
  completed: { bg: 'rgba(142,181,210,0.18)', color: '#1e3a5f', dot: '#8EB5D2' },
}

export default function AdminDashboard() {
  const { locale, dir, t } = useAdminLang()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats]       = useState({ pending: 0, confirmed: 0, jobs: 0, posts: 0 })
  const [loading, setLoading]   = useState(true)

  const STATUS_LABELS = locale === 'ar' ? BOOKING_STATUS_LABELS_AR : BOOKING_STATUS_LABELS_EN

  useEffect(() => {
    Promise.all([
      api.get<{ bookings: Booking[]; total: number }>('/bookings?limit=5'),
      api.get<{ jobs: unknown[] }>('/jobs/all'),
      api.get<{ posts: unknown[] }>('/blog/all'),
    ]).then(([bRes, jRes, pRes]) => {
      setBookings(bRes.bookings)
      setStats({
        pending:   bRes.bookings.filter(b => b.status === 'pending').length,
        confirmed: bRes.bookings.filter(b => b.status === 'confirmed').length,
        jobs:      jRes.jobs.length,
        posts:     pRes.posts.length,
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const statCards = [
    { en: 'Pending Bookings', ar: 'حجوزات معلقة',  value: stats.pending,   Icon: Calendar,  grad: 'linear-gradient(135deg,#FD93C3,#E8609A)', glow: 'rgba(253,147,195,0.28)' },
    { en: 'Confirmed',        ar: 'مؤكدة',          value: stats.confirmed, Icon: Users,     grad: 'linear-gradient(135deg,#8EB5D2,#5A90B8)', glow: 'rgba(142,181,210,0.22)' },
    { en: 'Active Jobs',      ar: 'وظائف نشطة',    value: stats.jobs,      Icon: Briefcase, grad: 'linear-gradient(135deg,#B2BA0C,#8A920A)', glow: 'rgba(178,186,12,0.22)' },
    { en: 'Blog Posts',       ar: 'مقالات',         value: stats.posts,     Icon: PenSquare, grad: 'linear-gradient(135deg,#c084fc,#9333ea)', glow: 'rgba(192,132,252,0.22)' },
  ]

  const tableHeaders = locale === 'ar'
    ? ['الاسم', 'التاريخ', 'الوقت', 'المنصة', 'الحالة']
    : ['Name', 'Date', 'Time', 'Platform', 'Status']

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1100px' }} dir={dir}>

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <TrendingUp size={16} style={{ color: ROSE_DK }} />
            <span style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', fontWeight: 700, color: ROSE_DK, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t('Overview', 'نظرة عامة')}
            </span>
          </div>
          <h1 style={{ fontFamily: FONT_DISP, fontSize: 'clamp(1.8rem,4vw,2.4rem)', lineHeight: 1.1, background: 'linear-gradient(135deg,#2A1040 0%,#E8609A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '6px' }}>
            {t('Welcome back 👋', 'أهلاً بكِ 👋')}
          </h1>
          <p style={{ fontFamily: FONT_BODY, fontSize: '0.9rem', color: '#8B6BA8' }}>
            {t("Here's what's happening on your platform today.", 'إليكِ ملخص نشاط منصتكِ اليوم.')}
          </p>
        </motion.div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(215px,1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {statCards.map((card, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(253,147,195,0.13)', borderRadius: '20px', padding: '1.5rem', boxShadow: `0 4px 24px ${card.glow}`, transition: 'transform 0.25s,box-shadow 0.25s', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px ${card.glow}` }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 24px ${card.glow}` }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: card.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '1rem', boxShadow: `0 6px 16px ${card.glow}` }}>
                <card.Icon size={20} />
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#1a0a2e', fontFamily: FONT_BODY, lineHeight: 1, marginBottom: '4px' }}>{card.value}</div>
              <div style={{ fontSize: '0.82rem', color: '#8B6BA8', fontFamily: FONT_BODY, fontWeight: 500 }}>{locale === 'ar' ? card.ar : card.en}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent bookings */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(253,147,195,0.13)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(253,147,195,0.07)' }}>
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(253,147,195,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: FONT_HEAD, fontSize: '1.05rem', color: '#1a0a2e', fontWeight: 700 }}>
              {t('Recent Bookings', 'آخر الحجوزات')}
            </h2>
            <span style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', color: '#8B6BA8' }}>
              {t('Last 5 entries', 'آخر ٥ إدخالات')}
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#8B6BA8', fontFamily: FONT_BODY }}>{t('Loading...', 'جاري التحميل...')}</div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#8B6BA8', fontFamily: FONT_BODY }}>{t('No bookings yet', 'لا توجد حجوزات بعد')}</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT_BODY, fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(253,147,195,0.04)' }}>
                    {tableHeaders.map(h => (
                      <th key={h} style={{ textAlign: dir === 'rtl' ? 'right' : 'left', padding: '0.7rem 1.25rem', fontSize: '0.72rem', fontWeight: 700, color: '#8B6BA8', whiteSpace: 'nowrap', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => {
                    const s = statusStyles[b.status] ?? statusStyles.pending
                    return (
                      <motion.tr key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 + i * 0.04 }}
                        style={{ borderTop: '1px solid rgba(253,147,195,0.07)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(253,147,195,0.03)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: '#1a0a2e' }}>{b.name}</td>
                        <td style={{ padding: '0.875rem 1.25rem', color: '#6B5A7E' }}>{b.date}</td>
                        <td style={{ padding: '0.875rem 1.25rem', color: '#6B5A7E' }}>{b.time}</td>
                        <td style={{ padding: '0.875rem 1.25rem', color: '#6B5A7E' }}>{b.platform === 'google_meet' ? 'Google Meet' : 'Zoom'}</td>
                        <td style={{ padding: '0.875rem 1.25rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700, background: s.bg, color: s.color }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
                            {STATUS_LABELS[b.status] ?? b.status}
                          </span>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  )
}
