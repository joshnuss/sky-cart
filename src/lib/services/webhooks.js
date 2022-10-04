import { stripe } from './stripe'
import * as sync from '$lib/services/sync'
import * as carts from '$lib/services/cart'

export async function handleProductCreated(id) {
  const product = await stripe.products.retrieve(id)
  await sync.upsertProduct(product)
}

export async function handleProductUpdated(id) {
  const product = await stripe.products.retrieve(id)
  await sync.upsertProduct(product)
}

export async function handleProductDeleted(id) {
  await sync.deleteProduct(id)
}

export async function handlePriceCreated(id) {
  const price = await stripe.prices.retrieve(id)
  await sync.upsertPrice(price)
}

export async function handlePriceUpdated(id) {
  const price = await stripe.prices.retrieve(id)
  await sync.upsertPrice(price)
}

export async function handlePriceDeleted(id) {
  await sync.deletePrice(id)
}

export async function handleCheckoutCompleted(object) {
  const checkoutId = object.id
  const cartId = object.metadata.id

  const cart = await carts.get({ publicId: cartId })

  await carts.markPaid(cart, checkoutId)
}
