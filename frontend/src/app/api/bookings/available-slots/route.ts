import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const date = url.searchParams.get('date')
    if (!date) return NextResponse.json({ success: false, message: 'التاريخ مطلوب' }, { status: 400 })

    const dayOfWeek = new Date(date).getDay()

    const { data: workingHour } = await supabaseAdmin
      .from('working_hours')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .single()

    if (!workingHour || !workingHour.is_active) {
      return NextResponse.json({ success: true, slots: [] })
    }

    // Generate 30-min slots
    const allSlots: string[] = []
    const slotsData = workingHour.slots as { start: string; end: string }[]

    for (const slot of slotsData) {
      const [startH, startM] = slot.start.split(':').map(Number)
      const [endH, endM] = slot.end.split(':').map(Number)
      let current = startH * 60 + startM
      const end = endH * 60 + endM
      while (current + 30 <= end) {
        const h = String(Math.floor(current / 60)).padStart(2, '0')
        const m = String(current % 60).padStart(2, '0')
        allSlots.push(`${h}:${m}`)
        current += 30
      }
    }

    // Remove booked slots
    const { data: booked } = await supabaseAdmin
      .from('bookings')
      .select('time')
      .eq('date', date)
      .in('status', ['pending', 'confirmed'])

    const bookedTimes = (booked || []).map((b: { time: string }) => b.time)
    const available = allSlots.filter(s => !bookedTimes.includes(s))

    return NextResponse.json({ success: true, slots: available })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}
