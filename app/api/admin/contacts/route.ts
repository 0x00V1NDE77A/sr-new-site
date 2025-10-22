import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { adminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Authenticate admin
    const authResult = await adminAuth()
    if ('error' in authResult) {
      return authResult
    }
    const { session } = authResult
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || undefined
    
    const db = await getDatabase()
    const skip = (page - 1) * limit
    const filter: any = status ? { status } : {}

    const [contacts, total, statsAgg] = await Promise.all([
      db.collection('contacts')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('contacts').countDocuments(filter),
      db.collection('contacts').aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray()
    ])

    const stats = { total: 0, new: 0, read: 0, replied: 0, closed: 0 }
    statsAgg.forEach((s: any) => {
      stats[s._id as keyof typeof stats] = s.count
      stats.total += s.count
    })
    
    return NextResponse.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats
      }
    })
    
  } catch (error) {
    console.error('Admin contacts API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch contact submissions' 
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
