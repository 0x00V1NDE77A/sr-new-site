import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { adminAuth } from '@/lib/admin-auth'
import { IContactDetails } from '@/lib/models/contact-details'
import { z } from 'zod'

// Validation schema for contact details
const contactDetailsSchema = z.object({
  phone: z.string().min(1, 'Phone number is required').max(50, 'Phone number too long'),
  email: z.string().email('Invalid email address'),
  address: z.string().max(500, 'Address too long').optional()
})

export async function GET(request: NextRequest) {
  try {
    // Authenticate admin
    const authResult = await adminAuth()
    if ('error' in authResult) {
      return authResult
    }

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

    return NextResponse.json({
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
    
  } catch (error) {
    console.error('Admin contact details API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch contact details' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authenticate admin
    const authResult = await adminAuth()
    if ('error' in authResult) {
      return authResult
    }
    
    // Type guard to ensure we have session
    if (!('session' in authResult)) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }
    
    const { session } = authResult

    const body = await request.json()
    
    // Validate the request body
    const validationResult = contactDetailsSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    const contactData: Omit<IContactDetails, '_id' | 'updatedAt' | 'updatedBy'> = validationResult.data

    const db = await getDatabase()
    const updateData = {
      ...contactData,
      updatedAt: new Date(),
      updatedBy: session.user.email || 'admin'
    }

    const result = await db.collection('contactDetails').findOneAndUpdate(
      {},
      { $set: updateData },
      { upsert: true, returnDocument: 'after' }
    )
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to update contact details' },
        { status: 500 }
      )
    }
    
    // Log the update
    console.log('Contact details updated:', {
      updatedBy: session.user.email,
      timestamp: new Date(),
      data: contactData
    })
    
    return NextResponse.json({
      success: true,
      message: 'Contact details updated successfully',
      data: {
        _id: result._id?.toString(),
        phone: result.phone || '',
        email: result.email || '',
        address: result.address || '',
        updatedAt: result.updatedAt || new Date(),
        updatedBy: result.updatedBy || 'admin'
      }
    })
    
  } catch (error) {
    console.error('Admin contact details update API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update contact details' 
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
