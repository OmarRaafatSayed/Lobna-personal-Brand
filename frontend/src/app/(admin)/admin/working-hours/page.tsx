'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Plus, Trash2, Save } from 'lucide-react'
import api from '@/lib/api'
import type { WorkingHour } from '@/lib/types'
import { DAY_NAMES_AR, DAY_NAMES_EN } from '@/lib/constants'
import { useAdminLang } from '@/contexts/AdminLanguageContext'

const ROSE_DK   = '#E8609A'
const ROSE_GRAD = 'linear-gradient(135deg,#FD93C3 0%,#E8609A 100%)'

const DEFAULT_HOURS: WorkingHour[] = Array.from({ length: 7 }, (_, i) => ({
  dayOfWeek: i,
  isActive: i >= 1 && i <= 4,
  slots: i >= 1 && i <= 4 ? [{ start: '09:00', end: '12:00' }] : [],
}))

export default function AdminWorkingHoursPage() {
  const { locale, dir, t } = useAdminLang()
  const DAY_NAMES = locale === 'ar' ? DAY_NAMES_AR : DAY_NAMES_EN
  const [hours, setHours]     = useState<WorkingHour[]>(DEFAULT_HOURS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    api.get<{ hours: WorkingHour[] }>('/working-hours')
      .then(res => { if (res.hours.length > 0) setHours(res.hours) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  const toggleDay  = (d: number) => setHours(prev => prev.map(h => h.dayOfWeek===d ? { ...h, isActive: !h.isActive } : h))
  const addSlot    = (d: number) => setHours(prev => prev.map(h => h.dayOfWeek===d ? { ...h, slots: [...h.slots, { start: '09:00', end: '12:00' }] } : h))
  const removeSlot = (d: number, si: number) => setHours(prev => prev.map(h => h.dayOfWeek===d ? { ...h, slots: h.slots.filter((_,i) => i!==si) } : h))
  const updateSlot = (d: number, si: number, f: 'start'|'end', v: string) => setHours(prev => prev.map(h => h.dayOfWeek===d ? { ...h, slots: h.slots.map((s,i) => i===si ? { ...s, [f]: v } : s) } : h))

  const handleSave = async () => {
    setSaving(true)
    try { await api.put('/working-hours', { hours }); alert(t('Working hours saved ✅','تم حفظ ساعات العمل بنجاح ✅')) }
    catch (e: unknown) { alert(e instanceof Error ? e.message : 'Error') } finally { setSaving(false) }
  }

  if (loading) return <AdminLayout><div className="text-center py-20" style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t('Loading...','جاري التحميل...')}</div></AdminLayout>

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl" dir={dir}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: "'Boldonse',cursive", fontSize: 'clamp(1.5rem,3.5vw,2.1rem)', background: 'linear-gradient(135deg,#2A1040 0%,#E8609A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.2 }}>{t('Working Hours','ساعات العمل')}</h1>
            <p style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif", marginTop: '4px', fontSize: '0.9rem' }}>{t('Set available consultation slots','حدد مواعيد الاستشارات المتاحة للحجز')}</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            style={{ background: ROSE_GRAD, color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '12px', fontWeight: 600, fontFamily: "'Bricolage Grotesque',sans-serif", display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: saving?'not-allowed':'pointer', opacity: saving?0.65:1, boxShadow: '0 6px 20px rgba(253,147,195,0.4)', transition: 'transform 0.2s' }}
            onMouseEnter={e => { if (!saving) (e.currentTarget as HTMLButtonElement).style.transform='scale(1.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform='scale(1)' }}>
            <Save size={18}/>{saving ? t('Saving...','جاري الحفظ...') : t('Save Changes','حفظ التغييرات')}
          </button>
        </motion.div>

        {/* Day cards */}
        <div className="space-y-4">
          {hours.map(day => (
            <motion.div key={day.dayOfWeek} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: day.dayOfWeek * 0.05 }}
              style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: day.isActive?'1.5px solid rgba(253,147,195,0.3)':'1.5px solid rgba(200,190,220,0.2)', borderRadius: '18px', padding: '1.25rem 1.4rem', opacity: day.isActive?1:0.6, transition: 'all 0.3s', boxShadow: day.isActive?'0 4px 20px rgba(253,147,195,0.1)':'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: day.isActive?'1rem':0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Toggle */}
                  <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input type="checkbox" checked={day.isActive} onChange={() => toggleDay(day.dayOfWeek)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}/>
                    <span style={{ display: 'block', width: '44px', height: '24px', borderRadius: '99px', background: day.isActive?ROSE_GRAD:'rgba(200,190,220,0.3)', position: 'relative', transition: 'background 0.3s', boxShadow: day.isActive?'0 2px 8px rgba(253,147,195,0.4)':'none' }}>
                      <span style={{ position: 'absolute', top: '3px', [dir==='rtl'?'right':'left']: day.isActive?'3px':'19px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', transition: `${dir==='rtl'?'right':'left'} 0.3s` }}/>
                    </span>
                  </label>
                  <span style={{ fontFamily: "'Edu QLD Beginner',cursive", fontSize: '1.05rem', fontWeight: 700, color: day.isActive?'#1a0a2e':'#9080A8', transition: 'color 0.3s' }}>
                    {DAY_NAMES[day.dayOfWeek]}
                  </span>
                </div>
                {day.isActive && (
                  <button onClick={() => addSlot(day.dayOfWeek)}
                    style={{ color: ROSE_DK, background: 'rgba(253,147,195,0.08)', border: '1px solid rgba(253,147,195,0.25)', padding: '5px 12px', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, transition: 'background 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background='rgba(253,147,195,0.18)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background='rgba(253,147,195,0.08)' }}>
                    <Plus size={15}/>{t('Add slot','إضافة فترة')}
                  </button>
                )}
              </div>
              {day.isActive && (
                <div className="space-y-2">
                  {day.slots.length===0 ? (
                    <p style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '12px', background: 'rgba(253,147,195,0.05)', color: '#9080A8', fontSize: '0.82rem', fontFamily: "'Bricolage Grotesque',sans-serif" }}>
                      {t('No slots. Add a time slot.','لا توجد فترات. أضف فترة عمل.')}
                    </p>
                  ) : day.slots.map((slot, si) => (
                    <div key={si} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(253,147,195,0.06)', borderRadius: '12px', padding: '0.65rem 1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif", minWidth: '30px' }}>{t('From','من')}</span>
                      <input type="time" value={slot.start} onChange={e => updateSlot(day.dayOfWeek,si,'start',e.target.value)} style={{ border: '1.5px solid rgba(253,147,195,0.3)', borderRadius: '10px', padding: '5px 10px', fontSize: '0.875rem', background: '#fff', color: '#1a0a2e', outline: 'none', fontFamily: "'Bricolage Grotesque',sans-serif" }}/>
                      <span style={{ fontSize: '0.8rem', color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t('To','إلى')}</span>
                      <input type="time" value={slot.end} onChange={e => updateSlot(day.dayOfWeek,si,'end',e.target.value)} style={{ border: '1.5px solid rgba(253,147,195,0.3)', borderRadius: '10px', padding: '5px 10px', fontSize: '0.875rem', background: '#fff', color: '#1a0a2e', outline: 'none', fontFamily: "'Bricolage Grotesque',sans-serif" }}/>
                      <button onClick={() => removeSlot(day.dayOfWeek,si)} style={{ color: '#EF4444', marginInlineStart: 'auto', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color='#DC2626')} onMouseLeave={e => (e.currentTarget.style.color='#EF4444')}><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
