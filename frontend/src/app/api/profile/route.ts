import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

function formatProfile(p: Record<string, unknown>) {
  return {
    _id: p.id,
    name: p.name,
    title: p.title,
    bio: p.bio,
    avatar: p.avatar,
    cvFile: p.cv_file,
    heroTagline: p.hero_tagline,
    heroSubtitle: p.hero_subtitle,
    stats: {
      clients: p.stats_clients,
      experience: p.stats_experience,
      companies: p.stats_companies,
      successRate: p.stats_success_rate,
    },
    previousCompanies: p.previous_companies || [],
    testimonials: p.testimonials || [],
    socialLinks: {
      linkedin: p.social_linkedin,
      instagram: p.social_instagram,
      twitter: p.social_twitter,
      whatsapp: p.social_whatsapp,
      facebook: p.social_facebook,
    },
  }
}

export async function GET() {
  try {
    let { data } = await supabaseAdmin.from('profiles').select('*').limit(1).single()

    if (!data) {
      const { data: created } = await supabaseAdmin.from('profiles').insert({
        name: 'لبنى',
        title: 'خبيرة المبيعات والتطوير المهني',
        bio: 'أساعدك في بناء مسيرتك المهنية في المبيعات بخبرة تمتد لسنوات في كبرى الشركات.',
        hero_tagline: 'تقديم الدعم بالحب',
        hero_subtitle: 'بناء جسور الثقة مع مجتمع المبيعات',
        stats_clients: 150,
        stats_experience: 8,
        stats_companies: 12,
        stats_success_rate: 95,
      }).select().single()
      data = created
    }

    return NextResponse.json({ success: true, profile: formatProfile(data) })
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })

  try {
    const body = await req.json()
    const updateData = {
      name: body.name,
      title: body.title,
      bio: body.bio,
      avatar: body.avatar,
      cv_file: body.cvFile,
      hero_tagline: body.heroTagline,
      hero_subtitle: body.heroSubtitle,
      stats_clients: body.stats?.clients ?? 0,
      stats_experience: body.stats?.experience ?? 0,
      stats_companies: body.stats?.companies ?? 0,
      stats_success_rate: body.stats?.successRate ?? 0,
      previous_companies: body.previousCompanies ?? [],
      testimonials: body.testimonials ?? [],
      social_linkedin: body.socialLinks?.linkedin ?? '',
      social_instagram: body.socialLinks?.instagram ?? '',
      social_twitter: body.socialLinks?.twitter ?? '',
      social_whatsapp: body.socialLinks?.whatsapp ?? '',
      social_facebook: body.socialLinks?.facebook ?? '',
    }

    let { data } = await supabaseAdmin.from('profiles').select('id').limit(1).single()

    if (!data) {
      const { data: created } = await supabaseAdmin.from('profiles').insert(updateData).select().single()
      data = created
    } else {
      const { data: updated } = await supabaseAdmin.from('profiles').update(updateData).eq('id', data.id).select().single()
      data = updated
    }

    return NextResponse.json({ success: true, profile: formatProfile(data as Record<string, unknown>) })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم: ' + (e as Error).message }, { status: 500 })
  }
}
