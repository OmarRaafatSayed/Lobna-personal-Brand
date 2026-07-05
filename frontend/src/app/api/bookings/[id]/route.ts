import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

function mapBooking(b: Record<string, unknown>) {
  return { ...b, _id: b.id, jobStatus: b.job_status, meetingLink: b.meeting_link }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const updateData: Record<string, unknown> = {}
    if (body.status !== undefined) updateData.status = body.status
    if (body.meetingLink !== undefined) updateData.meeting_link = body.meetingLink
    if (body.meeting_link !== undefined) updateData.meeting_link = body.meeting_link

    const { data, error } = await supabaseAdmin.from('bookings').update(updateData).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ success: true, booking: mapBooking(data) })
  } catch {
    return NextResponse.json({ success: false, message: 'الحجز غير موجود' }, { status: 404 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const { id } = await params
    await supabaseAdmin.from('bookings').delete().eq('id', id)
    return NextResponse.json({ success: true, message: 'تم حذف الحجز' })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}
