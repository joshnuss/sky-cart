import { error, json } from '@sveltejs/kit'
import * as catalog from '$lib/services/catalog'

export async function GET({ params }) {
  const product = await catalog.get(params.stripeId)

  if (!product) throw error(404)

  return json(product)
}
