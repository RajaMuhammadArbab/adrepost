const cron = require('node-cron')
const prisma = require('./lib/prisma')

/**
 * Background scheduler — runs every 15 minutes
 * Finds all ads where autoRepost=true and lastRepostAt is older than interval hours
 * In production: launches Puppeteer with DataImpulse proxy to do the actual repost
 */
const startScheduler = () => {
  cron.schedule('*/15 * * * *', async () => {
    console.log('[Scheduler] Running repost job check...')
    try {
      const now = new Date()

      const dueAds = await prisma.ad.findMany({
        where: {
          autoRepost: true,
          status: 'active',
          account: { status: 'active' }
        },
        include: {
          account: {
            include: { user: { select: { id: true, plan: true, credits: true } } }
          }
        }
      })

      let reposted = 0
      for (const ad of dueAds) {
        // Check if interval has passed
        if (ad.lastRepostAt) {
          const hoursElapsed = (now - new Date(ad.lastRepostAt)) / (1000 * 60 * 60)
          if (hoursElapsed < ad.interval) continue
        }

        const user = ad.account.user

        // Check if user has credits (free users need credits)
        if (user.plan === 'FREE' && user.credits < 1) {
          console.log(`[Scheduler] User ${user.id} has no credits, skipping ad ${ad.id}`)
          continue
        }

        try {
          // === PRODUCTION: Replace this block with Puppeteer scraper ===
          // const scraper = require('./scraper')
          // await scraper.repostAd(ad, account.sessionCookie, account.proxyRegion)
          // ==============================================================

          // Simulate repost (remove in production)
          await new Promise(r => setTimeout(r, 100))
          const success = Math.random() > 0.1 // 90% success rate simulation

          await prisma.ad.update({
            where: { id: ad.id },
            data: { lastRepostAt: now }
          })

          await prisma.repostLog.create({
            data: {
              adId: ad.id,
              userId: user.id,
              status: success ? 'success' : 'failed',
              errorMsg: success ? null : 'CAPTCHA challenge failed'
            }
          })

          // Deduct credit if user is on paid plan
          if (user.credits > 0) {
            await prisma.user.update({
              where: { id: user.id },
              data: { credits: { decrement: 1 } }
            })
          }

          reposted++
          console.log(`[Scheduler] Ad "${ad.title}" reposted — ${success ? 'SUCCESS' : 'FAILED'}`)
        } catch (err) {
          console.error(`[Scheduler] Error reposting ad ${ad.id}:`, err.message)
          await prisma.repostLog.create({
            data: {
              adId: ad.id,
              userId: user.id,
              status: 'failed',
              errorMsg: err.message
            }
          })
        }
      }

      console.log(`[Scheduler] Job complete — ${reposted} ads processed`)
    } catch (err) {
      console.error('[Scheduler] Fatal error:', err)
    }
  })

  console.log('[Scheduler] Background repost scheduler started (every 15 min)')
}

module.exports = { startScheduler }
