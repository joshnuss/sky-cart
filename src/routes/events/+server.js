import { json, error } from '@sveltejs/kit'
import { STRIPE_ENDPOINT_SECRET } from '$env/static/private'
import { stripe } from '$lib/services/stripe'
import * as webhooks from '$lib/services/webhooks'

export async function POST({ request }) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_ENDPOINT_SECRET)
  } catch (err) {
    console.warn('⚠️  Webhook signature verification failed.', err.message)

    throw error(400)
  }

  const id = event.data.object.id

  switch (event.type) {
    case 'product.created':
      await webhooks.handleProductCreated(id)
      break

    case 'product.updated':
      await webhooks.handleProductUpdated(id)
      break

    case 'product.deleted':
      await webhooks.handleProductDeleted(id)
      break

    case 'price.created':
      await webhooks.handlePriceCreated(id)
      break

    case 'price.updated':
      await webhooks.handlePriceUpdated(id)
      break

    case 'price.deleted':
      await webhooks.handlePriceDeleted(id)
      break
  }

  return json()
}
