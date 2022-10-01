import { faker } from '@faker-js/faker'
import { db } from '$lib/services/db'

export function buildProduct(input = {}) {
  return {
    stripeId: `prod_${faker.datatype.string()}`,
    name: faker.commerce.product(),
    active: true,
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
    stripeId: `price_${faker.datatype.string()}`,
    type: 'one_time',
    currency: 'usd',
    billingScheme: 'per_unit',
    taxBehavior: 'unspecified',
    unitAmount: 1200,
    unitAmountDecimal: '1200',
    default: true,
    active: true,
    ...input
  }
}

export async function createPrice(input = {}) {
  return await db.price.create({
    data: buildPrice(input)
  })
}

export function buildCart(input = {}) {
  return {
    publicId: `cart_${faker.datatype.string()}`,
    token: faker.datatype.string(),
    status: 'OPEN',
    currency: 'usd',
    total: 0,
    ...input
  }
}

export async function createCart(input = {}) {
  return await db.cart.create({
    data: buildCart(input)
  })
}

export function buildCartItem(input = {}) {
  return {
    quantity: 1,
    subtotal: 0,
    ...input
  }
}

export async function createCartItem(input = {}) {
  return await db.cartItem.create({
    data: buildCartItem(input)
  })
}
