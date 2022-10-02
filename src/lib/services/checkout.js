import config from '$config'
import { stripe } from './stripe'
import { db } from './db'

export async function create(cart) {
  const { success_url, cancel_url } = config
  const metadata = { id: cart.publicId }

  const items = await db.cartItem.findMany({
    where: { cartId: cart.id },
    include: { price: true }
  })

  return await stripe.checkout.sessions.create({
    success_url,
    cancel_url,
    metadata,
    currency: cart.currency,
    mode: 'payment',
    line_items: items.map(({ price, quantity }) => {
      return {
        price: price.stripeId,
        quantity
      }
    })
  })
}
