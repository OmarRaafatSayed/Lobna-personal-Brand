const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')

const protect = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'غير مصرح لك بالدخول.' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    })

    if (!user) {
      return res.status(401).json({ success: false, message: 'المستخدم غير موجود.' })
    }

    req.user = user
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'التوكن غير صالح أو منتهي الصلاحية.' })
  }
}

module.exports = { protect }
