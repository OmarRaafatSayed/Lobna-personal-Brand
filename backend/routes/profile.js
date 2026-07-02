const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')

// Shape the raw DB record into the nested format the frontend expects
const formatProfile = (p) => ({
  _id: p.id,
  name: p.name,
  title: p.title,
  bio: p.bio,
  avatar: p.avatar,
  cvFile: p.cvFile,
  heroTagline: p.heroTagline,
  heroSubtitle: p.heroSubtitle,
  stats: {
    clients: p.statsClients,
    experience: p.statsExperience,
    companies: p.statsCompanies,
    successRate: p.statsSuccessRate,
  },
  previousCompanies: p.previousCompanies,
  testimonials: p.testimonials,
  socialLinks: {
    linkedin: p.socialLinkedin,
    instagram: p.socialInstagram,
    twitter: p.socialTwitter,
    whatsapp: p.socialWhatsapp,
    facebook: p.socialFacebook,
  },
})

// GET /api/profile (public)
router.get('/', async (req, res) => {
  try {
    let raw = await prisma.profile.findFirst()
    if (!raw) raw = await prisma.profile.create({ data: {} })
    res.json({ success: true, profile: formatProfile(raw) })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

// PUT /api/profile (admin)
router.put('/', protect, async (req, res) => {
  try {
    const body = req.body
    const data = {
      name: body.name,
      title: body.title,
      bio: body.bio,
      avatar: body.avatar,
      cvFile: body.cvFile,
      heroTagline: body.heroTagline,
      heroSubtitle: body.heroSubtitle,
      statsClients: body.stats?.clients ?? 0,
      statsExperience: body.stats?.experience ?? 0,
      statsCompanies: body.stats?.companies ?? 0,
      statsSuccessRate: body.stats?.successRate ?? 0,
      previousCompanies: body.previousCompanies ?? [],
      testimonials: body.testimonials ?? [],
      socialLinkedin: body.socialLinks?.linkedin ?? '',
      socialInstagram: body.socialLinks?.instagram ?? '',
      socialTwitter: body.socialLinks?.twitter ?? '',
      socialWhatsapp: body.socialLinks?.whatsapp ?? '',
      socialFacebook: body.socialLinks?.facebook ?? '',
    }

    let raw = await prisma.profile.findFirst()
    if (!raw) {
      raw = await prisma.profile.create({ data })
    } else {
      raw = await prisma.profile.update({ where: { id: raw.id }, data })
    }
    res.json({ success: true, profile: formatProfile(raw) })
  } catch (e) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم: ' + e.message })
  }
})

module.exports = router
