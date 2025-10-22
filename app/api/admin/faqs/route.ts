import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { adminAuth } from '@/lib/admin-auth'
import { FAQSubmission } from '@/lib/models/faq'
import { z } from 'zod'

// Validation schema for FAQ
const faqSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500, 'Question too long'),
  answer: z.string().min(1, 'Answer is required').max(2000, 'Answer too long'),
  order: z.number().min(0, 'Order must be positive'),
  isActive: z.boolean()
})

export async function GET(request: NextRequest) {
  try {
    // Authenticate admin
    const authResult = await adminAuth()
    if ('error' in authResult) {
      return authResult
    }
    const { session } = authResult as { session: any }

    const db = await getDatabase()
    const faqsRaw = await db.collection('faqs')
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray()

    const faqs = faqsRaw.map(faq => ({
      _id: faq._id?.toString(),
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      isActive: faq.isActive,
      createdAt: faq.createdAt,
      updatedAt: faq.updatedAt,
      createdBy: faq.createdBy,
      updatedBy: faq.updatedBy
    }))

    return NextResponse.json({
      success: true,
      data: {
        faqs
      }
    })
    
  } catch (error) {
    console.error('Admin FAQs API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch FAQs' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate admin
    const authResult = await adminAuth()
    if ('error' in authResult) {
      return authResult
    }
    const { session } = authResult as { session: any }
    
    const body = await request.json()
    
    // Validate the request body
    const validationResult = faqSchema.safeParse(body)
    
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
    
    const faqData: FAQSubmission = validationResult.data

    const db = await getDatabase()
    const now = new Date()
    
    // Handle order number logic
    let finalOrder = faqData.order
    
    // If order is 0 or not provided, auto-increment from highest existing order
    if (finalOrder === 0) {
      const highestOrderFAQ = await db.collection('faqs')
        .findOne({}, { sort: { order: -1 } })
      finalOrder = highestOrderFAQ ? highestOrderFAQ.order + 1 : 1
    } else {
      // If order already exists, shift existing FAQs with same or higher order
      await db.collection('faqs').updateMany(
        { order: { $gte: finalOrder } },
        { $inc: { order: 1 } }
      )
    }
    
    const newDoc = {
      question: faqData.question,
      answer: faqData.answer,
      order: finalOrder,
      isActive: faqData.isActive,
      createdBy: session.user.email || 'admin',
      updatedBy: session.user.email || 'admin',
      createdAt: now,
      updatedAt: now
    }

    const insertResult = await db.collection('faqs').insertOne(newDoc)
    const newFAQ = { _id: insertResult.insertedId.toString(), ...newDoc }
    
    // Log the creation
    console.log('FAQ created:', {
      id: newFAQ._id,
      question: faqData.question,
      createdBy: session.user.email,
      timestamp: new Date()
    })
    
    return NextResponse.json({
      success: true,
      message: 'FAQ created successfully',
      data: newFAQ
    })
    
  } catch (error) {
    console.error('Admin FAQ creation API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create FAQ' 
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
