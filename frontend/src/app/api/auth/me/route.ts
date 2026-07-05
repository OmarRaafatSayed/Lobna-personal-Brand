import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  const { data } = await supabaseAdmin.from('users').select('id, email, role').eq('id', user.id).single()
  return NextResponse.json({ success: true, user: data })
}
