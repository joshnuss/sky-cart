import { json } from '@sveltejs/kit'
import * as catalog from '$lib/services/catalog'

export async function GET() {
  const products = await catalog.all()

  return json(products)
}
