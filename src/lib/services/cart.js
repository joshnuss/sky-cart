import { nanoid } from 'nanoid'
import config from '$config'
import { db } from './db'
import { success, fail } from './result'

export function get(where) {
  return db.cart.findUnique({
    where,
    include: {
      items: true
    }
  })
}

export function getByToken(publicId, token) {
  return get({
    publicId_token: {
      publicId,
      token
    }
  })
}

export async function create() {
  return db.cart.create({
    data: {
      currency: config.currency,
      publicId: `cart_${nanoid(20)}`,
      token: nanoid(40),
      status: 'OPEN',
      total: 0
    }
  })
}

export async function clear(cart) {
  await db.cart.update({
    where: { id: cart.id },
    data: {
      items: {
        deleteMany: {}
      },
      total: 0
    }
  })

  return await get({ id: cart.id })
}

export async function upsert(cart, stripeId, quantity = 1) {
  if (quantity <= 0) {
    return fail({ quantity: { invalid: true } })
  }

  const { type, product, price } = await getObjects(stripeId)

  if (type == 'prod' && !product) {
    return fail({ product: { missing: true } })
  } else if (type == 'price' && !price) {
    return fail({ price: { missing: true } })
  }

  await db.cart.update({
    where: { id: cart.id },
    data: {
      total: {
        increment: quantity * price.unitAmount
      },
      items: {
        upsert: {
          where: {
            cartId_priceId: {
              cartId: cart.id,
              priceId: price.id
            }
          },
          create: {
            productId: product.id,
            priceId: price.id,
            quantity,
            subtotal: quantity * price.unitAmount
          },
          update: {
            quantity: { increment: quantity },
            subtotal: { increment: quantity * price.unitAmount }
          }
        }
      }
    }
  })

  cart = await get({ id: cart.id })

  return success({ cart })
}

export async function remove(cart, stripeId) {
  const { type, product, price } = await getObjects(stripeId)

  if (type == 'prod' && !product) {
    return fail({ product: { missing: true } })
  } else if (type == 'price' && !price) {
    return fail({ price: { missing: true } })
  }

  const item = await getItem(cart, price)

  if (!item) {
    return fail({ item: { missing: true } })
  }

  await db.cart.update({
    where: { id: cart.id },
    data: {
      total: {
        decrement: item.subtotal
      },
      items: {
        delete: {
          id: item.id
        }
      }
    }
  })

  cart = await get({ id: cart.id })

  return success({ cart })
}

function getItem(cart, price) {
  return db.cartItem.findUnique({
    where: {
      cartId_priceId: {
        cartId: cart.id,
        priceId: price.id
      }
    }
  })
}

async function getObjects(stripeId) {
  let product = null
  let price = null
  const type = stripeId.split('_').at(0)

  if (type == 'prod') {
    product = await db.product.findUnique({ where: { stripeId } })

    if (product) {
      price = await db.price.findFirst({ where: { productId: product.id, default: true } })
    }
  } else if (type == 'price') {
    price = await db.price.findUnique({ where: { stripeId }, include: { product: true } })

    if (price) {
      product = price.product
    }
  }

  return { type, product, price }
}
