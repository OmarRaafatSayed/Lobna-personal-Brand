'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Save, Plus, Trash2, User } from 'lucide-react'
import api from '@/lib/api'
import type { Profile } from '@/lib/types'

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({
    name: '', title: '', bio: '', avatar: '', cvFile: '',
    heroTagline: '', heroSubtitle: '',
    stats: { clients: 0, experience: 0, companies: 0, successRate: 0 },
    previousCompanies: [],
    testimonials: [],
    socialLinks: { linkedin: '', instagram: '', twitter: '', whatsapp: '', facebook: '' },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get<{ profile: Profile }>('/profile')
      .then((res) => { if (res.profile) setProfile(res.profile) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/profile', profile)
      alert('تم حفظ الملف الشخصي بنجاح ✅')
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'خطأ في الحفظ')
    } finally { setSaving(false) }
  }

  const addCompany = () => {
    setProfile((p) => ({
      ...p,
      previousCompanies: [...(p.previousCompanies || []), { name: '', logo: '', role: '', period: '' }],
    }))
  }

  const updateCompany = (i: number, field: string, value: string) => {
    setProfile((p) => ({
      ...p,
      previousCompanies: p.previousCompanies?.map((c, idx) => idx === i ? { ...c, [field]: value } : c),
    }))
  }

  const removeCompany = (i: number) => {
    setProfile((p) => ({ ...p, previousCompanies: p.previousCompanies?.filter((_, idx) => idx !== i) }))
  }

  const addTestimonial = () => {
    setProfile((p) => ({
      ...p,
      testimonials: [...(p.testimonials || []), { name: '', role: '', avatar: '', text: '', rating: 5 }],
    }))
  }

  const updateTestimonial = (i: number, field: string, value: string | number) => {
    setProfile((p) => ({
      ...p,
      testimonials: p.testimonials?.map((t, idx) => idx === i ? { ...t, [field]: value } : t),
    }))
  }

  const removeTestimonial = (i: number) => {
    setProfile((p) => ({ ...p, testimonials: p.testimonials?.filter((_, idx) => idx !== i) }))
  }

  if (loading) return <AdminLayout><div className="text-center py-20 text-gray-400">جاري التحميل...</div></AdminLayout>

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl text-gray-900">الملف الشخصي</h1>
            <p className="text-gray-500 mt-1">إدارة بيانات الصفحة الرئيسية</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-gradient-rose text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-rose hover:shadow-rose-lg transition-all hover:scale-105 disabled:opacity-60">
            <Save size={18} />{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>

        {/* Basic Info */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg text-gray-900 mb-5 flex items-center gap-2"><User size={20} className="text-rose" />المعلومات الأساسية</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="الاسم" value={profile.name || ''} onChange={(v) => setProfile((p) => ({ ...p, name: v }))} />
            <Field label="المسمى الوظيفي" value={profile.title || ''} onChange={(v) => setProfile((p) => ({ ...p, title: v }))} />
            <Field label="رابط الصورة الشخصية" value={profile.avatar || ''} onChange={(v) => setProfile((p) => ({ ...p, avatar: v }))} />
            <Field label="رابط السيرة الذاتية (PDF)" value={profile.cvFile || ''} onChange={(v) => setProfile((p) => ({ ...p, cvFile: v }))} />
            <Field label="عبارة Hero الرئيسية" value={profile.heroTagline || ''} onChange={(v) => setProfile((p) => ({ ...p, heroTagline: v }))} />
            <Field label="العبارة الفرعية" value={profile.heroSubtitle || ''} onChange={(v) => setProfile((p) => ({ ...p, heroSubtitle: v }))} />
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">نبذة شخصية</label>
            <textarea value={profile.bio || ''} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-rose/30 focus:border-rose focus:outline-none bg-white/80 resize-none text-sm" />
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg text-gray-900 mb-5">الأرقام والإحصائيات</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { key: 'clients', label: 'عدد العملاء' },
              { key: 'experience', label: 'سنوات الخبرة' },
              { key: 'companies', label: 'عدد الشركات' },
              { key: 'successRate', label: 'معدل النجاح %' },
            ].map((stat) => (
              <div key={stat.key}>
                <label className="text-xs font-medium text-gray-500 block mb-1">{stat.label}</label>
                <input
                  type="number"
                  value={profile.stats?.[stat.key as keyof typeof profile.stats] || 0}
                  onChange={(e) => setProfile((p) => ({ ...p, stats: { ...p.stats!, [stat.key]: Number(e.target.value) } }))}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-rose/30 focus:border-rose focus:outline-none text-sm bg-white"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Previous Companies */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg text-gray-900">الشركات السابقة</h2>
            <button onClick={addCompany} className="text-rose border border-rose/30 px-3 py-1.5 rounded-xl text-sm flex items-center gap-1 hover:bg-rose/10 transition-all">
              <Plus size={14} /> إضافة
            </button>
          </div>
          <div className="space-y-4">
            {profile.previousCompanies?.map((company, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-rose/5 rounded-xl">
                <input placeholder="اسم الشركة" value={company.name} onChange={(e) => updateCompany(i, 'name', e.target.value)} className="input-sm" />
                <input placeholder="الدور" value={company.role} onChange={(e) => updateCompany(i, 'role', e.target.value)} className="input-sm" />
                <input placeholder="الفترة (مثل 2020-2022)" value={company.period} onChange={(e) => updateCompany(i, 'period', e.target.value)} className="input-sm" />
                <div className="flex gap-2">
                  <input placeholder="رابط الشعار" value={company.logo} onChange={(e) => updateCompany(i, 'logo', e.target.value)} className="input-sm flex-1" />
                  <button onClick={() => removeCompany(i)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg text-gray-900">آراء العملاء</h2>
            <button onClick={addTestimonial} className="text-rose border border-rose/30 px-3 py-1.5 rounded-xl text-sm flex items-center gap-1 hover:bg-rose/10 transition-all">
              <Plus size={14} /> إضافة
            </button>
          </div>
          <div className="space-y-4">
            {profile.testimonials?.map((t, i) => (
              <div key={i} className="p-4 bg-rose/5 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="الاسم" value={t.name} onChange={(e) => updateTestimonial(i, 'name', e.target.value)} className="input-sm" />
                  <input placeholder="الدور / الوظيفة" value={t.role} onChange={(e) => updateTestimonial(i, 'role', e.target.value)} className="input-sm" />
                  <input placeholder="رابط الصورة" value={t.avatar} onChange={(e) => updateTestimonial(i, 'avatar', e.target.value)} className="input-sm" />
                  <select value={t.rating} onChange={(e) => updateTestimonial(i, 'rating', Number(e.target.value))} className="input-sm">
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} نجوم</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <textarea placeholder="نص التوصية" value={t.text} onChange={(e) => updateTestimonial(i, 'text', e.target.value)} rows={2} className="input-sm flex-1 resize-none" />
                  <button onClick={() => removeTestimonial(i)} className="text-red-400 hover:text-red-600 self-start mt-1"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Social Links */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg text-gray-900 mb-5">روابط التواصل الاجتماعي</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['linkedin', 'instagram', 'twitter', 'facebook', 'whatsapp'].map((platform) => (
              <Field
                key={platform}
                label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                value={profile.socialLinks?.[platform as keyof typeof profile.socialLinks] || ''}
                onChange={(v) => setProfile((p) => ({ ...p, socialLinks: { ...p.socialLinks!, [platform]: v } }))}
                placeholder={`https://...`}
              />
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .input-sm {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          border: 1.5px solid rgba(253, 147, 195, 0.3);
          background: white;
          font-size: 0.8125rem;
          outline: none;
        }
        .input-sm:focus { border-color: #FD93C3; }
      `}</style>
    </AdminLayout>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-rose/30 focus:border-rose focus:outline-none bg-white/80 text-sm"
      />
    </div>
  )
}
