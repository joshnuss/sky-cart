import { error } from '@sveltejs/kit'
import serialize from '$lib/serializers/cart'
import * as Carts from '$lib/services/cart'

export const GET = authorize(async (cart) => {
  return serialize(cart)
})

export const DELETE = authorize(async (cart) => {
  const updated = await Carts.clear(cart)

  return serialize(updated)
})

function authorize(callback) {
  return async ({ request, params }) => {
    const token = request.headers.get('authorization')
    const cart = await Carts.get({
      publicId_token: {
        publicId: params.cartId,
        token
      }
    })

    if (!cart) {
      throw error(401)
    }

    return await callback(cart)
  }
}
