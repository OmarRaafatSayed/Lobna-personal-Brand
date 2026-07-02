const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')

const generateSlug = (title) =>
  title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

// GET /api/blog (public)
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, posts })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

// GET /api/blog/all (admin)
router.get('/all', protect, async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, posts })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

// GET /api/blog/:slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug: req.params.slug, isPublished: true },
    })
    if (!post) return res.status(404).json({ success: false, message: 'المقال غير موجود' })
    res.json({ success: true, post })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

// POST /api/blog (admin)
router.post('/', protect, async (req, res) => {
  try {
    const data = { ...req.body }
    if (!data.slug && data.title) data.slug = generateSlug(data.title)
    const post = await prisma.blogPost.create({ data })
    res.status(201).json({ success: true, post })
  } catch (e) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم: ' + e.message })
  }
})

// PUT /api/blog/:id (admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json({ success: true, post })
  } catch {
    res.status(500).json({ success: false, message: 'المقال غير موجود' })
  }
})

// DELETE /api/blog/:id (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'تم الحذف' })
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' })
  }
})

module.exports = router
