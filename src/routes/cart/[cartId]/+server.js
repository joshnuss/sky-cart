import { error } from '@sveltejs/kit'
import { authorize } from '$lib/middlewares/cart'
import serialize from '$lib/serializers/cart'
import * as Carts from '$lib/services/cart'

export const GET = authorize((cart) => {
  return serialize(cart)
})

export const POST = authorize(async (cart, {request}) => {
  const input = await request.json()
  const stripeId = input.product || input.price
  const quantity = input.quantity || 1

  const result = await Carts.upsert(cart, stripeId, quantity)

  if (result.errors)
    throw error(400, result.errors)

  return serialize(result.cart)
})

export const DELETE = authorize(async (cart) => {
  const updated = await Carts.clear(cart)

  return serialize(updated)
})
