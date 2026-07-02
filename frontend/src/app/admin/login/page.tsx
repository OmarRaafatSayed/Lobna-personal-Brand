'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import api from '@/lib/api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mounted) return
    
    setLoading(true)
    setError('')
    try {
      const res = await api.post<{ token: string }>('/auth/login', { email, password })
      localStorage.setItem('lobna_token', res.token)
      router.push('/admin')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'خطأ في تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="fixed top-20 right-10 w-72 h-72 bg-rose/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-72 h-72 bg-blue-brand/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-10 w-full max-w-md shadow-glass relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl text-gradient mb-2">لبنى</h1>
          <p className="text-gray-600 text-sm">لوحة التحكم الإدارية</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pr-12 pl-4 py-3.5 rounded-xl border-2 border-rose/30 focus:border-rose focus:outline-none bg-white/80 text-gray-800"
            />
          </div>

          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pr-12 pl-12 py-3.5 rounded-xl border-2 border-rose/30 focus:border-rose focus:outline-none bg-white/80 text-gray-800"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose transition-colors"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-rose text-white py-4 rounded-xl font-semibold text-lg shadow-rose hover:shadow-rose-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
