'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Plus, Pencil, Trash2, Briefcase, X } from 'lucide-react'
import api from '@/lib/api'
import type { Job } from '@/lib/types'
import { JOB_TYPE_LABELS_AR, JOB_TYPE_LABELS_EN } from '@/lib/constants'
import { useAdminLang } from '@/contexts/AdminLanguageContext'

const ROSE_DK   = '#E8609A'
const ROSE_GRAD = 'linear-gradient(135deg,#FD93C3 0%,#E8609A 100%)'

const GLASS_CARD = { background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(253,147,195,0.18)', borderRadius: '20px' } as const
const INPUT: React.CSSProperties = { width: '100%', padding: '0.7rem 1rem', borderRadius: '12px', border: '1.5px solid rgba(253,147,195,0.3)', background: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', outline: 'none', color: '#1a0a2e', fontFamily: "'Bricolage Grotesque',sans-serif" }

const EMPTY_JOB: Partial<Job> = { title: '', company: '', location: '', type: 'full_time', description: '', requirements: [], salary: '', applyLink: '', image: '', isActive: true }

export default function AdminJobsPage() {
  const { locale, dir, t } = useAdminLang()
  const JOB_TYPE_LABELS = locale === 'ar' ? JOB_TYPE_LABELS_AR : JOB_TYPE_LABELS_EN
  const [jobs, setJobs]       = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editJob, setEditJob] = useState<Partial<Job>>(EMPTY_JOB)
  const [saving, setSaving]   = useState(false)
  const [reqInput, setReqInput] = useState('')

  const fetchJobs = async () => {
    setLoading(true)
    try { const res = await api.get<{ jobs: Job[] }>('/jobs/all'); setJobs(res.jobs) }
    catch {} finally { setLoading(false) }
  }
  useEffect(() => { fetchJobs() }, [])

  const openNew  = () => { setEditJob(EMPTY_JOB); setReqInput(''); setShowForm(true) }
  const openEdit = (job: Job) => { setEditJob({ ...job }); setReqInput(''); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditJob(EMPTY_JOB) }

  const addRequirement = () => {
    if (reqInput.trim()) { setEditJob(p => ({ ...p, requirements: [...(p.requirements || []), reqInput.trim()] })); setReqInput('') }
  }
  const removeRequirement = (i: number) => setEditJob(p => ({ ...p, requirements: p.requirements?.filter((_, idx) => idx !== i) }))

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editJob._id) {
        const res = await api.put<{ job: Job }>(`/jobs/${editJob._id}`, editJob)
        setJobs(prev => prev.map(j => j._id === editJob._id ? res.job : j))
      } else {
        const res = await api.post<{ job: Job }>('/jobs', editJob)
        setJobs(prev => [res.job, ...prev])
      }
      closeForm()
    } catch (err: unknown) { alert(err instanceof Error ? err.message : 'خطأ في الحفظ') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('Delete this job?','حذف هذه الوظيفة؟'))) return
    try { await api.delete(`/jobs/${id}`); setJobs(prev => prev.filter(j => j._id !== id)) } catch {}
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl" dir={dir}>
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: "'Boldonse', cursive", fontSize: 'clamp(1.5rem,3.5vw,2.1rem)', background: 'linear-gradient(135deg,#2A1040 0%,#E8609A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.2 }}>{t('Jobs','الوظائف')}</h1>
            <p style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif", marginTop: '4px', fontSize: '0.9rem' }}>{t('Add and manage job opportunities','إضافة وإدارة فرص العمل')}</p>
          </div>
          <button onClick={openNew}
            style={{ background: ROSE_GRAD, color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '12px', fontWeight: 600, fontFamily: "'Bricolage Grotesque',sans-serif", display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(253,147,195,0.4)', transition: 'transform 0.2s,box-shadow 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 28px rgba(253,147,195,0.55)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(253,147,195,0.4)' }}>
            <Plus size={18} /> {t('Add Job','إضافة وظيفة')}
          </button>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(15,10,20,0.7)', backdropFilter: 'blur(6px)' }}>
              <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(253,147,195,0.25)', borderRadius: '24px', width: '100%', maxWidth: '680px', padding: '2rem', marginTop: '2rem', marginBottom: '2rem', boxShadow: '0 32px 80px rgba(15,10,20,0.25)' }} dir={dir}>
                <div className="flex items-center justify-between mb-6">
                  <h2 style={{ fontFamily: "'Edu QLD Beginner', cursive", fontSize: '1.3rem', color: '#1a0a2e', fontWeight: 700 }}>{editJob._id ? t('Edit Job','تعديل وظيفة') : t('New Job','إضافة وظيفة جديدة')}</h2>
                  <button onClick={closeForm} style={{ color: '#8B6BA8' }} onMouseEnter={e => (e.currentTarget.style.color = ROSE_DK)} onMouseLeave={e => (e.currentTarget.style.color = '#8B6BA8')}><X size={22} /></button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input style={INPUT} placeholder={t('Job title *','المسمى الوظيفي *')} value={editJob.title || ''} onChange={e => setEditJob(p => ({ ...p, title: e.target.value }))} />
                    <input style={INPUT} placeholder={t('Company *','اسم الشركة *')} value={editJob.company || ''} onChange={e => setEditJob(p => ({ ...p, company: e.target.value }))} />
                    <input style={INPUT} placeholder={t('Location *','الموقع *')} value={editJob.location || ''} onChange={e => setEditJob(p => ({ ...p, location: e.target.value }))} />
                    <select style={INPUT} value={editJob.type || 'full_time'} onChange={e => setEditJob(p => ({ ...p, type: e.target.value as Job['type'] }))}>
                      {Object.entries(JOB_TYPE_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                    </select>
                    <input style={INPUT} placeholder={t('Salary (optional)','الراتب (اختياري)')} value={editJob.salary || ''} onChange={e => setEditJob(p => ({ ...p, salary: e.target.value }))} />
                    <input style={INPUT} placeholder={t('Apply link *','رابط التقديم *')} value={editJob.applyLink || ''} onChange={e => setEditJob(p => ({ ...p, applyLink: e.target.value }))} />
                    <input style={INPUT} placeholder={t('Image URL (optional)','رابط الصورة (اختياري)')} value={editJob.image || ''} onChange={e => setEditJob(p => ({ ...p, image: e.target.value }))} />
                    <input type="date" style={INPUT} onChange={e => setEditJob(p => ({ ...p, deadline: e.target.value }))} />
                  </div>
                  <textarea style={{ ...INPUT, resize: 'none' }} placeholder={t('Job description *','وصف الوظيفة *')} value={editJob.description || ''} onChange={e => setEditJob(p => ({ ...p, description: e.target.value }))} rows={4} />
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6B5A7E', display: 'block', marginBottom: '8px', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t('Requirements','المتطلبات')}</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <input style={INPUT} value={reqInput} onChange={e => setReqInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRequirement())} placeholder={t('Add requirement...','أضف متطلب...')} />
                      <button onClick={addRequirement} style={{ background: 'rgba(253,147,195,0.15)', color: ROSE_DK, padding: '0 1rem', borderRadius: '12px', border: '1.5px solid rgba(253,147,195,0.3)', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = ROSE_GRAD; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(253,147,195,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = ROSE_DK }}><Plus size={18} /></button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {editJob.requirements?.map((req, i) => (
                        <span key={i} style={{ background: 'rgba(253,147,195,0.12)', color: ROSE_DK, padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Bricolage Grotesque',sans-serif" }}>
                          {req}<button onClick={() => removeRequirement(i)} style={{ cursor: 'pointer', opacity: 0.7 }}><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '0.875rem', color: '#4B3A6E' }}>
                    <input type="checkbox" checked={editJob.isActive !== false} onChange={e => setEditJob(p => ({ ...p, isActive: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: '#FD93C3' }} />
                    {t('Publish job','نشر الوظيفة')}
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                  <button onClick={closeForm} style={{ flex: 1, padding: '0.75rem', borderRadius: '14px', border: '1.5px solid rgba(253,147,195,0.3)', background: 'transparent', color: '#6B5A7E', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = ROSE_DK; (e.currentTarget as HTMLButtonElement).style.color = ROSE_DK }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(253,147,195,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = '#6B5A7E' }}>{t('Cancel','إلغاء')}</button>
                  <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '0.75rem', borderRadius: '14px', background: ROSE_GRAD, color: '#fff', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.65 : 1, boxShadow: '0 6px 20px rgba(253,147,195,0.4)', transition: 'all 0.2s' }}>{saving ? t('Saving...','جاري الحفظ...') : t('Save Job','حفظ الوظيفة')}</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20" style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t('Loading...','جاري التحميل...')}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20"><Briefcase size={56} style={{ color: 'rgba(253,147,195,0.3)', margin: '0 auto 1rem' }} /><p style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t('No jobs yet','لا توجد وظائف بعد')}</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job, i) => (
              <motion.div key={job._id} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                style={{ ...GLASS_CARD, padding: '1.4rem', boxShadow: '0 4px 24px rgba(253,147,195,0.08)', transition: 'transform 0.25s,box-shadow 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 36px rgba(253,147,195,0.2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(253,147,195,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div>
                    <h3 style={{ fontFamily: "'Edu QLD Beginner', cursive", fontSize: '1rem', fontWeight: 700, color: '#1a0a2e', marginBottom: '4px' }}>{job.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{job.company} · {job.location}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => openEdit(job)} style={{ color: '#8EB5D2', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#5A90B8')} onMouseLeave={e => (e.currentTarget.style.color = '#8EB5D2')}><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(job._id)} style={{ color: '#EF4444', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')} onMouseLeave={e => (e.currentTarget.style.color = '#EF4444')}><Trash2 size={16} /></button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '0.75rem' }}>
                  <span style={{ background: 'rgba(253,147,195,0.12)', color: ROSE_DK, padding: '2px 10px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 600, fontFamily: "'Bricolage Grotesque',sans-serif" }}>{JOB_TYPE_LABELS[job.type]}</span>
                  <span style={{ background: job.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(100,116,139,0.1)', color: job.isActive ? '#16A34A' : '#64748B', padding: '2px 10px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 600, fontFamily: "'Bricolage Grotesque',sans-serif" }}>{job.isActive ? t('Published','منشور') : t('Hidden','مخفي')}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#6B5A7E', fontFamily: "'Bricolage Grotesque',sans-serif", lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{job.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
