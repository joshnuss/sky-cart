/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
import { Prisma } from '@prisma/client'
import { stripe } from './stripe'
import { db } from './db'

export function syncProducts() {
  return eachPage(stripe.products, upsertProduct)
}

export function syncPrices() {
  return eachPage(stripe.prices, upsertPrice)
}

async function eachPage(object, callback) {
  let count = 0
  let starting_after = undefined

  while (true) {
    const { data, has_more } = await object.list({
      starting_after,
      limit: 20
    })

    await Promise.all(data.map(callback))
    count += data.length

    if (!has_more) break

    starting_after = data.at(-1).id
  }

  return count
}

export function upsertProduct(product) {
  const data = {
    stripeId: product.id,
    name: product.name,
    description: product.description,
    defaultPriceId: product.default_price,
    packageDimensions: product.package_dimensions || Prisma.DbNull,
    images: product.images,
    shippable: product.shippable,
    unitLabel: product.unit_label,
    url: product.url,
    active: product.active
  }

  return db.product.upsert({
    where: { stripeId: product.id },
    create: data,
    update: data
  })
}

export async function upsertPrice(price) {
  const product = await db.product.findUnique({
    where: {
      stripeId: price.product
    }
  })

  const data = {
    stripeId: price.id,
    product: {
      connect: {
        id: product.id
      }
    },
    type: price.type,
    billingScheme: price.billing_scheme,
    currency: price.currency,
    nickname: price.nickname,
    recurring: price.recurring || Prisma.DbNull,
    taxBehavior: price.tax_behavior,
    tiers: price.tiers || [],
    transformQuantity: price.transform_quantity || Prisma.DbNull,
    unitAmount: price.unit_amount,
    unitAmountDecimal: price.unit_amount_decimal,
    customUnitAmount: price.custome_unit_amount,
    default: product.defaultPriceId == price.id,
    active: price.active
  }

  return await db.price.upsert({
    where: { stripeId: price.id },
    create: data,
    update: data
  })
}

export function deleteProduct(stripeId) {
  return db.product.delete({
    where: {
      stripeId
    }
  })
}

export function deletePrice(stripeId) {
  return db.price.delete({
    where: {
      stripeId
    }
  })
}
