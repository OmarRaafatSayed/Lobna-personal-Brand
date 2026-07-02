'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Plus, Pencil, Trash2, BookOpen, X } from 'lucide-react'
import api from '@/lib/api'
import type { BlogPost } from '@/lib/types'

const EMPTY_POST: Partial<BlogPost> = {
  title: '', slug: '', excerpt: '', content: '',
  coverImage: '', tags: [], isPublished: false, readTime: 5,
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editPost, setEditPost] = useState<Partial<BlogPost>>(EMPTY_POST)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await api.get<{ posts: BlogPost[] }>('/blog/all')
      setPosts(res.posts)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const openNew = () => { setEditPost(EMPTY_POST); setTagInput(''); setShowForm(true) }
  const openEdit = (post: BlogPost) => { setEditPost({ ...post }); setTagInput(''); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditPost(EMPTY_POST) }

  const addTag = () => {
    if (tagInput.trim()) {
      setEditPost((p) => ({ ...p, tags: [...(p.tags || []), tagInput.trim()] }))
      setTagInput('')
    }
  }

  const handleTitleChange = (value: string) => {
    const slug = value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    setEditPost((p) => ({ ...p, title: value, slug }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editPost._id) {
        const res = await api.put<{ post: BlogPost }>(`/blog/${editPost._id}`, editPost)
        setPosts((prev) => prev.map((p) => p._id === editPost._id ? res.post : p))
      } else {
        const res = await api.post<{ post: BlogPost }>('/blog', editPost)
        setPosts((prev) => [res.post, ...prev])
      }
      closeForm()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'خطأ في الحفظ')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذا المقال؟')) return
    try {
      await api.delete(`/blog/${id}`)
      setPosts((prev) => prev.filter((p) => p._id !== id))
    } catch {}
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl text-gray-900">المدونة</h1>
            <p className="text-gray-500 mt-1">إدارة المقالات والمحتوى</p>
          </div>
          <button onClick={openNew} className="bg-gradient-rose text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-rose hover:shadow-rose-lg transition-all hover:scale-105">
            <Plus size={18} /> كتابة مقال
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-3xl my-8 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-xl text-gray-900">{editPost._id ? 'تعديل مقال' : 'كتابة مقال جديد'}</h2>
                <button onClick={closeForm} className="text-gray-400 hover:text-gray-700"><X size={22} /></button>
              </div>

              <div className="space-y-4">
                <input placeholder="عنوان المقال *" value={editPost.title || ''} onChange={(e) => handleTitleChange(e.target.value)} className="input-base w-full" />
                <input placeholder="الـ Slug (يُنشأ تلقائياً)" value={editPost.slug || ''} onChange={(e) => setEditPost((p) => ({ ...p, slug: e.target.value }))} className="input-base w-full ltr" />
                <textarea placeholder="المقتطف (ملخص قصير) *" value={editPost.excerpt || ''} onChange={(e) => setEditPost((p) => ({ ...p, excerpt: e.target.value }))} rows={2} className="input-base w-full resize-none" />
                <textarea placeholder="محتوى المقال (يدعم HTML بسيط) *" value={editPost.content || ''} onChange={(e) => setEditPost((p) => ({ ...p, content: e.target.value }))} rows={10} className="input-base w-full resize-none" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input placeholder="رابط صورة الغلاف" value={editPost.coverImage || ''} onChange={(e) => setEditPost((p) => ({ ...p, coverImage: e.target.value }))} className="input-base" />
                  <input type="number" placeholder="وقت القراءة (دقائق)" value={editPost.readTime || 5} onChange={(e) => setEditPost((p) => ({ ...p, readTime: Number(e.target.value) }))} className="input-base" />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">الوسوم</label>
                  <div className="flex gap-2 mb-2">
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="أضف وسم..." className="input-base flex-1" />
                    <button onClick={addTag} className="bg-rose/20 text-rose px-3 py-2 rounded-xl hover:bg-rose hover:text-white transition-all"><Plus size={18} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editPost.tags?.map((tag, i) => (
                      <span key={i} className="bg-rose/10 text-rose px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {tag}
                        <button onClick={() => setEditPost((p) => ({ ...p, tags: p.tags?.filter((_, idx) => idx !== i) }))}><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editPost.isPublished === true} onChange={(e) => setEditPost((p) => ({ ...p, isPublished: e.target.checked }))} className="w-4 h-4 accent-rose" />
                  <span className="text-sm text-gray-700">نشر المقال</span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={closeForm} className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-gray-600 hover:border-gray-400 transition-all">إلغاء</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-gradient-rose text-white rounded-xl font-semibold shadow-rose hover:shadow-rose-lg transition-all disabled:opacity-60">
                  {saving ? 'جاري الحفظ...' : 'نشر المقال'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-gray-400">جاري التحميل...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="text-gray-300 mx-auto mb-4" size={48} />
              <p className="text-gray-400">لا توجد مقالات بعد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    {['العنوان', 'الوسوم', 'وقت القراءة', 'الحالة', 'إجراءات'].map((h) => (
                      <th key={h} className="text-right px-5 py-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, i) => (
                    <motion.tr key={post._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-4 font-medium text-gray-900 max-w-xs">
                        <p className="line-clamp-1">{post.title}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="bg-rose/10 text-rose text-xs px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{post.readTime} دقائق</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {post.isPublished ? 'منشور' : 'مسودة'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEdit(post)} className="text-blue-500 hover:text-blue-700"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(post._id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
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
