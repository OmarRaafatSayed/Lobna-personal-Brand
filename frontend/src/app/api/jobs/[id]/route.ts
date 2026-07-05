import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

function mapJob(j: Record<string, unknown>) {
  return { ...j, _id: j.id, applyLink: j.apply_link, isActive: j.is_active }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const { data, error } = await supabaseAdmin.from('jobs').update({
      title: body.title,
      company: body.company,
      location: body.location,
      type: body.type,
      description: body.description,
      requirements: body.requirements,
      salary: body.salary,
      apply_link: body.applyLink ?? body.apply_link,
      image: body.image,
      is_active: body.isActive ?? body.is_active,
      deadline: body.deadline ? new Date(body.deadline).toISOString() : null,
    }).eq('id', id).select().single()

    if (error) throw error
    return NextResponse.json({ success: true, job: mapJob(data) })
  } catch {
    return NextResponse.json({ success: false, message: 'الوظيفة غير موجودة' }, { status: 404 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const { id } = await params
    await supabaseAdmin.from('jobs').delete().eq('id', id)
    return NextResponse.json({ success: true, message: 'تم الحذف' })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}
