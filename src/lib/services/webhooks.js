import { stripe } from './stripe'
import { upsertProduct, upsertPrice, deleteProduct, deletePrice } from '$lib/services/sync'

export async function handleProductCreated(id) {
  const product = await stripe.products.retrieve(id)
  await upsertProduct(product)
}

export async function handleProductUpdated(id) {
  const product = await stripe.products.retrieve(id)
  await upsertProduct(product)
}

export async function handleProductDeleted(id) {
  await deleteProduct(id)
}

export async function handlePriceCreated(id) {
  const price = await stripe.prices.retrieve(id)
  await upsertPrice(price)
}

export async function handlePriceUpdated(id) {
  const price = await stripe.prices.retrieve(id)
  await upsertPrice(price)
}

export async function handlePriceDeleted(id) {
  await deletePrice(id)
}
