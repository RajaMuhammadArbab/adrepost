require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const authRoutes         = require('./routes/auth')
const accountsRoutes     = require('./routes/accounts')
const adsRoutes          = require('./routes/ads')
const logsRoutes         = require('./routes/logs')
const adminRoutes        = require('./routes/admin')
const subscriptionRoutes = require('./routes/subscription')
const { startScheduler } = require('./scheduler')

const app = express()

// CORS — allow frontend
app.use(cors({
  origin: function(origin, callback) {
    callback(null, true); // allow all origins
  },
  credentials: true
}))

app.use(cookieParser())
app.use(express.json())

// Stripe webhook needs raw body — mount BEFORE express.json()
app.use('/api/webhook', subscriptionRoutes)

// Routes
app.use('/api/auth',         authRoutes)
app.use('/api/accounts',     accountsRoutes)
app.use('/api/ads',          adsRoutes)
app.use('/api/logs',         logsRoutes)
app.use('/api/admin',        adminRoutes)
app.use('/api/subscription', subscriptionRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 AdRepost backend running on port ${PORT}`)
  startScheduler()
})

module.exports = app
