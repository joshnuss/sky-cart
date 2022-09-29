import { db } from './db'

export function get(token) {
  return db.cart.findUnique({
    where: { token }
  })
}
