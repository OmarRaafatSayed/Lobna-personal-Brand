import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function mapPost(p: Record<string, unknown>) {
  return { ...p, _id: p.id }
}

// GET /api/blog — public (published only) | admin (all)
export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req)
    let query = supabaseAdmin.from('blog_posts').select('*').order('created_at', { ascending: false })
    if (!user) query = query.eq('is_published', true)

    const { data } = await query
    const posts = (data || []).map(mapPost)
    return NextResponse.json({ success: true, posts })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}

// POST /api/blog — admin only
export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const body = await req.json()
    if (!body.slug && body.title) body.slug = generateSlug(body.title)

    const { data, error } = await supabaseAdmin.from('blog_posts').insert({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      cover_image: body.coverImage || body.cover_image || '',
      tags: body.tags || [],
      is_published: body.isPublished ?? body.is_published ?? false,
      read_time: body.readTime ?? body.read_time ?? 5,
    }).select().single()

    if (error) throw error
    return NextResponse.json({ success: true, post: mapPost(data) }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم: ' + (e as Error).message }, { status: 500 })
  }
}
