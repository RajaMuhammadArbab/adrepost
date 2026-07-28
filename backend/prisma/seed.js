const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin1234', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@demo.com',
      password: adminPassword,
      role: 'ADMIN',
      plan: 'AGENCY',
      credits: 9999
    }
  })

  // Create demo user
  const userPassword = await bcrypt.hash('demo1234', 12)
  const demoUser = await prisma.user.upsert({
    where: { email: 'ali@demo.com' },
    update: {},
    create: {
      name: 'Ali Hassan',
      email: 'ali@demo.com',
      password: userPassword,
      role: 'USER',
      plan: 'PRO',
      credits: 150
    }
  })

  // Create demo account for demo user
  const account = await prisma.account.upsert({
    where: { id: 'demo-account-1' },
    update: {},
    create: {
      id: 'demo-account-1',
      userId: demoUser.id,
      username: 'ali_cars_pk',
      site: 'OLX Pakistan',
      proxyRegion: 'US-East (DataImpulse)',
      status: 'active'
    }
  })

  // Create some demo ads
  const ads = [
    { title: 'Honda Civic 2019 Low Mileage', price: 'PKR 42,00,000', category: 'Cars', autoRepost: true, interval: 3 },
    { title: '2BHK Apartment Defence Phase 6', price: 'PKR 1,20,00,000', category: 'Property', autoRepost: true, interval: 6 },
    { title: 'iPhone 15 Pro Max 256GB', price: 'PKR 3,15,000', category: 'Mobiles', autoRepost: false, interval: 12 },
  ]

  for (const ad of ads) {
    await prisma.ad.upsert({
      where: { id: `demo-ad-${ad.title.substring(0, 10)}` },
      update: {},
      create: {
        id: `demo-ad-${ad.title.substring(0, 10)}`,
        accountId: account.id,
        ...ad,
        status: 'active',
        lastRepostAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    })
  }

  console.log('✅ Seed complete!')
  console.log(`   Admin: admin@demo.com / admin1234`)
  console.log(`   User:  ali@demo.com / demo1234`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
