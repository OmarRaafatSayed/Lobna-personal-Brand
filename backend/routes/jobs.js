const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')

// GET /api/jobs (public)
router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, jobs })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

// GET /api/jobs/all (admin)
router.get('/all', protect, async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, jobs })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

// POST /api/jobs (admin)
router.post('/', protect, async (req, res) => {
  try {
    const { deadline, ...rest } = req.body
    const job = await prisma.job.create({
      data: { ...rest, deadline: deadline ? new Date(deadline) : null },
    })
    res.status(201).json({ success: true, job })
  } catch (e) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

// PUT /api/jobs/:id (admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const { deadline, ...rest } = req.body
    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: { ...rest, deadline: deadline ? new Date(deadline) : null },
    })
    res.json({ success: true, job })
  } catch {
    res.status(500).json({ success: false, message: 'الوظيفة غير موجودة' })
  }
})

// DELETE /api/jobs/:id (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.job.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'تم الحذف' })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

module.exports = router
