const bcrypt = require('bcryptjs')
const prisma = require('../lib/prisma')

const seedAdmin = async () => {
  try {
    // Admin user
    const existing = await prisma.user.findUnique({
      where: { email: process.env.ADMIN_EMAIL },
    })
    if (!existing) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
      await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL,
          password: hashed,
          role: 'admin',
        },
      })
      console.log('✅ Admin user created')
    }

    // Default profile
    const profileCount = await prisma.profile.count()
    if (profileCount === 0) {
      await prisma.profile.create({
        data: {
          name: 'لبنى',
          title: 'خبيرة المبيعات والتطوير المهني',
          bio: 'أساعدك في بناء مسيرتك المهنية في المبيعات بخبرة تمتد لسنوات في كبرى الشركات.',
          heroTagline: 'تقديم الدعم بالحب',
          heroSubtitle: 'بناء جسور الثقة مع مجتمع المبيعات',
          statsClients: 150,
          statsExperience: 8,
          statsCompanies: 12,
          statsSuccessRate: 95,
        },
      })
      console.log('✅ Default profile created')
    }

    // Default working hours
    const hoursCount = await prisma.workingHour.count()
    if (hoursCount === 0) {
      const days = [
        { dayOfWeek: 0, isActive: false, slots: [] },
        { dayOfWeek: 1, isActive: true,  slots: [{ start: '09:00', end: '12:00' }] },
        { dayOfWeek: 2, isActive: true,  slots: [{ start: '09:00', end: '12:00' }] },
        { dayOfWeek: 3, isActive: true,  slots: [{ start: '09:00', end: '12:00' }] },
        { dayOfWeek: 4, isActive: true,  slots: [{ start: '09:00', end: '12:00' }] },
        { dayOfWeek: 5, isActive: false, slots: [] },
        { dayOfWeek: 6, isActive: false, slots: [] },
      ]
      for (const day of days) {
        await prisma.workingHour.create({ data: day })
      }
      console.log('✅ Default working hours created')
    }
  } catch (err) {
    console.error('❌ Seed error:', err)
  }
}

module.exports = seedAdmin
