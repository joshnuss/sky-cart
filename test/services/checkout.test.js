import { create } from '$lib/services/checkout'
import Stripe from 'stripe'
import { createCart, createCartItem, createProduct, createPrice } from '$test/factories'

vi.mock('stripe', () => {
  const Stripe = vi.fn()

  Stripe.prototype.checkout = {
    sessions: {
      create: vi.fn()
    }
  }

  return { default: Stripe }
})

describe('create', () => {
  test('returns checkout object', async () => {
    Stripe.prototype.checkout.sessions.create.mockImplementationOnce(async (input) => {
      expect(input.success_url).toBe('http://mysite.co/success')
      expect(input.cancel_url).toBe('http://mysite.co/cancel')
      expect(input.currency).toBe('usd')
      expect(input.mode).toBe('payment')
      expect(input.line_items).toStrictEqual([
        { price: 'price_12345', quantity: 2 }
      ])
      expect(input.metadata).toMatchObject({
        id: `cart_12345`
      })

      return { id: 'cs_1234' }
    })

    const cart = await createCart({ publicId: `cart_12345` })
    const product = await createProduct({ stripeId: 'prod_12345' })
    const price = await createPrice({ stripeId: 'price_12345', product: { connect: { id: product.id } } })
    await createCartItem({
      cart: {
        connect: { id: cart.id }
      },
      product: {
        connect: { id: product.id }
      },
      price: {
        connect: { id: price.id }
      },
      quantity: 2
    })

    const checkout = await create(cart)

    expect(checkout).not.toBeNull()
    expect(checkout.id).toBe('cs_1234')
  })
})
