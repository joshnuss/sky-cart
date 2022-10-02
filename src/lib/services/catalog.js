import { db } from './db'

export function all() {
  return db.product.findMany({
    where: { active: true },
    include: { prices: true }
  })
}

export function get(stripeId) {
  return db.product.findUnique({
    where: { stripeId },
    include: { prices: true }
  })
}
