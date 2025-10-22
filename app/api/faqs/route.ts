import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    
    const faqs = await db.collection('faqs')
      .find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .toArray()
    
    const formattedFAQs = faqs.map(faq => ({
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
      data: formattedFAQs
    })
    
  } catch (error) {
    console.error('FAQs API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch FAQs' 
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
