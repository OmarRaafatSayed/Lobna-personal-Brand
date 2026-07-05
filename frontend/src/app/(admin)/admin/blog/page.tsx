'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Plus, Pencil, Trash2, BookOpen, X } from 'lucide-react'
import api from '@/lib/api'
import type { BlogPost } from '@/lib/types'
import { useAdminLang } from '@/contexts/AdminLanguageContext'

const ROSE_DK   = '#E8609A'
const ROSE_GRAD = 'linear-gradient(135deg,#FD93C3 0%,#E8609A 100%)'
const GLASS_TABLE = { background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(253,147,195,0.18)', borderRadius: '20px', overflow: 'hidden' } as const
const INPUT: React.CSSProperties = { width: '100%', padding: '0.7rem 1rem', borderRadius: '12px', border: '1.5px solid rgba(253,147,195,0.3)', background: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', outline: 'none', color: '#1a0a2e', fontFamily: "'Bricolage Grotesque',sans-serif" }
const EMPTY_POST: Partial<BlogPost> = { title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: [], isPublished: false, readTime: 5 }

export default function AdminBlogPage() {
  const { locale, dir, t } = useAdminLang()
  const [posts, setPosts]     = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editPost, setEditPost] = useState<Partial<BlogPost>>(EMPTY_POST)
  const [saving, setSaving]   = useState(false)
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    setLoading(true)
    api.get<{ posts: BlogPost[] }>('/blog?all=true').then(r => setPosts(r.posts)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const openNew  = () => { setEditPost(EMPTY_POST); setTagInput(''); setShowForm(true) }
  const openEdit = (p: BlogPost) => { setEditPost({ ...p }); setTagInput(''); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditPost(EMPTY_POST) }
  const addTag = () => { if (tagInput.trim()) { setEditPost(p => ({ ...p, tags: [...(p.tags||[]), tagInput.trim()] })); setTagInput('') } }
  const handleTitleChange = (v: string) => { const slug = v.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-'); setEditPost(p => ({ ...p, title: v, slug })) }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editPost._id) { const r = await api.put<{ post: BlogPost }>(`/blog/${editPost._id}`, editPost); setPosts(prev => prev.map(p => p._id === editPost._id ? r.post : p)) }
      else { const r = await api.post<{ post: BlogPost }>('/blog', editPost); setPosts(prev => [r.post, ...prev]) }
      closeForm()
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Error') } finally { setSaving(false) }
  }
  const handleDelete = async (id: string) => {
    if (!confirm(t('Delete this post?','حذف هذا المقال؟'))) return
    try { await api.delete(`/blog/${id}`); setPosts(prev => prev.filter(p => p._id !== id)) } catch {}
  }

  const PrimaryBtn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick} style={{ background: ROSE_GRAD, color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '12px', fontWeight: 600, fontFamily: "'Bricolage Grotesque',sans-serif", display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(253,147,195,0.4)', transition: 'transform 0.2s,box-shadow 0.2s' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)' }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}>{children}</button>
  )

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl" dir={dir}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: "'Boldonse',cursive", fontSize: 'clamp(1.5rem,3.5vw,2.1rem)', background: 'linear-gradient(135deg,#2A1040 0%,#E8609A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.2 }}>{t('Blog','المدونة')}</h1>
            <p style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif", marginTop: '4px', fontSize: '0.9rem' }}>{t('Manage articles and content','إدارة المقالات والمحتوى')}</p>
          </div>
          <PrimaryBtn onClick={openNew}><Plus size={18}/>{t('New Article','كتابة مقال')}</PrimaryBtn>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(15,10,20,0.7)', backdropFilter: 'blur(6px)' }}>
              <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(253,147,195,0.25)', borderRadius: '24px', width: '100%', maxWidth: '780px', padding: '2rem', marginTop: '2rem', marginBottom: '2rem', boxShadow: '0 32px 80px rgba(15,10,20,0.25)' }} dir={dir}>
                <div className="flex items-center justify-between mb-6">
                  <h2 style={{ fontFamily: "'Edu QLD Beginner',cursive", fontSize: '1.3rem', color: '#1a0a2e', fontWeight: 700 }}>{editPost._id ? t('Edit Article','تعديل مقال') : t('New Article','كتابة مقال جديد')}</h2>
                  <button onClick={closeForm} style={{ color: '#8B6BA8', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.color = ROSE_DK)} onMouseLeave={e => (e.currentTarget.style.color = '#8B6BA8')}><X size={22}/></button>
                </div>
                <div className="space-y-4">
                  <input style={INPUT} placeholder={t('Title *','عنوان المقال *')} value={editPost.title||''} onChange={e => handleTitleChange(e.target.value)}/>
                  <input style={{ ...INPUT, direction: 'ltr', textAlign: 'left' }} placeholder="Slug (auto-generated)" value={editPost.slug||''} onChange={e => setEditPost(p => ({ ...p, slug: e.target.value }))}/>
                  <textarea style={{ ...INPUT, resize: 'none' }} placeholder={t('Excerpt *','المقتطف *')} value={editPost.excerpt||''} onChange={e => setEditPost(p => ({ ...p, excerpt: e.target.value }))} rows={2}/>
                  <textarea style={{ ...INPUT, resize: 'none' }} placeholder={t('Content *','محتوى المقال *')} value={editPost.content||''} onChange={e => setEditPost(p => ({ ...p, content: e.target.value }))} rows={10}/>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input style={INPUT} placeholder={t('Cover image URL','رابط صورة الغلاف')} value={editPost.coverImage||''} onChange={e => setEditPost(p => ({ ...p, coverImage: e.target.value }))}/>
                    <input type="number" style={INPUT} placeholder={t('Read time (min)','وقت القراءة (دقائق)')} value={editPost.readTime||5} onChange={e => setEditPost(p => ({ ...p, readTime: Number(e.target.value) }))}/>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6B5A7E', display: 'block', marginBottom: '8px', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t('Tags','الوسوم')}</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <input style={INPUT} value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key==='Enter'&&(e.preventDefault(),addTag())} placeholder={t('Add tag...','أضف وسم...')}/>
                      <button onClick={addTag} style={{ background: 'rgba(253,147,195,0.15)', color: ROSE_DK, padding: '0 1rem', borderRadius: '12px', border: '1.5px solid rgba(253,147,195,0.3)', cursor: 'pointer', flexShrink: 0 }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = ROSE_GRAD; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(253,147,195,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = ROSE_DK }}><Plus size={18}/></button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {editPost.tags?.map((tag,i) => (
                        <span key={i} style={{ background: 'rgba(253,147,195,0.12)', color: ROSE_DK, padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Bricolage Grotesque',sans-serif" }}>
                          {tag}<button onClick={() => setEditPost(p => ({ ...p, tags: p.tags?.filter((_,idx) => idx!==i) }))} style={{ cursor: 'pointer', opacity: 0.7, background: 'none', border: 'none' }}><X size={12}/></button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '0.875rem', color: '#4B3A6E' }}>
                    <input type="checkbox" checked={editPost.isPublished===true} onChange={e => setEditPost(p => ({ ...p, isPublished: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: '#FD93C3' }}/>
                    {t('Publish article','نشر المقال')}
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                  <button onClick={closeForm} style={{ flex: 1, padding: '0.75rem', borderRadius: '14px', border: '1.5px solid rgba(253,147,195,0.3)', background: 'transparent', color: '#6B5A7E', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, cursor: 'pointer' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = ROSE_DK; (e.currentTarget as HTMLButtonElement).style.color = ROSE_DK }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(253,147,195,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = '#6B5A7E' }}>{t('Cancel','إلغاء')}</button>
                  <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '0.75rem', borderRadius: '14px', background: ROSE_GRAD, color: '#fff', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, border: 'none', cursor: saving?'not-allowed':'pointer', opacity: saving?0.65:1, boxShadow: '0 6px 20px rgba(253,147,195,0.4)' }}>{saving ? t('Saving...','جاري الحفظ...') : t('Publish','نشر المقال')}</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={GLASS_TABLE}>
          {loading ? (
            <div className="text-center py-20" style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t('Loading...','جاري التحميل...')}</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20"><BookOpen size={48} style={{ color: 'rgba(253,147,195,0.35)', margin: '0 auto 1rem' }}/><p style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t('No posts yet','لا توجد مقالات بعد')}</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(253,147,195,0.06)', borderBottom: '1px solid rgba(253,147,195,0.12)' }}>
                    {[t('Title','العنوان'), t('Tags','الوسوم'), t('Read Time','وقت القراءة'), t('Status','الحالة'), t('Actions','إجراءات')].map(h => (
                      <th key={h} style={{ textAlign: dir==='rtl'?'right':'left', padding: '0.7rem 1.25rem', fontSize: '0.72rem', color: '#8B6BA8', fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, i) => (
                    <motion.tr key={post._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      style={{ borderTop: '1px solid rgba(253,147,195,0.07)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(253,147,195,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: '#1a0a2e', maxWidth: '280px' }}>
                        <p style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{post.title}</p>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {post.tags.slice(0,2).map(tag => (
                            <span key={tag} style={{ background: 'rgba(253,147,195,0.12)', color: ROSE_DK, padding: '2px 8px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 600 }}>{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', color: '#6B5A7E', whiteSpace: 'nowrap' }}>{post.readTime} {t('min','دقائق')}</td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <span style={{ background: post.isPublished?'rgba(34,197,94,0.12)':'rgba(100,116,139,0.1)', color: post.isPublished?'#16A34A':'#64748B', padding: '3px 10px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700 }}>
                          {post.isPublished ? t('Published','منشور') : t('Draft','مسودة')}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button onClick={() => openEdit(post)} style={{ color: '#8EB5D2', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.color='#5A90B8')} onMouseLeave={e => (e.currentTarget.style.color='#8EB5D2')}><Pencil size={16}/></button>
                          <button onClick={() => handleDelete(post._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.color='#DC2626')} onMouseLeave={e => (e.currentTarget.style.color='#EF4444')}><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  )
}
