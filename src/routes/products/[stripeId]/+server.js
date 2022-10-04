import { error } from '@sveltejs/kit'
import { details as serialize } from '$lib/serializers/product'
import * as catalog from '$lib/services/catalog'

export async function GET({ params }) {
  const product = await catalog.get(params.stripeId)

  if (!product) throw error(404)

  return serialize(product)
}
