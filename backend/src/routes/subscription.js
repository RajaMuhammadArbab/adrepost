const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const prisma = require('../lib/prisma')
const { protect } = require('../middleware/auth')

const router = express.Router()

const PLANS = {
  STARTER: { priceId: 'price_starter_weekly', credits: 50  },
  PRO:     { priceId: 'price_pro_weekly',     credits: 200 },
  AGENCY:  { priceId: 'price_agency_weekly',  credits: 900 },
}

const CREDIT_PACKS = {
  50:  { price: 300,  priceId: 'price_credits_50'  },
  150: { price: 700,  priceId: 'price_credits_150' },
  400: { price: 1500, priceId: 'price_credits_400' },
}

// POST /api/subscription/checkout  (subscribe to a plan)
router.post('/checkout', protect, async (req, res) => {
  try {
    const { planId } = req.body
    const plan = PLANS[planId]
    if (!plan) return res.status(400).json({ error: 'Invalid plan' })

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/subscription?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/subscription?cancelled=true`,
      metadata: { userId: req.user.id, planId }
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

// POST /api/subscription/buy-credits
router.post('/buy-credits', protect, async (req, res) => {
  try {
    const { credits } = req.body
    const pack = CREDIT_PACKS[credits]
    if (!pack) return res.status(400).json({ error: 'Invalid credit pack' })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price_data: {
        currency: 'usd',
        unit_amount: pack.price,
        product_data: { name: `${credits} AdRepost Credits` }
      }, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/subscription?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/subscription?cancelled=true`,
      metadata: { userId: req.user.id, credits: credits.toString() }
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

// POST /api/webhook/stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { userId, planId, credits } = session.metadata

    if (planId) {
      // Plan subscription
      await prisma.user.update({
        where: { id: userId },
        data: { plan: planId, credits: { increment: PLANS[planId]?.credits || 0 } }
      })
      await prisma.transaction.create({
        data: {
          userId,
          stripeId: session.id,
          amount: session.amount_total / 100,
          description: `${planId} Plan - Weekly`,
          status: 'paid'
        }
      })
    } else if (credits) {
      // Credit pack
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: parseInt(credits) } }
      })
      await prisma.transaction.create({
        data: {
          userId,
          stripeId: session.id,
          amount: session.amount_total / 100,
          credits: parseInt(credits),
          description: `${credits} Credits Pack`,
          status: 'paid'
        }
      })
    }
  }

  res.json({ received: true })
})

module.exports = router
