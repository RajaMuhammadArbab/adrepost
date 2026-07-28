const express = require('express')
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')

const router = express.Router()

// GET /api/ads
router.get('/', protect, async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.user.id },
      select: { id: true }
    })
    const accountIds = accounts.map(a => a.id)

    const ads = await prisma.ad.findMany({
      where: { accountId: { in: accountIds } },
      include: { account: { select: { username: true, site: true } } },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ ads })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/ads/:id/toggle
router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const ad = await prisma.ad.findFirst({
      where: { id: req.params.id },
      include: { account: true }
    })
    if (!ad || ad.account.userId !== req.user.id)
      return res.status(404).json({ error: 'Ad not found' })

    const updated = await prisma.ad.update({
      where: { id: req.params.id },
      data: { autoRepost: !ad.autoRepost }
    })
    res.json({ ad: updated })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/ads/:id/interval
router.patch('/:id/interval', protect, async (req, res) => {
  try {
    const { interval } = req.body
    const ad = await prisma.ad.findFirst({
      where: { id: req.params.id },
      include: { account: true }
    })
    if (!ad || ad.account.userId !== req.user.id)
      return res.status(404).json({ error: 'Ad not found' })

    const updated = await prisma.ad.update({
      where: { id: req.params.id },
      data: { interval: parseInt(interval) }
    })
    res.json({ ad: updated })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/ads/:id/repost  (force manual repost)
router.post('/:id/repost', protect, async (req, res) => {
  try {
    const ad = await prisma.ad.findFirst({
      where: { id: req.params.id },
      include: { account: true }
    })
    if (!ad || ad.account.userId !== req.user.id)
      return res.status(404).json({ error: 'Ad not found' })

    // Check credits
    if (req.user.credits < 1 && req.user.plan === 'FREE')
      return res.status(402).json({ error: 'Insufficient credits' })

    // In production: trigger Puppeteer scraper here
    // For now simulate success
    await prisma.ad.update({
      where: { id: ad.id },
      data: { lastRepostAt: new Date() }
    })

    await prisma.repostLog.create({
      data: {
        adId: ad.id,
        userId: req.user.id,
        status: 'success'
      }
    })

    res.json({ message: 'Ad reposted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
