import type { Metadata } from 'next'
import '../globals.css'
import { AdminLanguageProvider } from '@/contexts/AdminLanguageContext'

export const metadata: Metadata = {
  title: 'Admin Panel | Lobna',
  description: 'Lobna Admin Dashboard',
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Boldonse&family=Edu+QLD+Beginner:wght@400;500;700&family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AdminLanguageProvider>
          {children}
        </AdminLanguageProvider>
      </body>
    </html>
  )
}
