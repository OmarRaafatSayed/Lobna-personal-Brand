import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ success: false, message: 'لم يتم رفع ملف' }, { status: 400 })

    const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!allowed.includes(ext)) {
      return NextResponse.json({ success: false, message: 'نوع الملف غير مدعوم' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`

    const { error } = await supabaseAdmin.storage
      .from('uploads')
      .upload(filename, buffer, { contentType: file.type, upsert: false })

    if (error) throw error

    const { data: { publicUrl } } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename)

    return NextResponse.json({ success: true, url: publicUrl })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'خطأ في الرفع: ' + (e as Error).message }, { status: 500 })
  }
}
