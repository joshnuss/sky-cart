import serialize from '$lib/serializers/cart'
import * as Carts from '$lib/services/cart'

export async function POST() {
  const data = await Carts.create()

  return serialize(data, { token: true })
}
