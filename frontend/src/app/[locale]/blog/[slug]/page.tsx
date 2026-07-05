'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Clock, ArrowRight, ArrowLeft, Calendar, Tag, BookOpen, Share2, ChevronUp } from 'lucide-react'
import type { BlogPost } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

const FD = 'Boldonse, cursive'
const FH = "'Edu QLD Beginner', cursive"
const FB = "'Bricolage Grotesque', sans-serif"
const ROSE      = '#FD93C3'
const ROSE_DK   = '#E8609A'
const ROSE_GRAD = 'linear-gradient(135deg,#FD93C3,#E8609A)'
const DARK      = '#0F0A14'
const DARK2     = '#1A1025'
const PURPLE    = '#2A1040'

export default function BlogPostPage() {
  const params    = useParams()
  const slug      = params?.slug as string
  const { locale, dir } = useLanguage()

  const [post, setPost]           = useState<BlogPost | null>(null)
  const [loading, setLoading]     = useState(true)
  const [readProgress, setReadProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [copied, setCopied]       = useState(false)
  const articleRef = useRef<HTMLElement>(null)
  const heroRef    = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroScale   = useTransform(scrollY, [0, 400], [1, 1.08])
  const heroY       = useTransform(scrollY, [0, 400], [0, 80])

  useEffect(() => {
    if (!slug) return
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    fetch(`${api}/blog/${slug}`)
      .then(r => r.json())
      .then(d => setPost(d.post ?? null))
      .catch(() => setPost(null))
      .finally(() => setLoading(false))
  }, [slug])

  // Reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current
      if (!el) return
      const { top, height } = el.getBoundingClientRect()
      const scrolled = Math.max(0, -top)
      const total    = height - window.innerHeight
      setReadProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0)
      setShowScrollTop(window.scrollY > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  /* ── Loading ── */
  if (loading) return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          style={{ width: 56, height: 56, borderRadius: '50%', background: ROSE_GRAD }}
        />
      </div>
    </>
  )

  /* ── Not found ── */
  if (!post) return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: `linear-gradient(160deg,${DARK},${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontFamily: FD, fontSize: 'clamp(3rem,10vw,7rem)', background: ROSE_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>404</div>
        <p style={{ fontFamily: FB, color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>المقال غير موجود</p>
        <Link href={`/${locale}/blog`} style={{ fontFamily: FB, color: ROSE, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontWeight: 600 }}>
          <ArrowRight size={16} /> العودة للمدونة
        </Link>
      </div>
    </>
  )

  const formattedDate = new Date(post.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  /* ── Render content as formatted paragraphs ── */
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, i) => {
      // Heading (ends with \n or starts with keyword)
      if (block.trim().endsWith(':') || (block.length < 80 && !block.includes('.'))) {
        return (
          <h2 key={i} style={{
            fontFamily: FH, fontSize: 'clamp(1.2rem,3vw,1.5rem)',
            color: DARK, marginTop: '2.5rem', marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: `2px solid rgba(253,147,195,0.2)`,
            fontWeight: 700,
          }}>
            {block.trim()}
          </h2>
        )
      }
      // List items
      if (block.includes('\n-') || block.startsWith('-')) {
        const items = block.split('\n').filter(l => l.trim())
        return (
          <ul key={i} style={{ listStyle: 'none', margin: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map((item, j) => (
              <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontFamily: FB, fontSize: '1rem', color: 'rgba(15,10,20,0.75)', lineHeight: 1.8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: ROSE_GRAD, flexShrink: 0, marginTop: 8 }} />
                {item.replace(/^-\s*/, '')}
              </li>
            ))}
          </ul>
        )
      }
      // Numbered list
      if (/^\d+\./.test(block.trim())) {
        const items = block.split('\n').filter(l => l.trim())
        return (
          <ol key={i} style={{ listStyle: 'none', margin: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map((item, j) => {
              const num = j + 1
              return (
                <li key={j} style={{ display: 'flex', gap: '14px', fontFamily: FB, fontSize: '1rem', color: 'rgba(15,10,20,0.75)', lineHeight: 1.8, alignItems: 'flex-start' }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: ROSE_GRAD, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                    {num}
                  </span>
                  {item.replace(/^\d+\.\s*/, '')}
                </li>
              )
            })}
          </ol>
        )
      }
      // Regular paragraph
      return (
        <p key={i} style={{
          fontFamily: FB, fontSize: 'clamp(0.95rem,1.8vw,1.0625rem)',
          color: 'rgba(15,10,20,0.72)', lineHeight: 1.95,
          marginBottom: '1.25rem',
        }}>
          {block.trim()}
        </p>
      )
    })
  }

  return (
    <>
      {/* ── Reading progress bar ── */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 200,
          height: 3, background: ROSE_GRAD,
          width: `${readProgress}%`,
          transformOrigin: 'left',
          boxShadow: '0 0 12px rgba(253,147,195,0.6)',
        }}
      />

      <Navbar />

      <main dir={dir} style={{ background: '#FBF9F7', minHeight: '100vh', paddingBottom: '4rem' }}>

        {/* ══════════════════════════════════
            HERO — full-bleed cinematic
        ══════════════════════════════════ */}
        <div ref={heroRef} style={{ position: 'relative', height: 'clamp(480px, 60vh, 680px)', overflow: 'hidden' }}>

          {/* Background image with parallax */}
          <motion.div
            style={{ position: 'absolute', inset: 0, scale: heroScale, y: heroY }}
          >
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg,${DARK} 0%,${PURPLE} 50%,#3D1060 100%)` }} />
            )}
          </motion.div>

          {/* Gradient overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,10,20,0.2) 0%, rgba(15,10,20,0.6) 60%, rgba(15,10,20,0.95) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(232,96,154,0.15) 0%, transparent 70%)' }} />

          {/* Hero content */}
          <motion.div
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(2rem, 5vw, 3rem)', opacity: heroOpacity }}
          >
            <div style={{ maxWidth: 780, margin: '0 auto' }}>

              {/* Back link */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Link href={`/${locale}/blog`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontFamily: FB, fontSize: '0.8rem', fontWeight: 500, marginBottom: '1.25rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = ROSE)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                  {dir === 'rtl' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  {locale === 'ar' ? 'المدونة' : 'Blog'}
                </Link>
              </motion.div>

              {/* Tags */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1rem' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: FB, fontSize: '0.72rem', fontWeight: 700,
                    padding: '4px 12px', borderRadius: 99,
                    background: 'rgba(253,147,195,0.18)',
                    border: '1px solid rgba(253,147,195,0.35)',
                    color: ROSE, letterSpacing: '0.04em',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <Tag size={10} />#{tag}
                  </span>
                ))}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{
                  fontFamily: FD,
                  fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
                  color: '#fff', lineHeight: 1.15,
                  marginBottom: '1.25rem',
                  textShadow: '0 2px 20px rgba(0,0,0,0.4)',
                }}>
                {post.title}
              </motion.h1>

              {/* Meta row */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: FB, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  <Clock size={13} />{post.readTime} {locale === 'ar' ? 'دقائق قراءة' : 'min read'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: FB, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  <Calendar size={13} />{formattedDate}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: FB, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  <BookOpen size={13} />{locale === 'ar' ? 'لبنى' : 'Lobna'}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ══════════════════════════════════
            CONTENT AREA
        ══════════════════════════════════ */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(1rem, 5vw, 2rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', paddingTop: '3rem' }}>

            {/* ── Article card ── */}
            <article ref={articleRef}
              style={{
                background: '#fff',
                borderRadius: 28,
                padding: 'clamp(1.5rem, 5vw, 3rem)',
                boxShadow: '0 4px 40px rgba(15,10,20,0.07), 0 1px 0 rgba(255,255,255,0.8) inset',
                border: '1px solid rgba(253,147,195,0.1)',
              }}>

              {/* Excerpt highlight */}
              {post.excerpt && (
                <div style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg,rgba(253,147,195,0.06),rgba(232,96,154,0.04))',
                  border: `1.5px solid rgba(253,147,195,0.2)`,
                  marginBottom: '2rem',
                  borderRight: dir === 'rtl' ? `4px solid ${ROSE_DK}` : undefined,
                  borderLeft: dir === 'ltr' ? `4px solid ${ROSE_DK}` : undefined,
                }}>
                  <p style={{ fontFamily: FH, fontSize: 'clamp(1rem,2vw,1.15rem)', color: ROSE_DK, lineHeight: 1.75, margin: 0, fontStyle: 'italic', fontWeight: 600 }}>
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* Content */}
              <div style={{ lineHeight: 1.9 }}>
                {renderContent(post.content)}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(253,147,195,0.3), transparent)', margin: '2.5rem 0' }} />

              {/* Tags footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: FB, fontSize: '0.78rem', fontWeight: 600,
                      padding: '5px 14px', borderRadius: 99,
                      background: 'rgba(253,147,195,0.08)',
                      border: '1px solid rgba(253,147,195,0.2)',
                      color: ROSE_DK,
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
                {/* Share */}
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontFamily: FB, fontSize: '0.82rem', fontWeight: 600,
                    padding: '8px 18px', borderRadius: 99,
                    background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(253,147,195,0.08)',
                    border: copied ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(253,147,195,0.2)',
                    color: copied ? '#16a34a' : ROSE_DK,
                    cursor: 'pointer', transition: 'all 0.25s',
                  }}>
                  <Share2 size={14} />
                  {copied ? (locale === 'ar' ? 'تم النسخ!' : 'Copied!') : (locale === 'ar' ? 'مشاركة' : 'Share')}
                </motion.button>
              </div>
            </article>

            {/* ══════════════════════════════════
                CTA CARD
            ══════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{
                borderRadius: 28, overflow: 'hidden', position: 'relative',
                background: `linear-gradient(160deg,${DARK} 0%,${PURPLE} 50%,#3D1060 100%)`,
                padding: 'clamp(2rem,5vw,3.5rem)',
              }}>

              {/* Decorative blobs */}
              <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(253,147,195,0.08)', filter: 'blur(40px)' }} />
              <div style={{ position: 'absolute', bottom: -40, left: 0, width: 180, height: 180, borderRadius: '50%', background: 'rgba(142,181,210,0.06)', filter: 'blur(30px)' }} />

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem' }}>
                <motion.div
                  animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }}
                  style={{ fontSize: '3rem' }}>
                  ✨
                </motion.div>
                <h2 style={{ fontFamily: FD, fontSize: 'clamp(1.6rem,4vw,2.4rem)', color: '#fff', lineHeight: 1.2 }}>
                  {locale === 'ar' ? 'جاهزة للخطوة القادمة؟' : 'Ready for Next Step?'}
                </h2>
                <p style={{ fontFamily: FB, color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.9rem,2vw,1.05rem)', maxWidth: 480, lineHeight: 1.75 }}>
                  {locale === 'ar'
                    ? 'احجزي جلسة استشارية خاصة معي وسنضع معاً خطة واضحة لمسيرتك المهنية.'
                    : 'Book a private consultation with me and we\'ll build a clear roadmap for your career.'}
                </p>
                <Link href={`/${locale}#booking`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontFamily: FB, fontWeight: 700, fontSize: '0.95rem',
                    padding: '0.875rem 2.25rem', borderRadius: 99,
                    background: ROSE_GRAD, color: '#fff', textDecoration: 'none',
                    boxShadow: '0 8px 28px rgba(232,96,154,0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'scale(1.04)'; el.style.boxShadow = '0 12px 36px rgba(232,96,154,0.55)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'scale(1)'; el.style.boxShadow = '0 8px 28px rgba(232,96,154,0.4)' }}>
                  {locale === 'ar' ? 'احجزي استشارتك الآن ✨' : 'Book Your Consultation ✨'}
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />

      {/* ── Scroll to top ── */}
      <AnimatePresenceWrapper show={showScrollTop}>
        <motion.button
          onClick={scrollTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'fixed', bottom: 90, right: 20, zIndex: 150,
            width: 44, height: 44, borderRadius: '50%',
            background: ROSE_GRAD, color: '#fff', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(232,96,154,0.4)',
          }}>
          <ChevronUp size={20} />
        </motion.button>
      </AnimatePresenceWrapper>
    </>
  )
}

/* tiny wrapper to avoid importing AnimatePresence at top level */
function AnimatePresenceWrapper({ show, children }: { show: boolean; children: React.ReactNode }) {
  const { AnimatePresence } = require('framer-motion')
  return <AnimatePresence>{show && children}</AnimatePresence>
}
