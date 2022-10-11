import Stripe from 'stripe'
import { POST } from '$routes/events/+server.js'
import * as webhooks from '$lib/services/webhooks'
import { request } from 'svelte-kit-test-helpers'

vi.mock('$lib/services/webhooks')

vi.mock('stripe', () => {
  const Stripe = vi.fn()

  Stripe.prototype.webhooks = {
    constructEvent: vi.fn()
  }

  return { default: Stripe }
})

describe('POST /events', () => {
  test('when signature is invalid, returns 400', async () => {
    Stripe.prototype.webhooks.constructEvent.mockImplementation(() => {
      throw new Error('whoops')
    })

    const response = request(POST, {
      headers: {
        'stripe-signature': 'a-signature'
      },
      body: 'body-text'
    })

    await expect(response).rejects.toMatchObject({ status: 400 })

    expect(Stripe.prototype.webhooks.constructEvent).toHaveBeenCalledWith(
      'body-text',
      'a-signature',
      'webhook-secret'
    )
  })

  describe('when signature is valid', () => {
    const event = {
      headers: {
        'stripe-signature': 'a-signature'
      },
      body: 'body-text'
    }

    test('when event is product.created, calls service & returns 200', async () => {
      webhooks.handleProductCreated.mockResolvedValue()
      Stripe.prototype.webhooks.constructEvent.mockReturnValue({
        type: 'product.created',
        data: {
          object: {
            id: 'prod_1234'
          }
        }
      })

      const response = await request(POST, event)

      expect(response).toMatchObject({ status: 200 })
      expect(webhooks.handleProductCreated).toHaveBeenCalledWith('prod_1234')
    })

    test('when event is product.updated, calls service & returns 200', async () => {
      webhooks.handleProductUpdated.mockResolvedValue()
      Stripe.prototype.webhooks.constructEvent.mockReturnValue({
        type: 'product.updated',
        data: {
          object: {
            id: 'prod_1234'
          }
        }
      })

      const response = await request(POST, event)

      expect(response).toMatchObject({ status: 200 })
      expect(webhooks.handleProductUpdated).toHaveBeenCalledWith('prod_1234')
    })

    test('when event is product.deleted, calls service & returns 200', async () => {
      webhooks.handleProductDeleted.mockResolvedValue()
      Stripe.prototype.webhooks.constructEvent.mockReturnValue({
        type: 'product.deleted',
        data: {
          object: {
            id: 'prod_1234'
          }
        }
      })

      const response = await request(POST, event)

      expect(response).toMatchObject({ status: 200 })
      expect(webhooks.handleProductDeleted).toHaveBeenCalledWith('prod_1234')
    })

    test('when event is price.created, calls service & returns 200', async () => {
      webhooks.handlePriceCreated.mockResolvedValue()
      Stripe.prototype.webhooks.constructEvent.mockReturnValue({
        type: 'price.created',
        data: {
          object: {
            id: 'price_1234'
          }
        }
      })

      const response = await request(POST, event)

      expect(response).toMatchObject({ status: 200 })
      expect(webhooks.handlePriceCreated).toHaveBeenCalledWith('price_1234')
    })

    test('when event is price.updated, calls service & returns 200', async () => {
      webhooks.handlePriceUpdated.mockResolvedValue()
      Stripe.prototype.webhooks.constructEvent.mockReturnValue({
        type: 'price.updated',
        data: {
          object: {
            id: 'price_1234'
          }
        }
      })

      const response = await request(POST, event)

      expect(response).toMatchObject({ status: 200 })
      expect(webhooks.handlePriceUpdated).toHaveBeenCalledWith('price_1234')
    })

    test('when event is price.deleted, calls service & returns 200', async () => {
      webhooks.handlePriceUpdated.mockResolvedValue()
      Stripe.prototype.webhooks.constructEvent.mockReturnValue({
        type: 'price.updated',
        data: {
          object: {
            id: 'price_1234'
          }
        }
      })

      const response = await request(POST, event)

      expect(response).toMatchObject({ status: 200 })
      expect(webhooks.handlePriceUpdated).toHaveBeenCalledWith('price_1234')
    })

    test('when event is checkout.session.completed, calls service & returns 200', async () => {
      webhooks.handleCheckoutCompleted.mockResolvedValue()
      Stripe.prototype.webhooks.constructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_1234',
            metadata: {
              id: 'cart_1234'
            }
          }
        }
      })

      const response = await request(POST, event)

      expect(response).toMatchObject({ status: 200 })
      expect(webhooks.handleCheckoutCompleted).toHaveBeenCalledWith({
        id: 'cs_1234',
        metadata: {
          id: 'cart_1234'
        }
      })
    })
  })
})
