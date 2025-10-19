import { NextRequest, NextResponse } from 'next/server'
import { createStripeCheckoutSession } from '@/actions/checkout-actions'
import { getUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json() as { items: any[] }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid items data' },
        { status: 400 }
      )
    }

    // Get current user
    const user = await getUser()
    const userId = user?.id

    // Create Stripe checkout session
    const session = await createStripeCheckoutSession(items, userId)

    if (!session?.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}