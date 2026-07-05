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

/* ─── Brand SVG icons map ─── */
function ToolIcon({ name, category }: { name: string; category: string }) {
  const n = name.toLowerCase()

  /* HubSpot */
  if (n.includes('hubspot')) return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
      <path d="M18.164 7.931V5.424a2.19 2.19 0 0 0 1.263-1.97v-.065A2.19 2.19 0 0 0 17.238 1.2h-.065a2.19 2.19 0 0 0-2.19 2.19v.065a2.19 2.19 0 0 0 1.264 1.97v2.507a6.22 6.22 0 0 0-2.965 1.302L5.79 3.676a2.43 2.43 0 1 0-1.066 1.46l7.36 5.28a6.21 6.21 0 0 0-.96 3.32 6.22 6.22 0 0 0 .96 3.319l-2.247 2.247a1.876 1.876 0 1 0 1.06 1.06l2.247-2.247a6.23 6.23 0 0 0 9.28-8.184z" fill="#FF7A59"/>
    </svg>
  )

  /* LinkedIn */
  if (n.includes('linkedin')) return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )

  /* Notion */
  if (n.includes('notion')) return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#000000">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
    </svg>
  )

  /* Salesforce */
  if (n.includes('salesforce')) return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#00A1E0">
      <path d="M10.07 4.87a4.43 4.43 0 0 1 3.09-1.25 4.45 4.45 0 0 1 3.97 2.44 3.7 3.7 0 0 1 1.58-.36 3.73 3.73 0 0 1 3.73 3.73 3.73 3.73 0 0 1-3.73 3.73H5.93A3.93 3.93 0 0 1 2 9.23a3.93 3.93 0 0 1 3.93-3.93 3.92 3.92 0 0 1 1.2.19 4.42 4.42 0 0 1 2.94-.62z"/>
    </svg>
  )

  /* Zoom */
  if (n.includes('zoom')) return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#2D8CFF">
      <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-6-3.5l-4 2.5V8.5A1.5 1.5 0 0 0 12.5 7h-7A1.5 1.5 0 0 0 4 8.5v7A1.5 1.5 0 0 0 5.5 17h7a1.5 1.5 0 0 0 1.5-1.5v-2.5l4 2.5v-7z"/>
    </svg>
  )

  /* Google Meet / Google */
  if (n.includes('google')) return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )

  /* Slack */
  if (n.includes('slack')) return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" fill="#E01E5A"/>
      <path d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" fill="#36C5F0"/>
      <path d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z" fill="#2EB67D"/>
      <path d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/>
      <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z" fill="#ECB22E"/>
      <path d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/>
    </svg>
  )

  /* Trello */
  if (n.includes('trello')) return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#0052CC">
      <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.657 1.343 3 3 3h18c1.657 0 3-1.343 3-3V3c0-1.657-1.343-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.645-1.44-1.44V5.82c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v12.36zm10.44-6c0 .795-.645 1.44-1.44 1.44H15c-.795 0-1.44-.645-1.44-1.44V5.82c0-.795.645-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v6.36z"/>
    </svg>
  )

  /* Pipedrive */
  if (n.includes('pipedrive')) return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#272D37">
      <circle cx="12" cy="12" r="12" fill="#1A1A2E"/>
      <text x="12" y="16" textAnchor="middle" fill="#26C281" fontWeight="bold" fontSize="11">PD</text>
    </svg>
  )

  /* Mailchimp */
  if (n.includes('mailchimp') || n.includes('mail')) return (
    <Mail size={24} color="#FFE01B" />
  )

  /* Asana */
  if (n.includes('asana')) return (
    <svg viewBox="0 0 24 24" width="26" height="26">
      <circle cx="12" cy="5.14" r="4.5" fill="#F06A6A"/>
      <circle cx="4.5" cy="15.86" r="4.5" fill="#F06A6A"/>
      <circle cx="19.5" cy="15.86" r="4.5" fill="#F06A6A"/>
    </svg>
  )

  /* Monday */
  if (n.includes('monday')) return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
      <circle cx="5" cy="12" r="3.5" fill="#FF3D57"/>
      <circle cx="12" cy="12" r="3.5" fill="#FFCB00"/>
      <circle cx="19" cy="12" r="3.5" fill="#00CA72"/>
    </svg>
  )

  /* Canva */
  if (n.includes('canva')) return (
    <svg viewBox="0 0 24 24" width="26" height="26">
      <circle cx="12" cy="12" r="12" fill="#7D2AE7"/>
      <text x="12" y="16" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="9">Ca</text>
    </svg>
  )

  /* WhatsApp */
  if (n.includes('whatsapp')) return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  )

  /* Category fallbacks */
  const categoryIcons: Record<string, React.ReactNode> = {
    crm:           <BarChart2 size={24} color="#FF7A59" />,
    prospecting:   <Users size={24} color="#0A66C2" />,
    productivity:  <Settings size={24} color="#7C3AED" />,
    communication: <MessageSquare size={24} color="#25D366" />,
    analytics:     <TrendingUp size={24} color="#F59E0B" />,
    social:        <Globe size={24} color="#E8609A" />,
    sales:         <Target size={24} color="#EF4444" />,
    other:         <Zap size={24} color="#FD93C3" />,
  }

  return categoryIcons[category] || <Zap size={24} color="#FD93C3" />
}

/* ─── Category background colors ─── */
const categoryBg: Record<string, { bg: string; border: string }> = {
  crm:           { bg: 'rgba(255,122,89,0.12)',  border: 'rgba(255,122,89,0.25)' },
  prospecting:   { bg: 'rgba(10,102,194,0.12)', border: 'rgba(10,102,194,0.25)' },
  productivity:  { bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.25)' },
  communication: { bg: 'rgba(37,211,102,0.12)', border: 'rgba(37,211,102,0.25)' },
  analytics:     { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  social:        { bg: 'rgba(232,96,154,0.12)',  border: 'rgba(232,96,154,0.25)' },
  sales:         { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)' },
  other:         { bg: 'rgba(253,147,195,0.12)', border: 'rgba(253,147,195,0.25)' },
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
