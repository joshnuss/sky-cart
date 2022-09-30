import { db } from './db'

export function get(where) {
  return db.cart.findUnique({
    where,
    include: {
      cartItems: true
    }
  })
}

export async function add(cart, stripeId, quantity = 1) {
  if (quantity <= 0) {
    return fail({ quantity: { invalid: true } })
  }

  let product = null
  let price = null
  const type = stripeId.split('_').at(0)

  if (type == 'prod') {
    product = await db.product.findUnique({ where: { stripeId } })

    if (!product) {
      return fail({ product: { missing: true } })
    }

    price = product
      ? await db.price.findFirst({ where: { productId: product.id, default: true } })
      : null
  } else if (type == 'price') {
    price = await db.price.findUnique({ where: { stripeId }, include: { product: true } })

    if (!price) {
      return fail({ price: { missing: true } })
    }

    product = price.product
  }

  await db.$transaction([
    upsertItem(cart, product, price, quantity),
    updateCart(cart, quantity * price.unitAmount)
  ])

  cart = await get({ id: cart.id })

  return {
    success: true,
    cart
  }
}

function upsertItem(cart, product, price, quantity) {
  return db.cartItem.upsert({
    where: {
      cartId_priceId: {
        cartId: cart.id,
        priceId: price.id
      }
    },
    create: {
      cartId: cart.id,
      productId: product.id,
      priceId: price.id,
      quantity,
      subtotal: quantity * price.unitAmount
    },
    update: {
      quantity: { increment: quantity },
      subtotal: { increment: quantity * price.unitAmount }
    }
  })
}

function updateCart(cart, increment) {
  return db.cart.update({
    where: { id: cart.id },
    data: {
      total: { increment }
    }
  })
}

function fail(errors) {
  return {
    success: false,
    errors
  }
}
