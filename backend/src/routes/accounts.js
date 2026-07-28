const express = require('express')
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')

const router = express.Router()

// GET /api/accounts
router.get('/', protect, async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.user.id },
      include: { _count: { select: { ads: true } } },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ accounts })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/accounts
router.post('/', protect, async (req, res) => {
  try {
    const { username, site, proxyRegion, password } = req.body
    if (!username || !site) return res.status(400).json({ error: 'Username and site required' })

    // In production: use Puppeteer to login and get session cookie
    // For now we store the account credentials securely
    const account = await prisma.account.create({
      data: {
        userId: req.user.id,
        username,
        site,
        proxyRegion: proxyRegion || 'US-East',
        status: 'active'
      }
    })
    res.status(201).json({ account })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/accounts/:id/sync
router.post('/:id/sync', protect, async (req, res) => {
  try {
    const account = await prisma.account.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    })
    if (!account) return res.status(404).json({ error: 'Account not found' })

    // In production: Puppeteer will fetch real ads here
    // For now, simulate with dummy data
    const dummyAds = [
      { title: 'Honda Civic 2019', price: 'PKR 42,00,000', category: 'Cars' },
      { title: 'iPhone 15 Pro Max', price: 'PKR 3,15,000', category: 'Mobiles' },
    ]

    for (const ad of dummyAds) {
      const exists = await prisma.ad.findFirst({
        where: { accountId: account.id, title: ad.title }
      })
      if (!exists) {
        await prisma.ad.create({
          data: { accountId: account.id, ...ad }
        })
      }
    }

    await prisma.account.update({
      where: { id: account.id },
      data: { updatedAt: new Date() }
    })

    res.json({ message: 'Ads synced successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/accounts/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const account = await prisma.account.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    })
    if (!account) return res.status(404).json({ error: 'Account not found' })

    await prisma.account.delete({ where: { id: req.params.id } })
    res.json({ message: 'Account removed' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
