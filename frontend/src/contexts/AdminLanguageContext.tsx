'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type AdminLocale = 'en' | 'ar'

interface AdminLangCtx {
  locale: AdminLocale
  toggle: () => void
  dir: 'ltr' | 'rtl'
  t: (en: string, ar: string) => string
}

const Ctx = createContext<AdminLangCtx | undefined>(undefined)

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  // Always start with 'en' on server to avoid hydration mismatch
  const [locale, setLocale] = useState<AdminLocale>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('admin_locale') as AdminLocale | null
    if (saved === 'en' || saved === 'ar') setLocale(saved)
  }, [])

  const toggle = () => {
    const next: AdminLocale = locale === 'en' ? 'ar' : 'en'
    setLocale(next)
    localStorage.setItem('admin_locale', next)
  }

  // Use 'en' until mounted to match server render
  const activeLocale: AdminLocale = mounted ? locale : 'en'
  const t = (en: string, ar: string) => (activeLocale === 'ar' ? ar : en)
  const dir = activeLocale === 'ar' ? 'rtl' : 'ltr'

  return <Ctx.Provider value={{ locale: activeLocale, toggle, dir, t }}>{children}</Ctx.Provider>
}

export function useAdminLang() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAdminLang must be used inside AdminLanguageProvider')
  return ctx
}
