import { db } from './db'

export async function all() {
  return await db.product.findMany({
    include: { prices: true }
  })
}

export async function get(stripeId) {
  return await db.product.findUnique({
    where: { stripeId },
    include: { prices: true }
  })
}
