import { faker } from '@faker-js/faker'
import { db } from '$lib/services/db'

export function buildProduct(input = {}) {
  return {
    stripeId: `prod_${faker.datatype.string()}`,
    name: faker.commerce.product(),
    ...input
  }
}

export async function createProduct(input = {}) {
  return await db.product.create({
    data: buildProduct(input)
  })
}

export function buildPrice(input = {}) {
  return {
    stripeId: `prod_${faker.datatype.string()}`,
    type: 'one_time',
    currency: 'usd',
    taxBehavior: 'unspecified',
    unitAmount: 1200,
    unitAmountDecimal: '1200',
    ...input
  }
}

export async function createPrice(input = {}) {
  return await db.price.create({
    data: buildPrice(input)
  })
}
