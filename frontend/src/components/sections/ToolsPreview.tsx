'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink, ArrowLeft } from 'lucide-react'
import api from '@/lib/api'
import type { Tool } from '@/lib/types'
import { TOOL_CATEGORY_LABELS_AR, TOOL_CATEGORY_LABELS_EN } from '@/lib/constants'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolIcon, { categoryBg } from './ToolIcon'

/* ─── Typography ─── */
const FD = 'Boldonse, cursive'
const FH = "'Edu QLD Beginner', cursive"
const FB = "'Bricolage Grotesque', sans-serif"

const gradText: React.CSSProperties = {
  background: 'linear-gradient(135deg,#FD93C3,#E8609A)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

export default function ToolsPreview() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { t, dir } = useLanguage()
  const TOOL_CATEGORY_LABELS = dir === 'rtl' ? TOOL_CATEGORY_LABELS_AR : TOOL_CATEGORY_LABELS_EN
  const [tools, setTools] = useState<Tool[]>([])

  useEffect(() => {
    api.get<{ tools: Tool[] }>('/tools')
      .then(r => setTools(r.tools.slice(0, 6)))
      .catch(() => {})
  }, [])

  if (!tools.length) return null

  return (
    <section ref={ref} style={{
      background: 'linear-gradient(135deg, #0F0A14 0%, #2A1040 100%)',
      padding: 'clamp(5rem, 10vw, 8rem) 0',
      position: 'relative', overflow: 'hidden', direction: dir,
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 80% 50%, rgba(253,147,195,0.07) 0%, transparent 60%)',
      }} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 99,
            background: 'rgba(253,147,195,0.1)', border: '1px solid rgba(253,147,195,0.25)',
            color: '#FD93C3', fontFamily: FB, fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            ✦ {t('toolsTitle')}
          </span>
          {/* H1 — Boldonse */}
          <h1 style={{ fontFamily: FD, fontSize: 'clamp(2.4rem, 6vw, 4rem)', color: '#fff', marginTop: '1rem', marginBottom: 0 }}>
            {t('toolsHeading')} <span style={gradText}>{t('toolsSubheading')}</span>
          </h1>
          {/* Paragraph — Bricolage Grotesque */}
          <p style={{ fontFamily: FB, color: 'rgba(255,255,255,0.42)', marginTop: 12 }}>
            {t('toolsDesc')}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="cards-grid-3">
          {tools.map((tool, i) => (
            <motion.div
              key={tool._id || `tool-${i}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="lift"
              style={{
                borderRadius: 20, padding: 24,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  background: categoryBg[tool.category]?.bg || 'rgba(253,147,195,0.1)',
                  border: `1px solid ${categoryBg[tool.category]?.border || 'rgba(253,147,195,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ToolIcon name={tool.name} category={tool.category} />
                </div>
                <div>
                  {/* H2 — Edu QLD Beginner */}
                  <h2 style={{ fontFamily: FH, fontWeight: 700, color: '#fff', fontSize: '1rem', margin: 0 }}>
                    {tool.name}
                  </h2>
                  <span style={{
                    fontFamily: FB, display: 'inline-block', marginTop: 4,
                    fontSize: '0.72rem', padding: '2px 10px', borderRadius: 99,
                    background: 'rgba(253,147,195,0.1)', color: '#FD93C3',
                  }}>
                    {TOOL_CATEGORY_LABELS[tool.category] || tool.category}
                  </span>
                </div>
              </div>

              {/* Paragraph — Bricolage Grotesque */}
              <p style={{ fontFamily: FB, fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 16 }}>
                {tool.description}
              </p>

              {tool.link && (
                <a href={tool.link} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontFamily: FB, color: '#FD93C3', fontSize: '0.875rem', fontWeight: 600,
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E8609A')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#FD93C3')}
                >
                  <ExternalLink size={13} /> {t('visitTool')}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: 40 }}
        >
          <Link href="/tools" className="btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.65)' }}>
            {t('viewAllTools')} <ArrowLeft size={17} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
