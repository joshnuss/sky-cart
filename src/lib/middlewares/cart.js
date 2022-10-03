import { error } from '@sveltejs/kit'
import * as Carts from '$lib/services/cart'

export function authorize(callback) {
  return async ({ request, params }) => {
    const token = request.headers.get('authorization')
    const cart = await Carts.getByToken(params.cartId, token)

    if (!cart) throw error(401)

    return await callback(cart, { request, params })
  }
}
