import { json } from '@sveltejs/kit'
import * as cart from '$lib/services/cart'

export async function POST() {
  const data = await cart.create()

  return json({
    id: data.publicId,
    token: data.token,
    status: data.status.toLowerCase(),
    currency: data.currency,
    total: data.total
  })
}
