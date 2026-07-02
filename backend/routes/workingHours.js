const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')

// GET /api/working-hours (public)
router.get('/', async (req, res) => {
  try {
    const hours = await prisma.workingHour.findMany({ orderBy: { dayOfWeek: 'asc' } })
    res.json({ success: true, hours })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

// PUT /api/working-hours (admin)
router.put('/', protect, async (req, res) => {
  try {
    const { hours } = req.body
    if (!Array.isArray(hours)) {
      return res.status(400).json({ success: false, message: 'البيانات غير صالحة' })
    }

    for (const day of hours) {
      await prisma.workingHour.upsert({
        where: { dayOfWeek: day.dayOfWeek },
        update: { isActive: day.isActive, slots: day.slots },
        create: { dayOfWeek: day.dayOfWeek, isActive: day.isActive, slots: day.slots },
      })
    }

    const updated = await prisma.workingHour.findMany({ orderBy: { dayOfWeek: 'asc' } })
    res.json({ success: true, hours: updated })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

module.exports = router
