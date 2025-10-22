import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { adminAuth } from '@/lib/admin-auth'
import { FAQSubmission } from '@/lib/models/faq'
import { z } from 'zod'

// Validation schema for FAQ update
const faqUpdateSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500, 'Question too long').optional(),
  answer: z.string().min(1, 'Answer is required').max(2000, 'Answer too long').optional(),
  order: z.number().min(0, 'Order must be positive').optional(),
  isActive: z.boolean().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate admin
    const authResult = await adminAuth()
    if ('error' in authResult) {
      return authResult
    }
    const { session } = authResult

    const db = await getDatabase()
    const { ObjectId } = await import('mongodb')
    const faq = await db.collection('faqs').findOne({ _id: new ObjectId(params.id) })
    
    if (!faq) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        _id: faq._id?.toString(),
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
        isActive: faq.isActive,
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt,
        createdBy: faq.createdBy,
        updatedBy: faq.updatedBy
      }
    })
    
  } catch (error) {
    console.error('Admin FAQ detail API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch FAQ details' 
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate admin
    const authResult = await adminAuth()
    if ('error' in authResult) {
      return authResult
    }
    const { session } = authResult
    
    const body = await request.json()
    
    // Validate the request body
    const validationResult = faqUpdateSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }
    
    const updateData: Partial<FAQSubmission> = validationResult.data

    const db = await getDatabase()
    const { ObjectId } = await import('mongodb')
    const now = new Date()
    
    // Handle order changes if order is being updated
    if (updateData.order !== undefined) {
      // Get current FAQ to know its old order
      const currentFAQ = await db.collection('faqs').findOne({ _id: new ObjectId(params.id) })
      if (!currentFAQ) {
        return NextResponse.json(
          { error: 'FAQ not found' },
          { status: 404 }
        )
      }
      
      const oldOrder = currentFAQ.order
      const newOrder = updateData.order
      
      if (oldOrder !== newOrder) {
        if (newOrder > oldOrder) {
          // Moving down: shift FAQs between old and new position up
          await db.collection('faqs').updateMany(
            { 
              _id: { $ne: new ObjectId(params.id) },
              order: { $gt: oldOrder, $lte: newOrder }
            },
            { $inc: { order: -1 } }
          )
        } else {
          // Moving up: shift FAQs between new and old position down
          await db.collection('faqs').updateMany(
            { 
              _id: { $ne: new ObjectId(params.id) },
              order: { $gte: newOrder, $lt: oldOrder }
            },
            { $inc: { order: 1 } }
          )
        }
      }
    }
    
    const result = await db.collection('faqs').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: { ...updateData, updatedBy: session.user.email || 'admin', updatedAt: now } },
      { returnDocument: 'after' }
    )
    
    if (!result) {
      return NextResponse.json(
        { error: 'FAQ not found or update failed' },
        { status: 404 }
      )
    }
    
    // Log the update
    console.log('FAQ updated:', {
      faqId: params.id,
      updateData,
      updatedBy: session.user.email,
      timestamp: new Date()
    })
    
    return NextResponse.json({
      success: true,
      message: 'FAQ updated successfully'
    })
    
  } catch (error) {
    console.error('Admin FAQ update API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update FAQ' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate admin
    const authResult = await adminAuth()
    if ('error' in authResult) {
      return authResult
    }
    const { session } = authResult

    const db = await getDatabase()
    const { ObjectId } = await import('mongodb')
    
    // Get the FAQ to know its order before deletion
    const faqToDelete = await db.collection('faqs').findOne({ _id: new ObjectId(params.id) })
    if (!faqToDelete) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      )
    }
    
    const deletedOrder = faqToDelete.order
    
    // Delete the FAQ
    const deleteResult = await db.collection('faqs').deleteOne({ _id: new ObjectId(params.id) })
    
    if (!deleteResult.deletedCount) {
      return NextResponse.json(
        { error: 'FAQ not found or delete failed' },
        { status: 404 }
      )
    }
    
    // Reorder remaining FAQs: shift down all FAQs with order higher than deleted one
    await db.collection('faqs').updateMany(
      { order: { $gt: deletedOrder } },
      { $inc: { order: -1 } }
    )
    
    // Log the deletion
    console.log('FAQ deleted:', {
      faqId: params.id,
      deletedBy: session.user.email,
      timestamp: new Date()
    })
    
    return NextResponse.json({
      success: true,
      message: 'FAQ deleted successfully'
    })
    
  } catch (error) {
    console.error('Admin FAQ delete API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete FAQ' 
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
