import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    let contactDetails = await db.collection('contactDetails').findOne({})
    // if (!contactDetails) {
    //   const defaultDetails = {
    //     phone: '+359878908741',
    //     email: 'hello@srholding.org',
    //     address: 'Sofia, Bulgaria',
    //     updatedAt: new Date(),
    //     updatedBy: 'system'
    //   }
    //   const result = await db.collection('contactDetails').insertOne(defaultDetails)
    //   contactDetails = { _id: result.insertedId, ...defaultDetails }
    // }
    
    const response = NextResponse.json({
      success: true,
      data: contactDetails ? {
        _id: contactDetails._id?.toString(),
        phone: contactDetails.phone,
        email: contactDetails.email,
        address: contactDetails.address,
        updatedAt: contactDetails.updatedAt,
        updatedBy: contactDetails.updatedBy
      } : null
    })

    // Cache for 5 minutes (300 seconds)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
    
  } catch (error) {
    console.error('Contact details API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch contact details' 
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