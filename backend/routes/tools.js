const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')

// GET /api/tools (public)
router.get('/', async (req, res) => {
  try {
    const tools = await prisma.tool.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    res.json({ success: true, tools })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

// GET /api/tools/all (admin)
router.get('/all', protect, async (req, res) => {
  try {
    const tools = await prisma.tool.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    res.json({ success: true, tools })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

// POST /api/tools (admin)
router.post('/', protect, async (req, res) => {
  try {
    const tool = await prisma.tool.create({ data: req.body })
    res.status(201).json({ success: true, tool })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

// PUT /api/tools/:id (admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const tool = await prisma.tool.update({ where: { id: req.params.id }, data: req.body })
    res.json({ success: true, tool })
  } catch {
    res.status(500).json({ success: false, message: 'الأداة غير موجودة' })
  }
})

// DELETE /api/tools/:id (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.tool.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'تم الحذف' })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

module.exports = router
