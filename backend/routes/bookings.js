const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')
const { sendWhatsAppNotification } = require('../utils/whatsapp')

// GET /api/bookings/available-slots?date=YYYY-MM-DD
router.get('/available-slots', async (req, res) => {
  try {
    const { date } = req.query
    if (!date) return res.status(400).json({ success: false, message: 'التاريخ مطلوب' })

    const dayOfWeek = new Date(date).getDay()

    const workingHour = await prisma.workingHour.findUnique({ where: { dayOfWeek } })
    if (!workingHour || !workingHour.isActive) {
      return res.json({ success: true, slots: [] })
    }

    // Generate 30-min slots
    const allSlots = []
    const slotsData = workingHour.slots // JSON array
    for (const slot of slotsData) {
      const [startH, startM] = slot.start.split(':').map(Number)
      const [endH, endM] = slot.end.split(':').map(Number)
      let current = startH * 60 + startM
      const end = endH * 60 + endM
      while (current + 30 <= end) {
        const h = String(Math.floor(current / 60)).padStart(2, '0')
        const m = String(current % 60).padStart(2, '0')
        allSlots.push(`${h}:${m}`)
        current += 30
      }
    }

    // Remove booked slots
    const booked = await prisma.booking.findMany({
      where: { date, status: { in: ['pending', 'confirmed'] } },
      select: { time: true },
    })
    const bookedTimes = booked.map((b) => b.time)
    const available = allSlots.filter((s) => !bookedTimes.includes(s))

    res.json({ success: true, slots: available })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

// POST /api/bookings
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('الاسم مطلوب'),
    body('whatsapp').notEmpty().withMessage('رقم الواتساب مطلوب'),
    body('jobStatus').notEmpty().withMessage('الحالة الوظيفية مطلوبة'),
    body('message').notEmpty().withMessage('الرسالة مطلوبة'),
    body('date').notEmpty().withMessage('التاريخ مطلوب'),
    body('time').notEmpty().withMessage('الوقت مطلوب'),
    body('platform').isIn(['google_meet', 'zoom']).withMessage('المنصة غير صالحة'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { name, whatsapp, jobStatus, message, date, time, platform } = req.body
    try {
      // Check slot availability
      const existing = await prisma.booking.findFirst({
        where: { date, time, status: { in: ['pending', 'confirmed'] } },
      })
      if (existing) {
        return res.status(400).json({ success: false, message: 'هذا الموعد محجوز بالفعل.' })
      }

      const booking = await prisma.booking.create({
        data: { name, whatsapp, jobStatus, message, date, time, platform },
      })

      // WhatsApp notification (non-blocking)
      sendWhatsAppNotification(booking).then((result) => {
        if (result.success) {
          prisma.booking.update({ where: { id: booking.id }, data: { whatsappNotified: true } }).catch(() => {})
        }
      })

      res.status(201).json({
        success: true,
        message: 'تم حجز موعدك بنجاح! سيتم التواصل معك قريباً.',
        booking: { id: booking.id, date, time, platform, status: booking.status },
      })
    } catch {
      res.status(500).json({ success: false, message: 'خطأ في الخادم' })
    }
  }
)

// GET /api/bookings (admin)
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const where = status ? { status } : {}
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.booking.count({ where }),
    ])
    res.json({ success: true, bookings, total, page: Number(page) })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

// PATCH /api/bookings/:id (admin)
router.patch('/:id', protect, async (req, res) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json({ success: true, booking })
  } catch {
    res.status(500).json({ success: false, message: 'الحجز غير موجود' })
  }
})

// DELETE /api/bookings/:id (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.booking.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'تم حذف الحجز' })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

module.exports = router
