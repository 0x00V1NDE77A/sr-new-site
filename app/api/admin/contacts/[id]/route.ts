import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { adminAuth } from '@/lib/admin-auth'
import { z } from 'zod'

// Validation schema for contact status update
const updateContactSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'closed']),
  adminNotes: z.string().optional(),
  repliedBy: z.string().optional()
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
    const { session } = authResult as { session: any }

    const db = await getDatabase()
    const { ObjectId } = await import('mongodb')
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(params.id) })
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: contact
    })
    
  } catch (error) {
    console.error('Admin contact detail API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch contact details' 
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
    const { session } = authResult as { session: any }
    
    const body = await request.json()
    
    // Validate the request body
    const validationResult = updateContactSchema.safeParse(body)
    
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
    
    const { status, adminNotes, repliedBy } = validationResult.data

    const db = await getDatabase()
    const { ObjectId } = await import('mongodb')
    const updateData: any = {
      status,
      updatedAt: new Date()
    }
    if (adminNotes) updateData.adminNotes = adminNotes
    if (status === 'replied') {
      updateData.repliedAt = new Date()
      updateData.repliedBy = repliedBy || session.user.email
    }

    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (!result.modifiedCount) {
      return NextResponse.json(
        { error: 'Contact not found or update failed' },
        { status: 404 }
      )
    }
    
    // Log the update
    console.log('Contact status updated:', {
      contactId: params.id,
      status,
      updatedBy: session.user.email,
      timestamp: new Date()
    })
    
    return NextResponse.json({
      success: true,
      message: 'Contact status updated successfully'
    })
    
  } catch (error) {
    console.error('Admin contact update API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update contact status' 
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
    const { session } = authResult as { session: any }

    const db = await getDatabase()
    const { ObjectId } = await import('mongodb')
    
    // Check if contact exists
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(params.id) })
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Delete the contact
    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(params.id) })
    
    if (!result.deletedCount) {
      return NextResponse.json(
        { error: 'Failed to delete contact' },
        { status: 500 }
      )
    }
    
    // Log the deletion
    console.log('Contact deleted:', {
      contactId: params.id,
      email: contact.email,
      deletedBy: session.user.email,
      timestamp: new Date()
    })
    
    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully'
    })
    
  } catch (error) {
    console.error('Admin contact delete API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete contact' 
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
