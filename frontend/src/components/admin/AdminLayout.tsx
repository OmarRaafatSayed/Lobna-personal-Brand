'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Briefcase, PenSquare, Wrench,
  User, Clock, LogOut, Menu, X, ChevronLeft
} from 'lucide-react'
import api from '@/lib/api'

const navItems = [
  { href: '/admin', icon: <LayoutDashboard size={20} />, label: 'لوحة التحكم' },
  { href: '/admin/bookings', icon: <Calendar size={20} />, label: 'الحجوزات' },
  { href: '/admin/jobs', icon: <Briefcase size={20} />, label: 'الوظائف' },
  { href: '/admin/blog', icon: <PenSquare size={20} />, label: 'المدونة' },
  { href: '/admin/tools', icon: <Wrench size={20} />, label: 'الأدوات' },
  { href: '/admin/profile', icon: <User size={20} />, label: 'الملف الشخصي' },
  { href: '/admin/working-hours', icon: <Clock size={20} />, label: 'ساعات العمل' },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('lobna_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    api.get('/auth/me')
      .then(() => setAuthChecked(true))
      .catch(() => {
        localStorage.removeItem('lobna_token')
        router.push('/admin/login')
      })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('lobna_token')
    router.push('/admin/login')
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">جاري التحقق...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        lg:static lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="font-heading text-2xl text-gradient">لبنى</h1>
          <p className="text-gray-400 text-xs mt-1">لوحة التحكم</p>
        </div>

        {/* Close btn (mobile) */}
        <button
          className="lg:hidden absolute top-4 left-4 text-gray-500 hover:text-rose"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>

        {/* Nav */}
        <nav className="p-4 flex-1">
          <ul className="space-y-1 list-none">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-gradient-rose text-white shadow-rose'
                      : 'text-gray-600 hover:bg-rose/10 hover:text-rose'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all w-full"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:mr-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between lg:justify-end">
          <button className="lg:hidden text-gray-600 hover:text-rose" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-gray-500 hover:text-rose transition-colors flex items-center gap-1">
              <ChevronLeft size={14} />
              عرض الموقع
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
