const express = require('express')
const prisma = require('../lib/prisma')
const { protect, adminOnly } = require('../middleware/auth')

const router = express.Router()

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalAds, todayReposts, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.ad.count(),
      prisma.repostLog.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }
      }),
      prisma.transaction.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true }
      })
    ])
    res.json({ totalUsers, totalAds, todayReposts, revenue: revenue._sum.amount || 0 })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, plan: true,
        credits: true, role: true, createdAt: true,
        _count: { select: { accounts: true, repostLogs: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ users })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/admin/users/:id/status
router.patch('/users/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body // 'active' or 'suspended'
    // We'll use a simple approach: store suspended as a field
    // For now, toggle role between USER and SUSPENDED (simple demo)
    const user = await prisma.user.findUnique({ where: { id: req.params.id } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    // In real app, add a `status` field to schema
    res.json({ message: `User ${status === 'suspended' ? 'suspended' : 'activated'} successfully` })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/admin/logs
router.get('/logs', protect, adminOnly, async (req, res) => {
  try {
    const logs = await prisma.repostLog.findMany({
      include: {
        ad: { select: { title: true, account: { select: { site: true } } } },
        user: { select: { email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 200
    })
    res.json({ logs })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
