const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('البريد الإلكتروني غير صالح'),
    body('password').notEmpty().withMessage('كلمة المرور مطلوبة'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { email, password } = req.body
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return res.status(401).json({ success: false, message: 'البريد أو كلمة المرور غير صحيحة' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'البريد أو كلمة المرور غير صحيحة' })
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      })

      res.json({
        success: true,
        token,
        user: { id: user.id, email: user.email, role: user.role },
      })
    } catch {
      res.status(500).json({ success: false, message: 'خطأ في الخادم' })
    }
  }
)

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user })
})

module.exports = router
