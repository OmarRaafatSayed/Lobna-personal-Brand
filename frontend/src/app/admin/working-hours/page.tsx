'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Plus, Trash2, Save } from 'lucide-react'
import api from '@/lib/api'
import type { WorkingHour } from '@/lib/types'
import { DAY_NAMES_AR } from '@/lib/constants'

const DAY_NAMES = DAY_NAMES_AR

const DEFAULT_HOURS: WorkingHour[] = DAY_NAMES.map((_, i) => ({
  dayOfWeek: i,
  isActive: i >= 1 && i <= 4,
  slots: i >= 1 && i <= 4 ? [{ start: '09:00', end: '12:00' }] : [],
}))

export default function AdminWorkingHoursPage() {
  const [hours, setHours] = useState<WorkingHour[]>(DEFAULT_HOURS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get<{ hours: WorkingHour[] }>('/working-hours')
      .then((res) => {
        if (res.hours.length > 0) setHours(res.hours)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleDay = (dayIndex: number) => {
    setHours((prev) => prev.map((h) => h.dayOfWeek === dayIndex ? { ...h, isActive: !h.isActive } : h))
  }

  const addSlot = (dayIndex: number) => {
    setHours((prev) => prev.map((h) =>
      h.dayOfWeek === dayIndex
        ? { ...h, slots: [...h.slots, { start: '09:00', end: '12:00' }] }
        : h
    ))
  }

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    setHours((prev) => prev.map((h) =>
      h.dayOfWeek === dayIndex
        ? { ...h, slots: h.slots.filter((_, i) => i !== slotIndex) }
        : h
    ))
  }

  const updateSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
    setHours((prev) => prev.map((h) =>
      h.dayOfWeek === dayIndex
        ? {
            ...h,
            slots: h.slots.map((s, i) => i === slotIndex ? { ...s, [field]: value } : s),
          }
        : h
    ))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/working-hours', { hours })
      alert('تم حفظ ساعات العمل بنجاح ✅')
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'خطأ في الحفظ')
    } finally { setSaving(false) }
  }

  if (loading) return <AdminLayout><div className="text-center py-20 text-gray-400">جاري التحميل...</div></AdminLayout>

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl text-gray-900">ساعات العمل</h1>
            <p className="text-gray-500 mt-1">حدد مواعيد الاستشارات المتاحة للحجز</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-rose text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-rose hover:shadow-rose-lg transition-all hover:scale-105 disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {hours.map((day) => (
            <motion.div
              key={day.dayOfWeek}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: day.dayOfWeek * 0.05 }}
              className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all ${day.isActive ? 'border-rose/30' : 'border-gray-100 opacity-60'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={day.isActive}
                      onChange={() => toggleDay(day.dayOfWeek)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-rose transition-colors" />
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-[-20px]" />
                  </label>
                  <span className={`font-semibold text-lg ${day.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                    {DAY_NAMES[day.dayOfWeek]}
                  </span>
                </div>
                {day.isActive && (
                  <button
                    onClick={() => addSlot(day.dayOfWeek)}
                    className="text-rose hover:bg-rose/10 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 text-sm font-medium"
                  >
                    <Plus size={16} /> إضافة فترة
                  </button>
                )}
              </div>

              {day.isActive && (
                <div className="space-y-3">
                  {day.slots.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-3 bg-gray-50 rounded-xl">
                      لا توجد فترات. أضف فترة عمل.
                    </p>
                  ) : (
                    day.slots.map((slot, si) => (
                      <div key={si} className="flex items-center gap-3 bg-rose/5 rounded-xl p-3">
                        <span className="text-sm text-gray-500 w-10">من</span>
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => updateSlot(day.dayOfWeek, si, 'start', e.target.value)}
                          className="border-2 border-rose/30 rounded-lg px-3 py-1.5 text-sm focus:border-rose focus:outline-none bg-white"
                        />
                        <span className="text-sm text-gray-500">إلى</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => updateSlot(day.dayOfWeek, si, 'end', e.target.value)}
                          className="border-2 border-rose/30 rounded-lg px-3 py-1.5 text-sm focus:border-rose focus:outline-none bg-white"
                        />
                        <button
                          onClick={() => removeSlot(day.dayOfWeek, si)}
                          className="text-red-400 hover:text-red-600 transition-colors mr-auto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
