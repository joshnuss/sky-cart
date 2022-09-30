import { get, add } from '$lib/services/cart'
import { createCart, createCartItem, createProduct, createPrice } from '$test/factories'

describe('get', () => {
  test('returns cart when exists', async () => {
    const cart = createCart()
    const result = get({ token: cart.token })

    expect(result).not.toBeNull()
    expect(result.id).toBe(cart.id)
  })

  test('returns null when not found', async () => {
    const result = await get({ token: 'unknown' })

    expect(result).toBeNull()
  })
})

describe('add', () => {
  test('when line item exists, it updates existing line item', async () => {
    const cart = await createCart({ total: 1000 })
    const product = await createProduct({ stripeId: 'prod_12345' })
    const price = await createPrice({ product: { connect: { id: product.id } }, unitAmount: 1000 })
    let item = await createCartItem({
      cart: {
        connect: { id: cart.id }
      },
      product: {
        connect: { id: product.id }
      },
      price: {
        connect: { id: price.id }
      },
      quantity: 1,
      subtotal: 1000
    })
    const result = await add(cart, 'prod_12345', 2)

    expect(result.success).toBeTruthy()
    expect(result.cart.cartItems).toHaveLength(1)

    item = result.cart.cartItems[0]
    expect(item.productId).toBe(product.id)
    expect(item.priceId).toBe(price.id)
    expect(item.quantity).toBe(3)
    expect(item.subtotal).toBe(3000)
    expect(result.cart.total).toBe(3000)
  })

  test("when line item doesn't exists, adds a new line item", async () => {
    const cart = await createCart()
    const product = await createProduct({ stripeId: 'prod_1234' })
    const price = await createPrice({ product: { connect: { id: product.id } }, unitAmount: 1000 })
    const result = await add(cart, 'prod_1234', 2)

    expect(result.success).toBeTruthy()
    expect(result.cart.cartItems).toHaveLength(1)

    const item = result.cart.cartItems[0]
    expect(item.productId).toBe(product.id)
    expect(item.priceId).toBe(price.id)
    expect(item.quantity).toBe(2)
    expect(item.subtotal).toBe(2000)
    expect(result.cart.total).toBe(2000)
  })

  test('uses price when it exists', async () => {
    const cart = await createCart()
    const product = await createProduct()
    const price = await createPrice({ stripeId: 'price_1234', product: { connect: { id: product.id } }, unitAmount: 1000 })
    const result = await add(cart, 'price_1234', 2)

    expect(result.success).toBeTruthy()
    expect(result.cart.cartItems).toHaveLength(1)

    const item = result.cart.cartItems[0]
    expect(item.productId).toBe(product.id)
    expect(item.priceId).toBe(price.id)
    expect(item.quantity).toBe(2)
    expect(item.subtotal).toBe(2000)
    expect(result.cart.total).toBe(2000)
  })

  test('returns error when quantity is zero', async () => {
    const cart = await createCart()
    const product = await createProduct({ stripeId: 'prod_1234' })
    await createPrice({ product: { connect: { id: product.id } }, unitAmount: 1000 })
    const result = await add(cart, 'prod_1234', 0)

    expect(result.success).toBeFalsy()
    expect(result.errors.quantity).toContain({ invalid: true })
  })

  test('returns error when quantity is less than zero', async () => {
    const cart = await createCart()
    const product = await createProduct({ stripeId: 'prod_1234' })
    await createPrice({ product: { connect: { id: product.id } }, unitAmount: 1000 })
    const result = await add(cart, 'prod_1234', -1)

    expect(result.success).toBeFalsy()
    expect(result.errors).toMatchObject({ quantity: { invalid: true }})
  })

  test('returns error when product is not found', async () => {
    const cart = await createCart()
    const result = await add(cart, 'prod_1234', 1)

    expect(result.success).toBeFalsy()
    expect(result.errors).toMatchObject({ product: { missing: true }})
  })

  test('returns error when price is not found', async () => {
    const cart = await createCart()
    const result = await add(cart, 'price_1234', 1)

    expect(result.success).toBeFalsy()
    expect(result.errors).toMatchObject({price: { missing: true }})
  })
})
