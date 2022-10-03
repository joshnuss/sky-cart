import { error } from '@sveltejs/kit'
import { authorize } from '$lib/middlewares/cart'
import serialize from '$lib/serializers/cart'
import * as Carts from '$lib/services/cart'

export const PATCH = authorize(async (cart, { request, params }) => {
  const input = await request.json()
  const quantity = input.quantity || 1

  const result = await Carts.upsert(cart, params.itemId, quantity)

  if (result.errors) throw error(400, result.errors)

  return serialize(result.cart)
})

export const DELETE = authorize(async (cart, { params }) => {
  const result = await Carts.remove(cart, params.itemId)

  if (result.errors) throw error(400, result.errors)

  return serialize(result.cart)
})
