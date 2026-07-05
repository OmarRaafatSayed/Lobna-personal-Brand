import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'البريد وكلمة المرور مطلوبان' }, { status: 400 })
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (!user) {
      return NextResponse.json({ success: false, message: 'البريد أو كلمة المرور غير صحيحة' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'البريد أو كلمة المرور غير صحيحة' }, { status: 401 })
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role })
    return NextResponse.json({ success: true, token, user: { id: user.id, email: user.email, role: user.role } })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}
