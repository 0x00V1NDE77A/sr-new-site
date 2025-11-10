#!/usr/bin/env tsx

import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { MongoClient } from 'mongodb'

const DEFAULT_EMAIL = 'admin@srholding.org'
const FALLBACK_URI = 'mongodb+srv://srholding:etM0qcWMv1GjKI9f@srholdings.vtmxpss.mongodb.net/?retryWrites=true&w=majority&appName=srholdings'

async function ensureEnvLoaded() {
  try {
    await import('dotenv/config')
  } catch {
    // dotenv is optional; ignore if missing
  }
}

type ParsedArgs = {
  email?: string
  password?: string
}

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2)

  const getValue = (name: string): string | undefined => {
    const exactIndex = args.indexOf(`--${name}`)
    if (exactIndex !== -1 && exactIndex + 1 < args.length) {
      return args[exactIndex + 1]
    }

    const withEquals = args.find((arg) => arg.startsWith(`--${name}=`))
    return withEquals ? withEquals.split('=')[1] : undefined
  }

  return {
    email: getValue('email'),
    password: getValue('password'),
  }
}

function generatePassword(length = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const digits = '0123456789'
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?'
  const pools = [uppercase, lowercase, digits, symbols]
  const all = pools.join('')

  const pick = (pool: string) => pool[crypto.randomInt(0, pool.length)]

  const chars = pools.map(pick)

  while (chars.length < length) {
    chars.push(pick(all))
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }

  return chars.join('')
}

async function setPassword() {
  await ensureEnvLoaded()

  const { email: emailArg, password: passwordArg } = parseArgs()

  const email = (emailArg || DEFAULT_EMAIL).toLowerCase()
  const plainPassword = passwordArg || generatePassword(20)

  const MONGODB_URI = process.env.MONGODB_URI || FALLBACK_URI

  if (!MONGODB_URI) {
    console.error('❌ Missing MongoDB connection string. Set MONGODB_URI.')
    process.exit(1)
  }

  let client: MongoClient | undefined

  try {
    console.log('🔌 Connecting to MongoDB...')
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    })
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db()
    const usersCollection = db.collection('users')

    const hashedPassword = await bcrypt.hash(plainPassword, 12)

    const result = await usersCollection.updateOne(
      { email },
      {
        $set: {
          email,
          password: hashedPassword,
          role: 'admin',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
          lastLogin: null,
        },
      },
      { upsert: true }
    )

    if (result.upsertedCount > 0) {
      console.log('✅ Admin user created with new password')
    } else if (result.modifiedCount > 0) {
      console.log('✅ Admin password updated successfully')
    } else {
      console.log('ℹ️  Admin password unchanged (hash may match existing)')
    }

    console.log('\n📋 Admin credentials:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${plainPassword}`)
    console.log('\n🔒 Store this password securely.')
  } catch (error) {
    console.error('❌ Failed to set admin password')
    if (error instanceof Error) {
      console.error(error.message)
    }
    process.exitCode = 1
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Database connection closed')
    }
  }
}

setPassword()
