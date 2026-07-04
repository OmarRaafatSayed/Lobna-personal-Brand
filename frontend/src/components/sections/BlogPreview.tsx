'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Clock, ArrowLeft, BookOpen } from 'lucide-react'
import api from '@/lib/api'
import type { BlogPost } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

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

export default function BlogPreview() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { t, dir, locale } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    api.get<{ posts: BlogPost[] }>('/blog')
      .then(r => setPosts(r.posts.slice(0, 3)))
      .catch(() => {})
  }, [])

  if (!posts.length) return null

  return (
    <section ref={ref} style={{ background: '#FBF9F7', padding: 'clamp(5rem, 10vw, 8rem) 0', direction: dir }}>
      <div className="wrap">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 99,
            background: 'rgba(253,147,195,0.1)', border: '1px solid rgba(253,147,195,0.22)',
            color: '#E8609A', fontFamily: FB, fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            ✦ {t('blogTitle')}
          </span>
          {/* H1 — Boldonse */}
          <h1 style={{ fontFamily: FD, fontSize: 'clamp(2.4rem, 6vw, 4rem)', color: '#0F0A14', marginTop: '1rem', marginBottom: 0 }}>
            {t('blogHeading')} <span style={gradText}>{t('blogSubheading')}</span>
          </h1>
          {/* Paragraph — Bricolage Grotesque */}
          <p style={{ fontFamily: FB, color: 'rgba(15,10,20,0.5)', marginTop: 12 }}>
            {t('blogDesc')}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="cards-grid-3">
          {posts.map((post, i) => (
            <motion.article
              key={post._id || `post-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="lift"
              style={{
                borderRadius: 20, overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                background: '#fff',
                boxShadow: '0 4px 24px rgba(15,10,20,0.06)',
                border: '1px solid rgba(15,10,20,0.05)',
              }}
            >
              <div style={{ height: 192, overflow: 'hidden', flexShrink: 0 }}>
                {post.coverImage
                  ? <img src={post.coverImage} alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFE8F3, rgba(253,147,195,0.18))' }}>
                      <BookOpen size={48} style={{ color: 'rgba(253,147,195,0.4)' }} />
                    </div>
                }
              </div>

              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} style={{ fontFamily: FB, fontSize: '0.72rem', padding: '3px 10px', borderRadius: 99, fontWeight: 600, background: 'rgba(253,147,195,0.08)', color: '#E8609A' }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* H2 — Edu QLD Beginner */}
                <h2 style={{
                  fontFamily: FH, fontWeight: 700, fontSize: '1.1rem', color: '#0F0A14',
                  lineHeight: 1.4, marginBottom: 8,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {post.title}
                </h2>

                {/* Paragraph — Bricolage Grotesque */}
                <p style={{
                  fontFamily: FB, fontSize: '0.875rem', color: 'rgba(15,10,20,0.5)',
                  lineHeight: 1.7, marginBottom: 20, flex: 1,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {post.excerpt}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: FB, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'rgba(15,10,20,0.35)' }}>
                    <Clock size={12} />{post.readTime} {t('minRead')}
                  </span>
                  <Link href={`/${locale}/blog/${post.slug}`}
                    style={{ fontFamily: FB, fontSize: '0.875rem', fontWeight: 700, color: '#FD93C3', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#E8609A')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#FD93C3')}
                  >
                    {t('readMore')}
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.35 }}
          style={{ textAlign: 'center', marginTop: 40 }}
        >
          <Link href={`/blog`} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {t('viewAllArticles')} <ArrowLeft size={17} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
