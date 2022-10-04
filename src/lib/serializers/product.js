import { json } from '@sveltejs/kit'

export function list(products) {
  const data = products.map(productAttributes)

  return json(data)
}

export function details(product) {
  const attributes = productAttributes(product)

  return json(attributes)
}

function productAttributes(product) {
  const { stripeId: id, name, description, images, shippable, unitLabel, url } = product
  const prices = product.prices.map(priceAttributes)

  return {
    id,
    name,
    description,
    images,
    shippable,
    unitLabel,
    url,
    prices
  }
}

function priceAttributes(price) {
  const {
    stripeId: id,
    type,
    billingScheme,
    currency,
    nickname,
    recurring,
    taxBehaviour,
    tiers,
    transformQuantity,
    unitAmount,
    unitAmountDecimal,
    customUnitAmount
  } = price

  return {
    id,
    type,
    billingScheme,
    currency,
    nickname,
    recurring,
    taxBehaviour,
    tiers,
    transformQuantity,
    unitAmount,
    unitAmountDecimal,
    customUnitAmount,
    default: price.default
  }
}
