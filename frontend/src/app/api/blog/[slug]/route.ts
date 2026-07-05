import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

function mapPost(p: Record<string, unknown>) {
  return { ...p, _id: p.id }
}

// GET /api/blog/:slug — public
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    // Try by slug first (public posts), fallback to id for admin
    const { data } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (!data) return NextResponse.json({ success: false, message: 'المقال غير موجود' }, { status: 404 })
    return NextResponse.json({ success: true, post: mapPost(data) })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}

// PUT /api/blog/:slug — admin (by id)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const { slug: id } = await params
    const body = await req.json()
    const { data, error } = await supabaseAdmin.from('blog_posts').update({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      cover_image: body.coverImage ?? body.cover_image,
      tags: body.tags,
      is_published: body.isPublished ?? body.is_published,
      read_time: body.readTime ?? body.read_time,
    }).eq('id', id).select().single()

    if (error) throw error
    return NextResponse.json({ success: true, post: mapPost(data) })
  } catch {
    return NextResponse.json({ success: false, message: 'المقال غير موجود' }, { status: 404 })
  }
}

// DELETE /api/blog/:slug — admin (by id)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const { slug: id } = await params
    await supabaseAdmin.from('blog_posts').delete().eq('id', id)
    return NextResponse.json({ success: true, message: 'تم الحذف' })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}
