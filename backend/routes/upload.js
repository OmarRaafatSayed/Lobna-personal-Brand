const express = require('express')
const multer  = require('multer')
const path    = require('path')
const fs      = require('fs')
const { protect } = require('../middleware/auth')

const router = express.Router()

/* ── ensure uploads dir exists ── */
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

/* ── multer storage ── */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename:    (_req, file, cb) => {
    // Keep the original filename, just sanitize it
    const ext  = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9\u0600-\u06FF._-]/g, '_') // allow Arabic + safe chars
      .slice(0, 60)                                     // max 60 chars
    const unique = Date.now()
    cb(null, `${base}_${unique}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) return cb(null, true)
    cb(new Error('Only PDF and image files are allowed'))
  },
})

/* POST /api/upload  →  { url: "/uploads/<filename>" } */
router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })
  const url = `/uploads/${req.file.filename}`
  res.json({ success: true, url })
})

module.exports = router
