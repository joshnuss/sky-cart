import { list as serialize } from '$lib/serializers/product'
import * as catalog from '$lib/services/catalog'

export async function GET() {
  const products = await catalog.all()

  return serialize(products)
}
