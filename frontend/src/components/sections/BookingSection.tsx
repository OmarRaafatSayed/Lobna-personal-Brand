'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { DAY_NAMES_AR, DAY_NAMES_EN } from '@/lib/constants'
import { useLanguage } from '@/contexts/LanguageContext'

/* ─── Typography ─── */
const FD = 'Boldonse, cursive'
const FH = "'Edu QLD Beginner', cursive"
const FB = "'Bricolage Grotesque', sans-serif"

interface Form {
  name: string; whatsapp: string; jobStatus: string
  message: string; date: string; time: string; platform: string
}
const EMPTY: Form = { name: '', whatsapp: '', jobStatus: '', message: '', date: '', time: '', platform: 'google_meet' }

const gradText: React.CSSProperties = {
  background: 'linear-gradient(135deg,#FD93C3,#E8609A)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

export default function BookingSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { t, dir, locale } = useLanguage()
  const DAY_NAMES = locale === 'ar' ? DAY_NAMES_AR : DAY_NAMES_EN

  const [step,    setStep]    = useState(1)
  const [form,    setForm]    = useState<Form>(EMPTY)
  const [errors,  setErrors]  = useState<Partial<Form>>({})
  const [slots,   setSlots]   = useState<string[]>([])
  const [slotsL,  setSlotsL]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [month,   setMonth]   = useState(new Date())

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const year  = month.getFullYear()
  const mo    = month.getMonth()
  const first = new Date(year, mo, 1).getDay()
  const days  = new Date(year, mo + 1, 0).getDate()

  const inputStyle: React.CSSProperties = {
    display: 'block', width: '100%',
    padding: '0.875rem 1rem', borderRadius: 14,
    border: '2px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.07)',
    fontFamily: FB, fontSize: '0.9375rem',
    color: '#fff', outline: 'none',
    transition: 'border-color 0.2s',
    direction: dir, boxSizing: 'border-box',
  }

  const fetchSlots = async (date: string) => {
    setSlotsL(true)
    try {
      const r = await api.get<{ slots: string[] }>(`/bookings/available-slots?date=${date}`)
      setSlots(r.slots)
    } catch { setSlots([]) }
    finally { setSlotsL(false) }
  }

  const pickDate = (d: number) => {
    const date = `${year}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    setForm(p => ({ ...p, date, time: '' }))
    fetchSlots(date)
  }

  const validate = () => {
    const e: Partial<Form> = {}
    if (!form.name.trim())     e.name      = t('required') || 'Required'
    if (!form.whatsapp.trim()) e.whatsapp  = t('required') || 'Required'
    if (!form.jobStatus)       e.jobStatus = t('required') || 'Required'
    if (!form.message.trim())  e.message   = t('required') || 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async () => {
    setLoading(true)
    try {
      await api.post('/bookings', form)
      setStep(3)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Error occurred')
    } finally { setLoading(false) }
  }

  const isPast = (d: number) => new Date(year, mo, d) < today

  const monthLabel = month.toLocaleDateString(
    locale === 'ar' ? 'ar-EG' : 'en-US',
    { month: 'long', year: 'numeric' }
  )

  const jobOptions = [
    { v: 'employed',       l: t('employed') },
    { v: 'unemployed',     l: t('unemployed') },
    { v: 'freelancer',     l: t('freelancer') },
    { v: 'business_owner', l: t('businessOwner') },
    { v: 'student',        l: t('student') },
    { v: 'other',          l: t('other') },
  ]

  return (
    <section id="booking" ref={ref} style={{
      position: 'relative',
      padding: 'clamp(4rem, 10vw, 8rem) 0',
      background: 'linear-gradient(135deg, #0F0A14 0%, #2A1040 100%)',
      overflow: 'hidden',
      direction: dir,
    }}>
      {/* Blobs */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, right: 0,
        width: 500, height: 500, borderRadius: '50%',
        background: 'rgba(253,147,195,0.08)', filter: 'blur(120px)',
        zIndex: 0, pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: 0, left: 0,
        width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(142,181,210,0.06)', filter: 'blur(100px)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 99,
            background: 'rgba(253,147,195,0.1)',
            border: '1px solid rgba(253,147,195,0.25)',
            color: '#FD93C3',
            fontFamily: FB, fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            ✦ {t('bookingTitle')}
          </span>

          {/* H1 — Boldonse — mobile: 2rem → desktop: 3.75rem */}
          <h1 style={{
            fontFamily: FD,
            fontSize: 'clamp(2rem, 6vw, 3.75rem)',
            color: '#fff', marginTop: '1rem', marginBottom: 0, lineHeight: 1.15,
          }}>
            {t('bookingHeading')} <span style={gradText}>{t('bookingSubheading')}</span>
          </h1>

          {/* Paragraph */}
          <p style={{
            fontFamily: FB,
            marginTop: '0.75rem', color: 'rgba(255,255,255,0.45)',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            maxWidth: 440, marginLeft: 'auto', marginRight: 'auto',
          }}>
            {t('bookingDesc')}
          </p>
        </motion.div>

        {/* ── Form card — full width on mobile, max 620px centered on desktop ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.55 }}
          style={{ maxWidth: 620, width: '100%', margin: '0 auto' }}
        >
          {/* Steps indicator */}
          {step < 3 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: '1.5rem' }}>
              {[1, 2].map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: FB, fontSize: '0.875rem', fontWeight: 700,
                    flexShrink: 0, transition: 'all 0.3s',
                    ...(step >= s
                      ? { background: 'linear-gradient(135deg,#FD93C3,#E8609A)', color: '#fff', boxShadow: '0 4px 16px rgba(253,147,195,0.4)' }
                      : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }),
                  }}>{s}</div>
                  {s < 2 && (
                    <div style={{
                      width: 60, height: 2, borderRadius: 99,
                      background: step > s ? '#FD93C3' : 'rgba(255,255,255,0.12)',
                      transition: 'background 0.3s',
                    }} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Card — responsive padding ── */}
          <div style={{
            position: 'relative', borderRadius: 24,
            /* clamp padding: 1.25rem on phones → 2rem on desktop */
            padding: 'clamp(1.25rem, 4vw, 2rem)',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>

            {/* ── SUCCESS ── */}
            {step === 3 && (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', textAlign: 'center',
                padding: 'clamp(1.5rem, 5vw, 2.5rem) 0', gap: '1rem',
              }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                  <CheckCircle2 style={{ width: 72, height: 72, color: '#B2BA0C' }} />
                </motion.div>
                <h1 style={{ fontFamily: FD, fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: '#fff', margin: 0 }}>
                  {t('bookingSuccess')}
                </h1>
                <p style={{ fontFamily: FB, color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                  {t('yourAppointment')}{' '}
                  <span style={{ color: '#FD93C3', fontWeight: 700 }}>{form.date}</span>
                  {' '}{t('at')}{' '}
                  <span style={{ color: '#FD93C3', fontWeight: 700 }}>{form.time}</span>
                </p>
                <p style={{ fontFamily: FB, fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>
                  {t('whatsappConfirm')}
                </p>
                <button
                  onClick={() => { setStep(1); setForm(EMPTY) }}
                  style={{
                    padding: '0.875rem 2rem', borderRadius: 99,
                    background: 'transparent', border: '2px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.6)', fontFamily: FB,
                    fontWeight: 700, cursor: 'pointer', transition: 'all 0.25s',
                  }}
                >
                  {t('bookAnother')}
                </button>
              </div>
            )}

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 style={{ fontFamily: FH, fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', color: '#fff', margin: 0 }}>
                  {t('personalInfo')}
                </h2>

                {/* Name + WhatsApp — stacked on mobile, 2 cols on ≥480px */}
                <div className="form-grid-2">
                  <div>
                    <input style={inputStyle} placeholder={t('fullName')}
                      value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    {errors.name && <p style={{ fontFamily: FB, color: '#FD93C3', fontSize: '0.75rem', marginTop: 4 }}>{errors.name}</p>}
                  </div>
                  <div>
                    <input style={inputStyle} placeholder={t('whatsapp')}
                      value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} />
                    {errors.whatsapp && <p style={{ fontFamily: FB, color: '#FD93C3', fontSize: '0.75rem', marginTop: 4 }}>{errors.whatsapp}</p>}
                  </div>
                </div>

                <div>
                  <select
                    style={{ ...inputStyle, color: form.jobStatus ? '#fff' : 'rgba(255,255,255,0.35)', appearance: 'auto' }}
                    value={form.jobStatus}
                    onChange={e => setForm(p => ({ ...p, jobStatus: e.target.value }))}
                  >
                    <option value="" style={{ background: '#1A1025' }}>{t('jobStatus')}</option>
                    {jobOptions.map(o => (
                      <option key={o.v} value={o.v} style={{ background: '#1A1025' }}>{o.l}</option>
                    ))}
                  </select>
                  {errors.jobStatus && <p style={{ fontFamily: FB, color: '#FD93C3', fontSize: '0.75rem', marginTop: 4 }}>{errors.jobStatus}</p>}
                </div>

                <div>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
                    rows={4} placeholder={t('message')}
                    value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  />
                  {errors.message && <p style={{ fontFamily: FB, color: '#FD93C3', fontSize: '0.75rem', marginTop: 4 }}>{errors.message}</p>}
                </div>

                {/* Platform — always 2 cols (buttons are compact enough) */}
                <div className="platform-grid">
                  {[
                    { v: 'google_meet', l: '🟢 Google Meet' },
                    { v: 'zoom',        l: '🔵 Zoom' },
                  ].map(p => (
                    <button key={p.v} type="button"
                      onClick={() => setForm(f => ({ ...f, platform: p.v }))}
                      style={{
                        padding: '0.75rem 0.75rem', borderRadius: 12,
                        fontFamily: FB, fontWeight: 500,
                        fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
                        cursor: 'pointer', transition: 'all 0.2s',
                        ...(form.platform === p.v
                          ? { border: '1px solid #FD93C3', background: 'rgba(253,147,195,0.12)', color: '#FD93C3' }
                          : { border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)' }),
                      }}>
                      {p.l}
                    </button>
                  ))}
                </div>

                <button onClick={() => validate() && setStep(2)} className="btn-primary"
                  style={{ width: '100%', padding: '1rem', marginTop: '0.25rem', fontFamily: FB }}>
                  {t('nextStep')}
                </button>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontFamily: FH, fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', color: '#fff', margin: 0 }}>
                  {t('selectDateTime')}
                </h2>

                {/* Month navigation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    aria-label="Previous month"
                    onClick={() => setMonth(d => new Date(d.getFullYear(), d.getMonth() - 1))}
                    style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', color: '#fff', flexShrink: 0 }}>
                    <ChevronRight size={18} />
                  </button>
                  <span style={{ fontFamily: FH, color: '#fff', fontSize: 'clamp(0.875rem, 3vw, 1rem)', textAlign: 'center' }}>
                    {monthLabel}
                  </span>
                  <button
                    aria-label="Next month"
                    onClick={() => setMonth(d => new Date(d.getFullYear(), d.getMonth() + 1))}
                    style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', color: '#fff', flexShrink: 0 }}>
                    <ChevronLeft size={18} />
                  </button>
                </div>

                {/* Calendar */}
                <div>
                  {/* Day headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
                    {DAY_NAMES.map(d => (
                      <div key={d} style={{
                        textAlign: 'center', fontFamily: FB,
                        fontSize: 'clamp(0.6rem, 2vw, 0.72rem)',
                        padding: '4px 0', color: 'rgba(255,255,255,0.3)',
                      }}>
                        {d.slice(0, 2)}
                      </div>
                    ))}
                  </div>
                  {/* Day cells */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
                    {Array.from({ length: first }).map((_, i) => <div key={`e${i}`} />)}
                    {Array.from({ length: days }, (_, i) => i + 1).map(d => {
                      const ds   = `${year}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                      const sel  = form.date === ds
                      const past = isPast(d)
                      return (
                        <button key={d} disabled={past} onClick={() => pickDate(d)}
                          style={{
                            aspectRatio: '1', borderRadius: 8,
                            fontFamily: FB,
                            fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                            fontWeight: 500,
                            border: 'none', cursor: past ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                            ...(sel
                              ? { background: 'linear-gradient(135deg,#FD93C3,#E8609A)', color: '#fff', boxShadow: '0 4px 16px rgba(253,147,195,0.4)' }
                              : past
                              ? { background: 'transparent', color: 'rgba(255,255,255,0.18)' }
                              : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.75)' }),
                          }}>
                          {d}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time slots */}
                {form.date && (
                  <div>
                    <p style={{ fontFamily: FB, fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
                      {t('availableSlots')}
                    </p>
                    {slotsL ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
                        <Loader2 style={{ color: '#FD93C3', animation: 'spin 1s linear infinite' }} />
                      </div>
                    ) : slots.length === 0 ? (
                      <p style={{ fontFamily: FB, textAlign: 'center', padding: '1rem', borderRadius: 12, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', margin: 0 }}>
                        {t('noSlots')}
                      </p>
                    ) : (
                      <div className="timeslots-grid">
                        {slots.map(s => (
                          <button key={s} onClick={() => setForm(p => ({ ...p, time: s }))}
                            style={{
                              padding: '0.625rem 0.5rem', borderRadius: 10,
                              fontFamily: FB,
                              fontSize: 'clamp(0.78rem, 2vw, 0.875rem)',
                              fontWeight: 600,
                              cursor: 'pointer', transition: 'all 0.2s',
                              ...(form.time === s
                                ? { background: 'linear-gradient(135deg,#FD93C3,#E8609A)', color: '#fff', border: 'none', boxShadow: '0 4px 16px rgba(253,147,195,0.35)' }
                                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.1)' }),
                            }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Back / Confirm buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setStep(1)}
                    style={{ flex: 1, padding: '0.875rem 0.5rem', borderRadius: 99, background: 'transparent', border: '2px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.55)', fontFamily: FB, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.25s', whiteSpace: 'nowrap' }}>
                    {t('prevStep')}
                  </button>
                  <button onClick={submit} disabled={!form.date || !form.time || loading}
                    className="btn-primary"
                    style={{ flex: 1, opacity: (!form.date || !form.time || loading) ? 0.5 : 1, fontFamily: FB, whiteSpace: 'nowrap' }}>
                    {loading
                      ? <><Loader2 style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} /> {t('booking')}</>
                      : t('confirmBooking')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
