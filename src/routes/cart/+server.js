import serialize from '$lib/serializers/cart'
import * as cart from '$lib/services/cart'

export async function POST() {
  const data = await cart.create()

  return serialize(data)
}
