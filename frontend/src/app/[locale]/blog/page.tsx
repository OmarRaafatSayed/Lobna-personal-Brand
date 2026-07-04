'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Clock, BookOpen } from 'lucide-react'
import api from '@/lib/api'
import type { BlogPost } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

/* ─── Typography ─── */
const FD = 'Boldonse, cursive'
const FH = "'Edu QLD Beginner', cursive"
const FB = "'Bricolage Grotesque', sans-serif"

export default function BlogPage() {
  const { t, locale, dir } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ posts: BlogPost[] }>('/blog')
      .then(r => setPosts(r.posts))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

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
            position: 'absolute', top: 0, right: 0,
            width: 400, height: 400, borderRadius: '50%',
            background: 'rgba(253,147,195,0.08)', filter: 'blur(120px)',
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
              ✦ {t('blogTitle')}
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
              {t('blogHeading')}{' '}
              <span style={{
                background: 'linear-gradient(135deg,#FD93C3,#E8609A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {t('blogSubheading')}
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
              {t('blogDesc')}
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="wrap" style={{
          padding: 'clamp(3rem, 6vw, 5rem) 1.5rem clamp(5rem, 8vw, 7rem)',
        }}>
          {loading ? (
            <div className="cards-grid-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="shimmer" style={{ height: 420, borderRadius: '1.5rem' }} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <BookOpen style={{ color: 'rgba(15,10,20,0.15)', margin: '0 auto 1rem' }} size={64} />
              <p style={{ fontFamily: FB, color: 'rgba(15,10,20,0.4)', fontSize: '1.1rem' }}>
                {locale === 'ar' ? 'لا توجد مقالات بعد، تابعينا قريباً!' : 'No articles yet, stay tuned!'}
              </p>
            </div>
          ) : (
            <div className="cards-grid-3">
              {posts.map((post, i) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="lift"
                  style={{
                    background: '#fff',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(15,10,20,0.06)',
                    border: '1px solid rgba(15,10,20,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                  {/* Cover Image */}
                  <div style={{ height: 200, overflow: 'hidden' }}>
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s',
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #FFE8F3 0%, rgba(253,147,195,0.2) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <BookOpen style={{ color: 'rgba(253,147,195,0.4)' }} size={48} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                        {post.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            style={{
                              fontFamily: FB,
                              fontSize: '0.75rem',
                              background: 'rgba(253,147,195,0.1)',
                              color: '#E8609A',
                              padding: '0.25rem 0.625rem',
                              borderRadius: 99,
                              fontWeight: 600,
                            }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 style={{
                      fontFamily: FB,
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      color: '#0F0A14',
                      lineHeight: 1.3,
                      marginBottom: '0.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p style={{
                      fontFamily: FB,
                      fontSize: '0.875rem',
                      color: 'rgba(15,10,20,0.5)',
                      lineHeight: 1.7,
                      marginBottom: '1.25rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1,
                    }}>
                      {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontFamily: FB,
                        fontSize: '0.75rem',
                        color: 'rgba(15,10,20,0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                      }}>
                        <Clock size={12} />
                        {post.readTime} {t('minRead')}
                      </span>
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        style={{
                          fontFamily: FB,
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: '#E8609A',
                          textDecoration: 'none',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#FD93C3'}
                        onMouseLeave={e => e.currentTarget.style.color = '#E8609A'}>
                        {t('readMore')}
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
