import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ContactSubmission } from '@/lib/models/contact'
import { z } from 'zod'

// Validation schema for contact form
const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  topic: z.string().min(1, 'Topic is required').refine(val => val !== '', 'Please select a topic'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the incoming data for debugging
    console.log('Contact form submission data:', body)
    
    // Validate the request body
    const validationResult = contactSchema.safeParse(body)
    
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.errors)
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
    
    const contactData: ContactSubmission = validationResult.data

    // Save to database directly
    const db = await getDatabase()
    const now = new Date()
    const doc = {
      ...contactData,
      status: 'new',
      createdAt: now,
      updatedAt: now
    }

    const result = await db.collection('contacts').insertOne(doc)
    
    // Log the submission (you can add email notification here later)
    console.log('New contact submission:', {
      id: result.insertedId.toString(),
      email: contactData.email,
      topic: contactData.topic,
      timestamp: doc.createdAt
    })
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      id: result.insertedId.toString()
    })
    
  } catch (error) {
    console.error('Contact form submission error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit contact form. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
