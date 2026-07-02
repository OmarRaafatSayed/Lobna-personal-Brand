const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const prisma = require('./lib/prisma')

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Routes
app.use('/api/auth',          require('./routes/auth'))
app.use('/api/bookings',      require('./routes/bookings'))
app.use('/api/jobs',          require('./routes/jobs'))
app.use('/api/blog',          require('./routes/blog'))
app.use('/api/tools',         require('./routes/tools'))
app.use('/api/profile',       require('./routes/profile'))
app.use('/api/working-hours', require('./routes/workingHours'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Lobna API is running ✅' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' })
})

const PORT = process.env.PORT || 5000

async function main() {
  try {
    // Test DB connection
    await prisma.$connect()
    console.log('✅ PostgreSQL connected')

    // Seed default data
    await require('./utils/seedAdmin')()

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ Failed to start:', err.message)
    process.exit(1)
  }
}

main()
