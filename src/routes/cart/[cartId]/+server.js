import { error } from '@sveltejs/kit'
import serialize from '$lib/serializers/cart'
import * as service from '$lib/services/cart'

export const GET = authorize(cart => {
  return serialize(cart)
})

function authorize(callback) {
  return async ({request, params}) => {
    const token = request.headers.get('authorization')
    const cart = await service.get({ publicId: params.cartId, token })

    if (!cart) {
      throw error(401)
    }

    return callback(cart)
  }
}
