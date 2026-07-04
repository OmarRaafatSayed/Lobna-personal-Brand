'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, Sparkles } from 'lucide-react'
import api from '@/lib/api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [mounted, setMounted]   = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post<{ token: string }>('/auth/login', { email, password })
      localStorage.setItem('lobna_token', res.token)
      router.push('/admin')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'بيانات الدخول غير صحيحة')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'linear-gradient(160deg,#0F0A14 0%,#2A1040 55%,#3D1060 100%)',
        fontFamily: "'Bricolage Grotesque', sans-serif",
      }}
    >
      {/* Animated blobs */}
      <div style={{ position: 'fixed', top: '15%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(253,147,195,0.18) 0%,transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', bottom: '15%', left: '10%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(142,181,210,0.14) 0%,transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', animation: 'float 12s ease-in-out infinite reverse' }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(61,16,96,0.5) 0%,transparent 70%)', filter: 'blur(60px)', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        input:-webkit-autofill { -webkit-box-shadow:0 0 0 30px rgba(255,255,255,0.07) inset !important; -webkit-text-fill-color:#fff !important; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '460px' }}
      >
        {/* Glow ring behind card */}
        <div style={{ position: 'absolute', inset: '-1px', borderRadius: '30px', background: 'linear-gradient(135deg,rgba(253,147,195,0.3),rgba(142,181,210,0.15),rgba(253,147,195,0.3))', padding: '1px', backgroundSize: '200% 200%', animation: 'shimmer 4s linear infinite' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '29px', background: 'rgba(15,10,20,0.95)' }} />
        </div>

        {/* Card */}
        <div style={{ position: 'relative', borderRadius: '28px', padding: '2.75rem 2.5rem', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(253,147,195,0.18)', boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '22px', background: 'linear-gradient(135deg,#FD93C3,#E8609A)', boxShadow: '0 16px 40px rgba(253,147,195,0.4)', marginBottom: '1.25rem' }}
            >
              <Sparkles size={32} color="#fff" />
            </motion.div>
            <h1 style={{ fontFamily: "'Edu QLD Beginner', cursive", fontSize: '2.5rem', lineHeight: 1, background: 'linear-gradient(135deg,#FD93C3 0%,#fff 50%,#FD93C3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.5rem' }}>
              لبنى
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', letterSpacing: '0.05em' }}>
              لوحة التحكم الإدارية
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,rgba(253,147,195,0.3),transparent)', marginBottom: '2rem' }} />

          {/* Form */}
          <form onSubmit={handleLogin} dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>

            {/* Email field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(253,147,195,0.8)', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                البريد الإلكتروني
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: focusedField === 'email' ? '#FD93C3' : 'rgba(255,255,255,0.3)', transition: 'color 0.2s', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="admin@lobna.com"
                  style={{
                    width: '100%',
                    padding: '0.875rem 2.75rem 0.875rem 1rem',
                    borderRadius: '14px',
                    border: focusedField === 'email' ? '1.5px solid rgba(253,147,195,0.7)' : '1.5px solid rgba(255,255,255,0.08)',
                    background: focusedField === 'email' ? 'rgba(253,147,195,0.06)' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    outline: 'none',
                    transition: 'all 0.25s',
                    boxShadow: focusedField === 'email' ? '0 0 0 4px rgba(253,147,195,0.1)' : 'none',
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(253,147,195,0.8)', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                كلمة المرور
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: focusedField === 'password' ? '#FD93C3' : 'rgba(255,255,255,0.3)', transition: 'color 0.2s', pointerEvents: 'none' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '0.875rem 2.75rem 0.875rem 2.75rem',
                    borderRadius: '14px',
                    border: focusedField === 'password' ? '1.5px solid rgba(253,147,195,0.7)' : '1.5px solid rgba(255,255,255,0.08)',
                    background: focusedField === 'password' ? 'rgba(253,147,195,0.06)' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    outline: 'none',
                    transition: 'all 0.25s',
                    boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(253,147,195,0.1)' : 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FD93C3')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', flexShrink: 0, display: 'inline-block' }} />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '14px',
                background: loading ? 'rgba(253,147,195,0.4)' : 'linear-gradient(135deg,#FD93C3 0%,#E8609A 100%)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 700,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 32px rgba(253,147,195,0.45)',
                transition: 'background 0.3s, box-shadow 0.3s',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  جاري الدخول...
                </>
              ) : 'تسجيل الدخول →'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
