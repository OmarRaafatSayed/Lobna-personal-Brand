import type { Metadata } from 'next'
import { LanguageProvider } from '@/contexts/LanguageContext'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Lobna | Sales Expert & Professional Development Coach',
  description: 'Supporting with Love – Building trust bridges with the sales community. Book your consultation now.',
  keywords: ['sales', 'professional development', 'consulting', 'lobna'],
  openGraph: {
    title: 'Lobna | Sales Expert',
    description: 'Supporting with Love – Building trust bridges with the sales community',
    type: 'website',
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const safeLocale = (locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar'
  const dir = safeLocale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={safeLocale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Boldonse&family=Edu+QLD+Beginner:wght@400;500;700&family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider initialLocale={safeLocale}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }]
}
