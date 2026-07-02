'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Plus, Pencil, Trash2, Briefcase, X, Check } from 'lucide-react'
import api from '@/lib/api'
import type { Job } from '@/lib/types'
import { JOB_TYPE_LABELS_AR } from '@/lib/constants'

const JOB_TYPE_LABELS = JOB_TYPE_LABELS_AR

const EMPTY_JOB: Partial<Job> = {
  title: '', company: '', location: '', type: 'full_time',
  description: '', requirements: [], salary: '', applyLink: '', image: '', isActive: true,
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editJob, setEditJob] = useState<Partial<Job>>(EMPTY_JOB)
  const [saving, setSaving] = useState(false)
  const [reqInput, setReqInput] = useState('')

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await api.get<{ jobs: Job[] }>('/jobs/all')
      setJobs(res.jobs)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const openNew = () => { setEditJob(EMPTY_JOB); setReqInput(''); setShowForm(true) }
  const openEdit = (job: Job) => { setEditJob({ ...job }); setReqInput(''); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditJob(EMPTY_JOB) }

  const addRequirement = () => {
    if (reqInput.trim()) {
      setEditJob((p) => ({ ...p, requirements: [...(p.requirements || []), reqInput.trim()] }))
      setReqInput('')
    }
  }

  const removeRequirement = (i: number) => {
    setEditJob((p) => ({ ...p, requirements: p.requirements?.filter((_, idx) => idx !== i) }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editJob._id) {
        const res = await api.put<{ job: Job }>(`/jobs/${editJob._id}`, editJob)
        setJobs((prev) => prev.map((j) => j._id === editJob._id ? res.job : j))
      } else {
        const res = await api.post<{ job: Job }>('/jobs', editJob)
        setJobs((prev) => [res.job, ...prev])
      }
      closeForm()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'خطأ في الحفظ')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذه الوظيفة؟')) return
    try {
      await api.delete(`/jobs/${id}`)
      setJobs((prev) => prev.filter((j) => j._id !== id))
    } catch {}
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl text-gray-900">الوظائف</h1>
            <p className="text-gray-500 mt-1">إضافة وإدارة فرص العمل</p>
          </div>
          <button onClick={openNew} className="bg-gradient-rose text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-rose hover:shadow-rose-lg transition-all hover:scale-105">
            <Plus size={18} /> إضافة وظيفة
          </button>
        </div>

        {/* Job Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-xl text-gray-900">{editJob._id ? 'تعديل وظيفة' : 'إضافة وظيفة جديدة'}</h2>
                <button onClick={closeForm} className="text-gray-400 hover:text-gray-700"><X size={22} /></button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input placeholder="المسمى الوظيفي *" value={editJob.title || ''} onChange={(e) => setEditJob((p) => ({ ...p, title: e.target.value }))} className="input-base" />
                  <input placeholder="اسم الشركة *" value={editJob.company || ''} onChange={(e) => setEditJob((p) => ({ ...p, company: e.target.value }))} className="input-base" />
                  <input placeholder="الموقع *" value={editJob.location || ''} onChange={(e) => setEditJob((p) => ({ ...p, location: e.target.value }))} className="input-base" />
                  <select value={editJob.type || 'full_time'} onChange={(e) => setEditJob((p) => ({ ...p, type: e.target.value as Job['type'] }))} className="input-base">
                    {Object.entries(JOB_TYPE_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                  </select>
                  <input placeholder="الراتب (اختياري)" value={editJob.salary || ''} onChange={(e) => setEditJob((p) => ({ ...p, salary: e.target.value }))} className="input-base" />
                  <input placeholder="رابط التقديم *" value={editJob.applyLink || ''} onChange={(e) => setEditJob((p) => ({ ...p, applyLink: e.target.value }))} className="input-base" />
                  <input placeholder="رابط الصورة (اختياري)" value={editJob.image || ''} onChange={(e) => setEditJob((p) => ({ ...p, image: e.target.value }))} className="input-base" />
                  <input type="date" placeholder="آخر موعد" onChange={(e) => setEditJob((p) => ({ ...p, deadline: e.target.value }))} className="input-base" />
                </div>
                <textarea placeholder="وصف الوظيفة *" value={editJob.description || ''} onChange={(e) => setEditJob((p) => ({ ...p, description: e.target.value }))} rows={4} className="input-base w-full resize-none" />

                {/* Requirements */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">المتطلبات</label>
                  <div className="flex gap-2 mb-2">
                    <input value={reqInput} onChange={(e) => setReqInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())} placeholder="أضف متطلب..." className="input-base flex-1" />
                    <button onClick={addRequirement} className="bg-rose/20 text-rose px-3 py-2 rounded-xl hover:bg-rose hover:text-white transition-all"><Plus size={18} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editJob.requirements?.map((req, i) => (
                      <span key={i} className="bg-rose/10 text-rose px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {req}
                        <button onClick={() => removeRequirement(i)}><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editJob.isActive !== false} onChange={(e) => setEditJob((p) => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-rose" />
                  <span className="text-sm text-gray-700">نشر الوظيفة</span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={closeForm} className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-gray-600 hover:border-gray-400 transition-all">إلغاء</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-gradient-rose text-white rounded-xl font-semibold shadow-rose hover:shadow-rose-lg transition-all disabled:opacity-60">
                  {saving ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Jobs Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-gray-400">جاري التحميل...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="text-gray-300 mx-auto mb-4" size={48} />
              <p className="text-gray-400">لا توجد وظائف بعد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    {['الوظيفة', 'الشركة', 'النوع', 'الحالة', 'إجراءات'].map((h) => (
                      <th key={h} className="text-right px-5 py-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, i) => (
                    <motion.tr key={job._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-4 font-medium text-gray-900">{job.title}</td>
                      <td className="px-5 py-4 text-gray-600">{job.company}</td>
                      <td className="px-5 py-4"><span className="bg-rose/10 text-rose text-xs px-2 py-1 rounded-full">{JOB_TYPE_LABELS[job.type]}</span></td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {job.isActive ? 'منشور' : 'مخفي'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEdit(job)} className="text-blue-500 hover:text-blue-700 transition-colors"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(job._id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .input-base {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 2px solid rgba(253, 147, 195, 0.3);
          background: rgba(255,255,255,0.8);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-base:focus {
          border-color: #FD93C3;
        }
      `}</style>
    </AdminLayout>
  )
}
