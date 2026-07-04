'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Save, Plus, Trash2, User, Upload, Loader2, Link2 } from 'lucide-react'
import api from '@/lib/api'
import type { Profile } from '@/lib/types'
import { useAdminLang } from '@/contexts/AdminLanguageContext'

const ROSE_DK   = '#E8609A'
const ROSE_GRAD = 'linear-gradient(135deg,#FD93C3 0%,#E8609A 100%)'
const API_BASE  = process.env.NEXT_PUBLIC_API_URL?.replace('/api','') ?? 'http://localhost:5000'

const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(253,147,195,0.18)',
  borderRadius: '20px',
  padding: '1.75rem',
  boxShadow: '0 4px 24px rgba(253,147,195,0.07)',
}
const INPUT: React.CSSProperties = {
  width: '100%', padding: '0.7rem 1rem', borderRadius: '12px',
  border: '1.5px solid rgba(253,147,195,0.28)', background: 'rgba(255,255,255,0.85)',
  fontSize: '0.875rem', outline: 'none', color: '#1a0a2e',
  fontFamily: "'Bricolage Grotesque',sans-serif",
}
const INPUT_SM: React.CSSProperties = {
  width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px',
  border: '1.5px solid rgba(253,147,195,0.25)', background: 'rgba(255,255,255,0.85)',
  fontSize: '0.8125rem', outline: 'none', color: '#1a0a2e',
  fontFamily: "'Bricolage Grotesque',sans-serif",
}

/* ── Small helpers ── */
function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6B5A7E', display: 'block', marginBottom: '5px', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{children}</label>
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={INPUT}
        onFocus={e => (e.target.style.borderColor = '#FD93C3')}
        onBlur={e  => (e.target.style.borderColor = 'rgba(253,147,195,0.28)')} />
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: "'Edu QLD Beginner',cursive", fontSize: '1.1rem', fontWeight: 700, color: '#1a0a2e', marginBottom: '1.25rem' }}>{children}</h2>
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{ color: ROSE_DK, border: '1.5px solid rgba(253,147,195,0.3)', padding: '5px 14px', borderRadius: '10px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(253,147,195,0.06)', cursor: 'pointer', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, transition: 'all 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(253,147,195,0.15)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(253,147,195,0.06)' }}>
      <Plus size={14} />{label}
    </button>
  )
}

/* ── PDF Upload component ── */
function PdfUpload({ value, onChange, t }: { value: string; onChange: (url: string) => void; t: (en: string, ar: string) => string }) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { setError(t('Max file size is 10 MB','الحجم الأقصى 10 ميجابايت')); return }
    if (!file.name.toLowerCase().endsWith('.pdf')) { setError(t('Only PDF files allowed','PDF فقط')); return }
    setError(''); setUploading(true)
    try {
      const res = await api.upload(file)
      onChange(`${API_BASE}${res.url}`)
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Upload failed') }
    finally { setUploading(false) }
  }

  const filename = value
    ? decodeURIComponent(value.split('/').pop() ?? '')
        .replace(/_\d{13}(\.\w+)$/, '$1')   // strip the timestamp suffix
    : null

  return (
    <div>
      <Label>{t('CV / Resume (PDF, max 10 MB)','السيرة الذاتية (PDF، حد أقصى 10 ميجا)')}</Label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
        {/* URL input */}
        <input value={value} onChange={e => onChange(e.target.value)}
          placeholder={t('Paste URL or upload below','الصق رابط أو ارفع الملف أدناه')}
          style={{ ...INPUT, flex: 1 }}
          onFocus={e => (e.target.style.borderColor = '#FD93C3')}
          onBlur={e  => (e.target.style.borderColor = 'rgba(253,147,195,0.28)')} />
        {/* Upload button */}
        <button type="button" onClick={() => ref.current?.click()}
          disabled={uploading}
          style={{ padding: '0 1rem', borderRadius: '12px', background: uploading ? 'rgba(253,147,195,0.3)' : ROSE_GRAD, color: '#fff', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(253,147,195,0.35)' }}>
          {uploading ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Upload size={15} />}
          {uploading ? t('Uploading...','جاري الرفع...') : t('Upload PDF','رفع PDF')}
        </button>
        <input ref={ref} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
      </div>
      {/* Preview */}
      {filename && (
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(253,147,195,0.07)', border: '1px solid rgba(253,147,195,0.2)' }}>
          <Link2 size={13} style={{ color: ROSE_DK, flexShrink: 0 }} />
          <a href={value} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: ROSE_DK, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'Bricolage Grotesque',sans-serif" }}>
            {filename}
          </a>
        </div>
      )}
      {error && <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '6px', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{error}</p>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

/* ── Social links with proper icons ── */
const SOCIAL_PLATFORMS = [
  { key: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/...' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'twitter',   label: 'Twitter / X', placeholder: 'https://twitter.com/...' },
  { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/...' },
  { key: 'whatsapp',  label: 'WhatsApp',  placeholder: 'https://wa.me/20...' },
]

/* ── Main page ── */
export default function AdminProfilePage() {
  const { locale, dir, t } = useAdminLang()
  const [profile, setProfile] = useState<Partial<Profile>>({
    name: '', title: '', bio: '', avatar: '', cvFile: '',
    heroTagline: '', heroSubtitle: '',
    stats: { clients: 0, experience: 0, companies: 0, successRate: 0 },
    previousCompanies: [], testimonials: [],
    socialLinks: { linkedin: '', instagram: '', twitter: '', whatsapp: '', facebook: '' },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    api.get<{ profile: Profile }>('/profile')
      .then(res => { if (res.profile) setProfile(res.profile) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true); setSaveMsg('')
    try {
      await api.put('/profile', profile)
      setSaveMsg(t('Saved ✅','تم الحفظ ✅'))
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (e: unknown) { setSaveMsg(e instanceof Error ? e.message : 'Error') }
    finally { setSaving(false) }
  }

  const addCompany    = () => setProfile(p => ({ ...p, previousCompanies: [...(p.previousCompanies||[]), { name:'', logo:'', role:'', period:'' }] }))
  const updateCompany = (i: number, f: string, v: string) => setProfile(p => ({ ...p, previousCompanies: p.previousCompanies?.map((c,idx) => idx===i ? { ...c,[f]:v } : c) }))
  const removeCompany = (i: number) => setProfile(p => ({ ...p, previousCompanies: p.previousCompanies?.filter((_,idx) => idx!==i) }))

  const addTestimonial    = () => setProfile(p => ({ ...p, testimonials: [...(p.testimonials||[]), { name:'', role:'', avatar:'', text:'', rating:5 }] }))
  const updateTestimonial = (i: number, f: string, v: string|number) => setProfile(p => ({ ...p, testimonials: p.testimonials?.map((t2,idx) => idx===i ? { ...t2,[f]:v } : t2) }))
  const removeTestimonial = (i: number) => setProfile(p => ({ ...p, testimonials: p.testimonials?.filter((_,idx) => idx!==i) }))

  if (loading) return <AdminLayout><div style={{ textAlign:'center', padding:'4rem', color:'#8B6BA8', fontFamily:"'Bricolage Grotesque',sans-serif" }}>{t('Loading...','جاري التحميل...')}</div></AdminLayout>

  const basicFields = [
    { label: t('Name','الاسم'),              key: 'name' },
    { label: t('Title','المسمى الوظيفي'),    key: 'title' },
    { label: t('Avatar URL','رابط الصورة'), key: 'avatar' },
    { label: t('Hero Tagline','عبارة Hero'), key: 'heroTagline' },
    { label: t('Hero Subtitle','العبارة الفرعية'), key: 'heroSubtitle' },
  ]
  const statsFields = [
    { key: 'clients',     label: t('Clients','العملاء') },
    { key: 'experience',  label: t('Years Exp.','سنوات الخبرة') },
    { key: 'companies',   label: t('Companies','الشركات') },
    { key: 'successRate', label: t('Success %','معدل النجاح %') },
  ]

  return (
    <AdminLayout>
      <div style={{ maxWidth: '860px' }} dir={dir}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontFamily:"'Boldonse',cursive", fontSize:'clamp(1.5rem,3.5vw,2.1rem)', background:'linear-gradient(135deg,#2A1040 0%,#E8609A 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1.2 }}>{t('Profile','الملف الشخصي')}</h1>
            <p style={{ color:'#8B6BA8', fontFamily:"'Bricolage Grotesque',sans-serif", marginTop:'4px', fontSize:'0.9rem' }}>{t('Manage homepage content','إدارة بيانات الصفحة الرئيسية')}</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            {saveMsg && <span style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:'0.85rem', color: saveMsg.includes('✅')?'#16A34A':'#EF4444' }}>{saveMsg}</span>}
            <button onClick={handleSave} disabled={saving} style={{ background:ROSE_GRAD, color:'#fff', padding:'0.6rem 1.25rem', borderRadius:'12px', fontWeight:600, fontFamily:"'Bricolage Grotesque',sans-serif", display:'flex', alignItems:'center', gap:'8px', border:'none', cursor:saving?'not-allowed':'pointer', opacity:saving?0.65:1, boxShadow:'0 6px 20px rgba(253,147,195,0.4)', transition:'transform 0.2s' }}
              onMouseEnter={e => { if (!saving) (e.currentTarget as HTMLButtonElement).style.transform='scale(1.04)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform='scale(1)' }}>
              <Save size={18}/>{saving ? t('Saving...','جاري الحفظ...') : t('Save Changes','حفظ التغييرات')}
            </button>
          </div>
        </motion.div>

        {/* Basic Info */}
        <motion.section initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.06 }} style={{ ...GLASS, marginBottom:'1.5rem' }}>
          <SectionTitle><User size={18} style={{ color:ROSE_DK, display:'inline', verticalAlign:'middle', marginInlineEnd:'8px' }}/>{t('Basic Information','المعلومات الأساسية')}</SectionTitle>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1rem' }}>
            {basicFields.map(({ label, key }) => (
              <Field key={key} label={label} value={(profile as Record<string,string>)[key]||''} onChange={v => setProfile(p => ({ ...p,[key]:v }))} />
            ))}
          </div>
          <div style={{ marginTop:'1rem' }}>
            <Label>{t('Bio','نبذة شخصية')}</Label>
            <textarea value={profile.bio||''} onChange={e => setProfile(p => ({ ...p, bio:e.target.value }))} rows={4}
              style={{ ...INPUT, resize:'none' }}
              onFocus={e => (e.target.style.borderColor='#FD93C3')}
              onBlur={e  => (e.target.style.borderColor='rgba(253,147,195,0.28)')} />
          </div>
          {/* PDF Upload */}
          <div style={{ marginTop:'1rem' }}>
            <PdfUpload
              value={profile.cvFile||''}
              onChange={v => setProfile(p => ({ ...p, cvFile:v }))}
              t={t}
            />
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.10 }} style={{ ...GLASS, marginBottom:'1.5rem' }}>
          <SectionTitle>{t('Statistics','الأرقام والإحصائيات')}</SectionTitle>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1rem' }}>
            {statsFields.map(s => (
              <div key={s.key}>
                <Label>{s.label}</Label>
                <input type="number" value={profile.stats?.[s.key as keyof typeof profile.stats]||0}
                  onChange={e => setProfile(p => ({ ...p, stats:{ ...p.stats!, [s.key]:Number(e.target.value) } }))}
                  style={INPUT}
                  onFocus={e => (e.target.style.borderColor='#FD93C3')}
                  onBlur={e  => (e.target.style.borderColor='rgba(253,147,195,0.28)')} />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Previous Companies */}
        <motion.section initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.14 }} style={{ ...GLASS, marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
            <SectionTitle>{t('Previous Companies','الشركات السابقة')}</SectionTitle>
            <AddBtn onClick={addCompany} label={t('Add','إضافة')} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {profile.previousCompanies?.map((company, i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px', padding:'1rem', background:'rgba(253,147,195,0.05)', borderRadius:'14px', border:'1px solid rgba(253,147,195,0.12)' }}>
                <input style={INPUT_SM} placeholder={t('Company name','اسم الشركة')} value={company.name} onChange={e => updateCompany(i,'name',e.target.value)} />
                <input style={INPUT_SM} placeholder={t('Role','الدور')} value={company.role} onChange={e => updateCompany(i,'role',e.target.value)} />
                <input style={INPUT_SM} placeholder={t('Period (e.g. 2020-2022)','الفترة مثل 2020-2022')} value={company.period} onChange={e => updateCompany(i,'period',e.target.value)} />
                <div style={{ display:'flex', gap:'8px' }}>
                  <input style={{ ...INPUT_SM, flex:1 }} placeholder={t('Logo URL','رابط الشعار')} value={company.logo} onChange={e => updateCompany(i,'logo',e.target.value)} />
                  <button onClick={() => removeCompany(i)} style={{ color:'#EF4444', flexShrink:0, background:'none', border:'none', cursor:'pointer' }} onMouseEnter={e => (e.currentTarget.style.color='#DC2626')} onMouseLeave={e => (e.currentTarget.style.color='#EF4444')}><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
            {!profile.previousCompanies?.length && <p style={{ color:'#9CA3AF', fontSize:'0.82rem', fontFamily:"'Bricolage Grotesque',sans-serif", textAlign:'center', padding:'1rem' }}>{t('No companies added yet','لا توجد شركات بعد')}</p>}
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }} style={{ ...GLASS, marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
            <SectionTitle>{t('Testimonials','آراء العملاء')}</SectionTitle>
            <AddBtn onClick={addTestimonial} label={t('Add','إضافة')} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {profile.testimonials?.map((item, i) => (
              <div key={i} style={{ padding:'1rem', background:'rgba(253,147,195,0.05)', borderRadius:'14px', border:'1px solid rgba(253,147,195,0.12)' }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px', marginBottom:'10px' }}>
                  <input style={INPUT_SM} placeholder={t('Name','الاسم')} value={item.name} onChange={e => updateTestimonial(i,'name',e.target.value)} />
                  <input style={INPUT_SM} placeholder={t('Role / Title','الدور')} value={item.role} onChange={e => updateTestimonial(i,'role',e.target.value)} />
                  <input style={INPUT_SM} placeholder={t('Avatar URL','رابط الصورة')} value={item.avatar} onChange={e => updateTestimonial(i,'avatar',e.target.value)} />
                  <select style={INPUT_SM} value={item.rating} onChange={e => updateTestimonial(i,'rating',Number(e.target.value))}>
                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} {t('stars','نجوم')}</option>)}
                  </select>
                </div>
                <div style={{ display:'flex', gap:'8px' }}>
                  <textarea style={{ ...INPUT_SM, flex:1, resize:'none' as const }} placeholder={t('Testimonial text','نص التوصية')} value={item.text} onChange={e => updateTestimonial(i,'text',e.target.value)} rows={2} />
                  <button onClick={() => removeTestimonial(i)} style={{ color:'#EF4444', flexShrink:0, alignSelf:'flex-start', marginTop:'4px', background:'none', border:'none', cursor:'pointer' }} onMouseEnter={e => (e.currentTarget.style.color='#DC2626')} onMouseLeave={e => (e.currentTarget.style.color='#EF4444')}><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
            {!profile.testimonials?.length && <p style={{ color:'#9CA3AF', fontSize:'0.82rem', fontFamily:"'Bricolage Grotesque',sans-serif", textAlign:'center', padding:'1rem' }}>{t('No testimonials yet','لا توجد توصيات بعد')}</p>}
          </div>
        </motion.section>

        {/* Social Links */}
        <motion.section initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.22 }} style={{ ...GLASS, marginBottom:'1.5rem' }}>
          <SectionTitle>{t('Social Links','روابط التواصل الاجتماعي')}</SectionTitle>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem' }}>
            {SOCIAL_PLATFORMS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <Label>{label}</Label>
                <input
                  type="url"
                  value={profile.socialLinks?.[key as keyof typeof profile.socialLinks] ?? ''}
                  onChange={e => setProfile(p => ({
                    ...p,
                    socialLinks: { ...p.socialLinks!, [key]: e.target.value }
                  }))}
                  placeholder={placeholder}
                  style={INPUT}
                  onFocus={e => (e.target.style.borderColor = '#FD93C3')}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(253,147,195,0.28)')}
                />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Bottom save */}
        <div style={{ display:'flex', justifyContent:'flex-end', paddingBottom:'2rem' }}>
          <button onClick={handleSave} disabled={saving}
            style={{ background:ROSE_GRAD, color:'#fff', padding:'0.75rem 2rem', borderRadius:'14px', fontWeight:700, fontFamily:"'Bricolage Grotesque',sans-serif", display:'flex', alignItems:'center', gap:'8px', border:'none', cursor:saving?'not-allowed':'pointer', opacity:saving?0.65:1, boxShadow:'0 8px 24px rgba(253,147,195,0.4)', fontSize:'0.95rem' }}>
            <Save size={18}/>{saving ? t('Saving...','جاري الحفظ...') : t('Save All Changes','حفظ جميع التغييرات')}
          </button>
        </div>

      </div>
    </AdminLayout>
  )
}
