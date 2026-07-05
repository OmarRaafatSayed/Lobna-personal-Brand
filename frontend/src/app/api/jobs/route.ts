import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

function mapJob(j: Record<string, unknown>) {
  return { ...j, _id: j.id, applyLink: j.apply_link, isActive: j.is_active }
}

// GET /api/jobs — public (active only) | admin (all)
export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req)
    const url = new URL(req.url)
    const all = url.searchParams.get('all') === 'true'

    let query = supabaseAdmin.from('jobs').select('*').order('created_at', { ascending: false })
    if (!user || !all) query = query.eq('is_active', true)

    const { data } = await query
    return NextResponse.json({ success: true, jobs: (data || []).map(mapJob) })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}

// POST /api/jobs — admin only
export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const body = await req.json()
    const { data, error } = await supabaseAdmin.from('jobs').insert({
      title: body.title,
      company: body.company,
      location: body.location,
      type: body.type,
      description: body.description,
      requirements: body.requirements || [],
      salary: body.salary || '',
      apply_link: body.applyLink || body.apply_link || '',
      image: body.image || '',
      is_active: body.isActive ?? body.is_active ?? true,
      deadline: body.deadline ? new Date(body.deadline).toISOString() : null,
    }).select().single()

    if (error) throw error
    return NextResponse.json({ success: true, job: mapJob(data) }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم: ' + (e as Error).message }, { status: 500 })
  }
}
