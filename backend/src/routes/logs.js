const express = require('express')
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')

const router = express.Router()

// GET /api/logs
router.get('/', protect, async (req, res) => {
  try {
    const logs = await prisma.repostLog.findMany({
      where: { userId: req.user.id },
      include: { ad: { select: { title: true, account: { select: { site: true, username: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 100
    })
    res.json({ logs })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
