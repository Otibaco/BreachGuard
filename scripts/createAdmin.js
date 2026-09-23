
require('dotenv').config({ path: '.env.local' })

const dns = require('dns')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Use Google Public DNS for Node.js DNS lookups.
dns.setServers(['8.8.8.8', '8.8.4.4'])


console.log('Node DNS servers:', dns.getServers())

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set')
  process.exit(1)
}

// Use your application's User model.
// Adjust this path if your User model is located elsewhere.
const { User } = require('../models/User')

async function seed() {
  try {
    console.log('Connecting to MongoDB...')

    await mongoose.connect(MONGODB_URI)

    console.log('✅ Connected to MongoDB')

    const email = 'admin@breachguard.com'
    const password = 'Admin1234!' // Change after first login
    const hashed = await bcrypt.hash(password, 12)

    await User.findOneAndUpdate(
      { email },
      {
        username: 'BreachGuard Admin',
        email,
        password: hashed,
        role: 'admin',
      },
      {
        upsert: true,
        new: true,
      }
    )

    console.log('✅ Admin seeded:')
    console.log(`   Email:    ${email}`)
    console.log(`   Password: ${password}`)
    console.log('   ⚠️ Change this password immediately after first login!')
  } finally {
    await mongoose.disconnect()
  }
}

seed().catch((error) => {
  console.error('❌ Failed to seed admin:', error.message)
  process.exit(1)
})
