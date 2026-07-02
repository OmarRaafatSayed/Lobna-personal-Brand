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

export default function BlogPage() {
  const { t, locale } = useLanguage()
  const [posts,   setPosts]   = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ posts: BlogPost[] }>('/blog')
      .then(r => setPosts(r.posts))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div style={{ background: 'linear-gradient(135deg,#0F0A14 0%,#2A1040 100%)' }} className="pt-32 pb-16 relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-rose/10 blur-[100px] rounded-full" />
          <div className="wrap relative z-10 text-center">
            <span className="pill bg-rose/10 border border-rose/25 text-rose mb-4">✦ {t('blogTitle')}</span>
            <h1 className="font-display text-6xl md:text-7xl text-white mt-3">
              {t('blogHeading')} <span className="text-grad">{t('blogSubheading')}</span>
            </h1>
            <p className="text-white/50 mt-3 max-w-lg mx-auto">{t('blogDesc')}</p>
          </div>
        </div>

        <div className="wrap py-12 pb-24">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-80 rounded-2xl shimmer" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <BookOpen className="text-dark/15 mx-auto mb-4" size={64} />
              <p className="text-dark/40 text-lg">
                {locale === 'ar' ? 'لا توجد مقالات بعد، تابعينا قريباً!' : 'No articles yet, stay tuned!'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.article key={post._id} initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                  className="bg-white rounded-2xl overflow-hidden shadow-card border border-dark/5 lift flex flex-col">
                  <div className="h-48 overflow-hidden">
                    {post.coverImage
                      ? <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full bg-gradient-to-br from-rose-light to-rose/20 flex items-center justify-center"><BookOpen className="text-rose/40" size={48} /></div>
                    }
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0,3).map(tag => (
                        <span key={tag} className="text-xs bg-rose/8 text-rose-dark px-2.5 py-0.5 rounded-full font-medium">#{tag}</span>
                      ))}
                    </div>
                    <h2 className="font-bold text-dark text-xl leading-snug mb-2 line-clamp-2">{post.title}</h2>
                    <p className="text-dark/50 text-sm line-clamp-3 mb-5 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-dark/35 text-xs">
                        <Clock size={12}/>{post.readTime} {t('minRead')}
                      </span>
                      <Link href={`/${locale}/blog/${post.slug}`} className="text-rose font-bold text-sm hover:text-rose-dark transition-colors">
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
