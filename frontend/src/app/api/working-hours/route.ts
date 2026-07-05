import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

function mapHour(h: Record<string, unknown>) {
  return { ...h, _id: h.id, dayOfWeek: h.day_of_week, isActive: h.is_active }
}

export async function GET() {
  try {
    const { data } = await supabaseAdmin.from('working_hours').select('*').order('day_of_week', { ascending: true })
    return NextResponse.json({ success: true, hours: (data || []).map(mapHour) })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const { hours } = await req.json()
    if (!Array.isArray(hours)) {
      return NextResponse.json({ success: false, message: 'البيانات غير صالحة' }, { status: 400 })
    }

    for (const day of hours) {
      await supabaseAdmin.from('working_hours').upsert({
        day_of_week: day.dayOfWeek,
        is_active: day.isActive,
        slots: day.slots,
      }, { onConflict: 'day_of_week' })
    }

    const { data } = await supabaseAdmin.from('working_hours').select('*').order('day_of_week', { ascending: true })
    return NextResponse.json({ success: true, hours: (data || []).map(mapHour) })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}
