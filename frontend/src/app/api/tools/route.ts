import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

function mapTool(t: Record<string, unknown>) {
  return { ...t, _id: t.id, isActive: t.is_active }
}

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req)
    const url = new URL(req.url)
    const all = url.searchParams.get('all') === 'true'

    let query = supabaseAdmin.from('tools').select('*').order('order', { ascending: true }).order('created_at', { ascending: false })
    if (!user || !all) query = query.eq('is_active', true)

    const { data } = await query
    return NextResponse.json({ success: true, tools: (data || []).map(mapTool) })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const body = await req.json()
    const { data, error } = await supabaseAdmin.from('tools').insert({
      name: body.name,
      description: body.description,
      category: body.category,
      link: body.link || '',
      icon: body.icon || '',
      is_active: body.isActive ?? body.is_active ?? true,
      order: body.order ?? 0,
    }).select().single()

    if (error) throw error
    return NextResponse.json({ success: true, tool: mapTool(data) }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم: ' + (e as Error).message }, { status: 500 })
  }
}
