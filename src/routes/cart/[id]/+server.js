import { error } from '@sveltejs/kit'
import serialize from '$lib/serializers/cart'
import * as service from '$lib/services/cart'

export const GET = withCart(cart => {
  return serialize(cart)
})

function withCart(callback) {
  return async ({request, params}) => {
    const token = request.headers.get('authorization')
    const cart = await service.get({ publicId: params.id, token })

    if (!cart) {
      throw error(401)
    }

    return callback(cart)
  }
}
