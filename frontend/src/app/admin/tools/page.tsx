'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Plus, Pencil, Trash2, Wrench, X } from 'lucide-react'
import api from '@/lib/api'
import type { Tool } from '@/lib/types'
import { TOOL_CATEGORY_LABELS_AR } from '@/lib/constants'

const TOOL_CATEGORY_LABELS = TOOL_CATEGORY_LABELS_AR

const EMPTY_TOOL: Partial<Tool> = {
  name: '', description: '', category: 'other', link: '', icon: '', isActive: true, order: 0,
}

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTool, setEditTool] = useState<Partial<Tool>>(EMPTY_TOOL)
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await api.get<{ tools: Tool[] }>('/tools/all')
      setTools(res.tools)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const openNew = () => { setEditTool(EMPTY_TOOL); setShowForm(true) }
  const openEdit = (tool: Tool) => { setEditTool({ ...tool }); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditTool(EMPTY_TOOL) }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editTool._id) {
        const res = await api.put<{ tool: Tool }>(`/tools/${editTool._id}`, editTool)
        setTools((prev) => prev.map((t) => t._id === editTool._id ? res.tool : t))
      } else {
        const res = await api.post<{ tool: Tool }>('/tools', editTool)
        setTools((prev) => [res.tool, ...prev])
      }
      closeForm()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'خطأ في الحفظ')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذه الأداة؟')) return
    try {
      await api.delete(`/tools/${id}`)
      setTools((prev) => prev.filter((t) => t._id !== id))
    } catch {}
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl text-gray-900">أدوات المبيعات</h1>
            <p className="text-gray-500 mt-1">إدارة الأدوات المقترحة</p>
          </div>
          <button onClick={openNew} className="bg-gradient-rose text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-rose hover:shadow-rose-lg transition-all hover:scale-105">
            <Plus size={18} /> إضافة أداة
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-xl text-gray-900">{editTool._id ? 'تعديل أداة' : 'إضافة أداة جديدة'}</h2>
                <button onClick={closeForm} className="text-gray-400 hover:text-gray-700"><X size={22} /></button>
              </div>

              <div className="space-y-4">
                <input placeholder="اسم الأداة *" value={editTool.name || ''} onChange={(e) => setEditTool((p) => ({ ...p, name: e.target.value }))} className="input-base w-full" />
                <textarea placeholder="وصف الأداة *" value={editTool.description || ''} onChange={(e) => setEditTool((p) => ({ ...p, description: e.target.value }))} rows={3} className="input-base w-full resize-none" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={editTool.category || 'other'} onChange={(e) => setEditTool((p) => ({ ...p, category: e.target.value }))} className="input-base">
                    {Object.entries(TOOL_CATEGORY_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                  </select>
                  <input placeholder="رمز الأيقونة (إيموجي)" value={editTool.icon || ''} onChange={(e) => setEditTool((p) => ({ ...p, icon: e.target.value }))} className="input-base" />
                  <input placeholder="رابط الأداة" value={editTool.link || ''} onChange={(e) => setEditTool((p) => ({ ...p, link: e.target.value }))} className="input-base" />
                  <input type="number" placeholder="الترتيب" value={editTool.order || 0} onChange={(e) => setEditTool((p) => ({ ...p, order: Number(e.target.value) }))} className="input-base" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editTool.isActive !== false} onChange={(e) => setEditTool((p) => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-rose" />
                  <span className="text-sm text-gray-700">نشر الأداة</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-3 text-center py-20 text-gray-400">جاري التحميل...</div>
          ) : tools.length === 0 ? (
            <div className="col-span-3 text-center py-20">
              <Wrench className="text-gray-300 mx-auto mb-4" size={48} />
              <p className="text-gray-400">لا توجد أدوات بعد</p>
            </div>
          ) : tools.map((tool, i) => (
            <motion.div key={tool._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose/10 rounded-xl flex items-center justify-center text-2xl">
                    {tool.icon || <Wrench className="text-rose" size={22} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tool.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {tool.isActive ? 'نشط' : 'مخفي'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(tool)} className="text-blue-500 hover:text-blue-700"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(tool._id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{tool.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .input-base {
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 2px solid rgba(253, 147, 195, 0.3);
          background: rgba(255,255,255,0.8);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-base:focus { border-color: #FD93C3; }
      `}</style>
    </AdminLayout>
  )
}
