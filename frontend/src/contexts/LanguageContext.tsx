'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'
import { translations } from '@/lib/i18n'
import { usePathname, useRouter } from 'next/navigation'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  dir: 'rtl' | 'ltr'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    if (!mounted) return
    
    setLocaleState(newLocale)
    
    const segments = pathname?.split('/').filter(Boolean) || []
    if (segments[0] === 'en' || segments[0] === 'ar') {
      segments[0] = newLocale
    } else {
      segments.unshift(newLocale)
    }
    
    const newPath = '/' + segments.join('/')
    router.push(newPath)
  }

  const t = (key: string) => {
    const typedKey = key as keyof typeof translations['ar']
    const translation = locale === 'ar' 
      ? translations['ar']?.[typedKey] 
      : translations['en']?.[typedKey]
    return translation || typedKey
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
