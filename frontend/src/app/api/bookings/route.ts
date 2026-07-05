import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

function mapBooking(b: Record<string, unknown>) {
  return { ...b, _id: b.id, whatsapp: b.whatsapp, jobStatus: b.job_status, meetingLink: b.meeting_link, whatsappNotified: b.whatsapp_notified }
}

// POST /api/bookings — public
export async function POST(req: NextRequest) {
  try {
    const { name, whatsapp, jobStatus, message, date, time, platform } = await req.json()

    if (!name || !whatsapp || !jobStatus || !message || !date || !time || !platform) {
      return NextResponse.json({ success: false, message: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    // Check slot availability
    const { data: existing } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .in('status', ['pending', 'confirmed'])
      .single()

    if (existing) {
      return NextResponse.json({ success: false, message: 'هذا الموعد محجوز بالفعل.' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.from('bookings').insert({
      name, whatsapp,
      job_status: jobStatus,
      message, date, time, platform,
      status: 'pending',
    }).select().single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'تم حجز موعدك بنجاح! سيتم التواصل معك قريباً.',
      booking: { id: data.id, date, time, platform, status: data.status },
    }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}

// GET /api/bookings — admin only
export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const page = Number(url.searchParams.get('page') || '1')
    const limit = Number(url.searchParams.get('limit') || '20')

    let query = supabaseAdmin.from('bookings').select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status) query = query.eq('status', status)

    const { data, count } = await query
    return NextResponse.json({ success: true, bookings: (data || []).map(mapBooking), total: count, page })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}
