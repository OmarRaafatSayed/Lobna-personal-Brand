'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Plus, Pencil, Trash2, Wrench, X } from 'lucide-react'
import api from '@/lib/api'
import type { Tool } from '@/lib/types'
import { TOOL_CATEGORY_LABELS_AR, TOOL_CATEGORY_LABELS_EN } from '@/lib/constants'
import { useAdminLang } from '@/contexts/AdminLanguageContext'

const ROSE_DK   = '#E8609A'
const ROSE_GRAD = 'linear-gradient(135deg,#FD93C3 0%,#E8609A 100%)'
const GLASS_CARD = { background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(253,147,195,0.18)', borderRadius: '20px' } as const
const INPUT: React.CSSProperties = { width: '100%', padding: '0.7rem 1rem', borderRadius: '12px', border: '1.5px solid rgba(253,147,195,0.3)', background: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', outline: 'none', color: '#1a0a2e', fontFamily: "'Bricolage Grotesque',sans-serif" }
const EMPTY_TOOL: Partial<Tool> = { name: '', description: '', category: 'other', link: '', icon: '', isActive: true, order: 0 }

export default function AdminToolsPage() {
  const { locale, dir, t } = useAdminLang()
  const TOOL_CATEGORY_LABELS = locale === 'ar' ? TOOL_CATEGORY_LABELS_AR : TOOL_CATEGORY_LABELS_EN
  const [tools, setTools]     = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTool, setEditTool] = useState<Partial<Tool>>(EMPTY_TOOL)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get<{ tools: Tool[] }>('/tools/all').then(r => setTools(r.tools)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const openNew  = () => { setEditTool(EMPTY_TOOL); setShowForm(true) }
  const openEdit = (tool: Tool) => { setEditTool({ ...tool }); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditTool(EMPTY_TOOL) }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editTool._id) { const r = await api.put<{ tool: Tool }>(`/tools/${editTool._id}`, editTool); setTools(prev => prev.map(t => t._id===editTool._id ? r.tool : t)) }
      else { const r = await api.post<{ tool: Tool }>('/tools', editTool); setTools(prev => [r.tool, ...prev]) }
      closeForm()
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Error') } finally { setSaving(false) }
  }
  const handleDelete = async (id: string) => {
    if (!confirm(t('Delete this tool?','حذف هذه الأداة؟'))) return
    try { await api.delete(`/tools/${id}`); setTools(prev => prev.filter(t => t._id!==id)) } catch {}
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl" dir={dir}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: "'Boldonse',cursive", fontSize: 'clamp(1.5rem,3.5vw,2.1rem)', background: 'linear-gradient(135deg,#2A1040 0%,#E8609A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.2 }}>{t('Sales Tools','أدوات المبيعات')}</h1>
            <p style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif", marginTop: '4px', fontSize: '0.9rem' }}>{t('Manage recommended tools','إدارة الأدوات المقترحة')}</p>
          </div>
          <button onClick={openNew} style={{ background: ROSE_GRAD, color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '12px', fontWeight: 600, fontFamily: "'Bricolage Grotesque',sans-serif", display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(253,147,195,0.4)', transition: 'transform 0.2s' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)' }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}>
            <Plus size={18}/>{t('Add Tool','إضافة أداة')}
          </button>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,10,20,0.7)', backdropFilter: 'blur(6px)' }}>
              <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(253,147,195,0.25)', borderRadius: '24px', width: '100%', maxWidth: '540px', padding: '2rem', boxShadow: '0 32px 80px rgba(15,10,20,0.25)' }} dir={dir}>
                <div className="flex items-center justify-between mb-6">
                  <h2 style={{ fontFamily: "'Edu QLD Beginner',cursive", fontSize: '1.3rem', color: '#1a0a2e', fontWeight: 700 }}>{editTool._id ? t('Edit Tool','تعديل أداة') : t('New Tool','إضافة أداة جديدة')}</h2>
                  <button onClick={closeForm} style={{ color: '#8B6BA8', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.color=ROSE_DK)} onMouseLeave={e => (e.currentTarget.style.color='#8B6BA8')}><X size={22}/></button>
                </div>
                <div className="space-y-4">
                  <input style={INPUT} placeholder={t('Tool name *','اسم الأداة *')} value={editTool.name||''} onChange={e => setEditTool(p => ({ ...p, name: e.target.value }))}/>
                  <textarea style={{ ...INPUT, resize: 'none' }} placeholder={t('Description *','وصف الأداة *')} value={editTool.description||''} onChange={e => setEditTool(p => ({ ...p, description: e.target.value }))} rows={3}/>
                  <div className="grid grid-cols-2 gap-4">
                    <select style={INPUT} value={editTool.category||'other'} onChange={e => setEditTool(p => ({ ...p, category: e.target.value }))}>
                      {Object.entries(TOOL_CATEGORY_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <input style={INPUT} placeholder={t('Icon (emoji)','رمز الأيقونة (إيموجي)')} value={editTool.icon||''} onChange={e => setEditTool(p => ({ ...p, icon: e.target.value }))}/>
                    <input style={INPUT} placeholder={t('Tool URL','رابط الأداة')} value={editTool.link||''} onChange={e => setEditTool(p => ({ ...p, link: e.target.value }))}/>
                    <input type="number" style={INPUT} placeholder={t('Order','الترتيب')} value={editTool.order||0} onChange={e => setEditTool(p => ({ ...p, order: Number(e.target.value) }))}/>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '0.875rem', color: '#4B3A6E' }}>
                    <input type="checkbox" checked={editTool.isActive!==false} onChange={e => setEditTool(p => ({ ...p, isActive: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: '#FD93C3' }}/>
                    {t('Publish tool','نشر الأداة')}
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                  <button onClick={closeForm} style={{ flex: 1, padding: '0.75rem', borderRadius: '14px', border: '1.5px solid rgba(253,147,195,0.3)', background: 'transparent', color: '#6B5A7E', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, cursor: 'pointer' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor=ROSE_DK; (e.currentTarget as HTMLButtonElement).style.color=ROSE_DK }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(253,147,195,0.3)'; (e.currentTarget as HTMLButtonElement).style.color='#6B5A7E' }}>{t('Cancel','إلغاء')}</button>
                  <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '0.75rem', borderRadius: '14px', background: ROSE_GRAD, color: '#fff', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, border: 'none', cursor: saving?'not-allowed':'pointer', opacity: saving?0.65:1 }}>{saving ? t('Saving...','جاري الحفظ...') : t('Save','حفظ')}</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20" style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t('Loading...','جاري التحميل...')}</div>
        ) : tools.length === 0 ? (
          <div className="text-center py-20"><Wrench size={56} style={{ color: 'rgba(253,147,195,0.3)', margin: '0 auto 1rem' }}/><p style={{ color: '#8B6BA8', fontFamily: "'Bricolage Grotesque',sans-serif" }}>{t('No tools yet','لا توجد أدوات بعد')}</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, i) => (
              <motion.div key={tool._id} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                style={{ ...GLASS_CARD, padding: '1.4rem', boxShadow: '0 4px 24px rgba(253,147,195,0.08)', transition: 'transform 0.25s,box-shadow 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 12px 36px rgba(253,147,195,0.2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 4px 24px rgba(253,147,195,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(253,147,195,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{tool.icon || <Wrench size={22} style={{ color: ROSE_DK }}/>}</div>
                    <div>
                      <h3 style={{ fontFamily: "'Edu QLD Beginner',cursive", fontSize: '0.95rem', fontWeight: 700, color: '#1a0a2e', marginBottom: '3px' }}>{tool.name}</h3>
                      <span style={{ background: tool.isActive?'rgba(34,197,94,0.12)':'rgba(100,116,139,0.1)', color: tool.isActive?'#16A34A':'#64748B', padding: '1px 8px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 600, fontFamily: "'Bricolage Grotesque',sans-serif" }}>{tool.isActive ? t('Active','نشط') : t('Hidden','مخفي')}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEdit(tool)} style={{ color: '#8EB5D2', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.color='#5A90B8')} onMouseLeave={e => (e.currentTarget.style.color='#8EB5D2')}><Pencil size={15}/></button>
                    <button onClick={() => handleDelete(tool._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.color='#DC2626')} onMouseLeave={e => (e.currentTarget.style.color='#EF4444')}><Trash2 size={15}/></button>
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#6B5A7E', fontFamily: "'Bricolage Grotesque',sans-serif", lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{tool.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
