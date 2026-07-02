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

export default function ToolsPage() {
  const { t, locale } = useLanguage()
  const TOOL_CATEGORY_LABELS = locale === 'ar' ? TOOL_CATEGORY_LABELS_AR : TOOL_CATEGORY_LABELS_EN
  const [tools,    setTools]    = useState<Tool[]>([])
  const [filtered, setFiltered] = useState<Tool[]>([])
  const [cat,      setCat]      = useState('all')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get<{ tools: Tool[] }>('/tools')
      .then(r => { setTools(r.tools); setFiltered(r.tools) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cats = ['all', ...Array.from(new Set(tools.map(tool => tool.category)))]

  useEffect(() => {
    setFiltered(cat === 'all' ? tools : tools.filter(tool => tool.category === cat))
  }, [cat, tools])

  const allLabel  = locale === 'ar' ? '✦ الكل' : '✦ All'
  const noTools   = locale === 'ar' ? 'لا توجد أدوات حالياً' : 'No tools available right now'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div style={{ background: 'linear-gradient(135deg,#0F0A14 0%,#2A1040 100%)' }} className="pt-32 pb-16 relative overflow-hidden">
          <div className="wrap relative z-10 text-center">
            <span className="pill bg-rose/10 border border-rose/25 text-rose mb-4">✦ {t('toolsTitle')}</span>
            <h1 className="font-display text-6xl md:text-7xl text-white mt-3">
              {t('toolsHeading')} <span className="text-grad">{t('toolsSubheading')}</span>
            </h1>
            <p className="text-white/50 mt-3 max-w-lg mx-auto">{t('toolsDesc')}</p>
          </div>
        </div>

        <div className="wrap py-12 pb-24">
          {/* Category filter */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="flex flex-wrap justify-center gap-3 mb-10">
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`pill border transition-all duration-200 ${
                  cat === c
                    ? 'bg-grad-rose text-white border-transparent shadow-rose'
                    : 'bg-white text-dark/60 border-dark/10 hover:border-rose/50 hover:text-rose shadow-card'
                }`}>
                {c === 'all' ? allLabel : TOOL_CATEGORY_LABELS[c] || c}
              </button>
            ))}
          </motion.div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-44 rounded-2xl shimmer" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Zap className="text-dark/15 mx-auto mb-4" size={64} />
              <p className="text-dark/40 text-lg">{noTools}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((tool, i) => (
                <motion.div key={tool._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                  className="bg-white rounded-2xl p-6 shadow-card border border-dark/5 lift">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-grad-rose flex items-center justify-center text-3xl shadow-rose shrink-0">
                      {tool.icon || <Zap className="text-white" size={26} />}
                    </div>
                    <div>
                      <h2 className="font-bold text-dark text-lg">{tool.name}</h2>
                      <span className="text-xs text-rose bg-rose/8 px-2 py-0.5 rounded-full font-medium">
                        {TOOL_CATEGORY_LABELS[tool.category] || tool.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-dark/55 text-sm mb-5 leading-relaxed">{tool.description}</p>
                  {tool.link && (
                    <a href={tool.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-rose text-sm font-bold border border-rose/25 px-4 py-2 rounded-xl hover:bg-rose hover:text-white hover:border-rose transition-all duration-200">
                      <ExternalLink size={13}/> {t('visitTool')}
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
