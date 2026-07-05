import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

function mapTool(t: Record<string, unknown>) {
  return { ...t, _id: t.id, isActive: t.is_active }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const { data, error } = await supabaseAdmin.from('tools').update({
      name: body.name,
      description: body.description,
      category: body.category,
      link: body.link,
      icon: body.icon,
      is_active: body.isActive ?? body.is_active,
      order: body.order,
    }).eq('id', id).select().single()

    if (error) throw error
    return NextResponse.json({ success: true, tool: mapTool(data) })
  } catch {
    return NextResponse.json({ success: false, message: 'الأداة غير موجودة' }, { status: 404 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const { id } = await params
    await supabaseAdmin.from('tools').delete().eq('id', id)
    return NextResponse.json({ success: true, message: 'تم الحذف' })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}
