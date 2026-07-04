'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ExternalLink, Zap } from 'lucide-react'
import api from '@/lib/api'
import type { Tool } from '@/lib/types'
import { TOOL_CATEGORY_LABELS_AR, TOOL_CATEGORY_LABELS_EN } from '@/lib/constants'
import { useLanguage } from '@/contexts/LanguageContext'

/* ─── Typography ─── */
const FD = 'Boldonse, cursive'
const FH = "'Edu QLD Beginner', cursive"
const FB = "'Bricolage Grotesque', sans-serif"

export default function ToolsPage() {
  const { t, locale, dir } = useLanguage()
  const TOOL_CATEGORY_LABELS = locale === 'ar' ? TOOL_CATEGORY_LABELS_AR : TOOL_CATEGORY_LABELS_EN
  const [tools, setTools] = useState<Tool[]>([])
  const [filtered, setFiltered] = useState<Tool[]>([])
  const [cat, setCat] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ tools: Tool[] }>('/tools')
      .then(r => { setTools(r.tools); setFiltered(r.tools) })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  const cats = ['all', ...Array.from(new Set(tools.map(tool => tool.category)))]

  useEffect(() => {
    setFiltered(cat === 'all' ? tools : tools.filter(tool => tool.category === cat))
  }, [cat, tools])

  const allLabel = locale === 'ar' ? '✦ الكل' : '✦ All'
  const noTools = locale === 'ar' ? 'لا توجد أدوات حالياً' : 'No tools available right now'

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#FBF9F7', direction: dir }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0F0A14 0%, #2A1040 100%)',
          padding: 'clamp(8rem, 15vh, 10rem) 0 clamp(4rem, 8vh, 6rem)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background blob */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: 400, height: 400, borderRadius: '50%',
            background: 'rgba(142,181,210,0.08)', filter: 'blur(120px)',
            pointerEvents: 'none',
          }} />

          <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 99,
                background: 'rgba(253,147,195,0.1)',
                border: '1px solid rgba(253,147,195,0.25)',
                color: '#FD93C3',
                fontFamily: FB, fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
              ✦ {t('toolsTitle')}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: FD,
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: '1rem',
              }}>
              {t('toolsHeading')}{' '}
              <span style={{
                background: 'linear-gradient(135deg,#FD93C3,#E8609A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {t('toolsSubheading')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontFamily: FB,
                color: 'rgba(255,255,255,0.5)',
                fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
                maxWidth: 540,
                margin: '0 auto',
              }}>
              {t('toolsDesc')}
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="wrap" style={{
          padding: 'clamp(3rem, 6vw, 5rem) 1.5rem clamp(5rem, 8vw, 7rem)',
        }}>
          {/* Category filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: 'clamp(2rem, 4vw, 3rem)',
            }}>
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                style={{
                  fontFamily: FB,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  padding: '0.625rem 1.25rem',
                  borderRadius: 99,
                  border: '1px solid',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  ...(cat === c
                    ? {
                      background: 'linear-gradient(135deg, #FD93C3, #E8609A)',
                      color: '#fff',
                      borderColor: 'transparent',
                      boxShadow: '0 8px 24px rgba(253,147,195,0.4)',
                    }
                    : {
                      background: '#fff',
                      color: 'rgba(15,10,20,0.6)',
                      borderColor: 'rgba(15,10,20,0.1)',
                      boxShadow: '0 2px 12px rgba(15,10,20,0.04)',
                    }),
                }}
                onMouseEnter={e => {
                  if (cat !== c) {
                    e.currentTarget.style.borderColor = 'rgba(253,147,195,0.5)'
                    e.currentTarget.style.color = '#FD93C3'
                  }
                }}
                onMouseLeave={e => {
                  if (cat !== c) {
                    e.currentTarget.style.borderColor = 'rgba(15,10,20,0.1)'
                    e.currentTarget.style.color = 'rgba(15,10,20,0.6)'
                  }
                }}>
                {c === 'all' ? allLabel : TOOL_CATEGORY_LABELS[c] || c}
              </button>
            ))}
          </motion.div>

          {/* Tools Grid */}
          {loading ? (
            <div className="cards-grid-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="shimmer" style={{ height: 220, borderRadius: '1.5rem' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <Zap style={{ color: 'rgba(15,10,20,0.15)', margin: '0 auto 1rem' }} size={64} />
              <p style={{ fontFamily: FB, color: 'rgba(15,10,20,0.4)', fontSize: '1.1rem' }}>
                {noTools}
              </p>
            </div>
          ) : (
            <div className="cards-grid-3">
              {filtered.map((tool, i) => (
                <motion.div
                  key={tool._id || `tool-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="lift"
                  style={{
                    background: '#fff',
                    borderRadius: '1.5rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 24px rgba(15,10,20,0.06)',
                    border: '1px solid rgba(15,10,20,0.05)',
                  }}>
                  {/* Icon + Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, #FD93C3, #E8609A)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.75rem',
                      boxShadow: '0 8px 24px rgba(253,147,195,0.4)',
                      flexShrink: 0,
                    }}>
                      {tool.icon || <Zap style={{ color: '#fff' }} size={26} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h2 style={{
                        fontFamily: FB,
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        color: '#0F0A14',
                        marginBottom: '0.25rem',
                      }}>
                        {tool.name}
                      </h2>
                      <span style={{
                        fontFamily: FB,
                        fontSize: '0.75rem',
                        color: '#E8609A',
                        background: 'rgba(253,147,195,0.1)',
                        padding: '0.25rem 0.625rem',
                        borderRadius: 99,
                        fontWeight: 600,
                      }}>
                        {TOOL_CATEGORY_LABELS[tool.category] || tool.category}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontFamily: FB,
                    fontSize: '0.875rem',
                    color: 'rgba(15,10,20,0.55)',
                    lineHeight: 1.7,
                    marginBottom: '1.25rem',
                  }}>
                    {tool.description}
                  </p>

                  {/* Link Button */}
                  {tool.link && (
                    <a
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: FB,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#E8609A',
                        border: '1px solid rgba(253,147,195,0.25)',
                        padding: '0.625rem 1rem',
                        borderRadius: 12,
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#FD93C3'
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.borderColor = '#FD93C3'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#E8609A'
                        e.currentTarget.style.borderColor = 'rgba(253,147,195,0.25)'
                      }}>
                      <ExternalLink size={13} /> {t('visitTool')}
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
