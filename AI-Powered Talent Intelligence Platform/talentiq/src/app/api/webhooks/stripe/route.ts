export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const payload = await req.text()
    const sig = req.headers.get('stripe-signature')

    // In a real application, you would verify the Stripe signature:
    // const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    
    // For MVP, we'll just parse the payload
    const event = JSON.parse(payload)

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object
        await prisma.company.update({
          where: { stripeCustomerId: subscription.customer },
          data: {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            // Depending on the product ID in subscription.items.data[0].price.product
            // You would map this to your Plan enum (starter, growth, enterprise)
            // plan: 'growth' 
          }
        })
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        await prisma.company.update({
          where: { stripeCustomerId: subscription.customer },
          data: {
            subscriptionStatus: 'canceled',
            plan: 'starter'
          }
        })
        break
      }
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Stripe webhook error:', error.message)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 })
  }
}
