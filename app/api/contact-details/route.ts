import { NextResponse } from 'next/server'
import { fetchContactDetailsFromDb, serializeContactDetails } from '@/lib/contact-details'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const contactDetails = await fetchContactDetailsFromDb()

    const response = NextResponse.json({
      success: true,
      data: serializeContactDetails(contactDetails),
    })

    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

    return response
  } catch (error) {
    console.error('Contact details API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contact details',
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}