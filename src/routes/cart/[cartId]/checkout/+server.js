import { authorize } from '$lib/middlewares/cart'
import serialize from '$lib/serializers/checkout'
import * as Checkout from '$lib/services/checkout'

export const POST = authorize(async (cart) => {
  const checkout = await Checkout.create(cart)

  return serialize(checkout)
})
