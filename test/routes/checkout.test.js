import { POST } from '$routes/cart/[cartId]/checkout/+server'
import * as carts from '$lib/services/cart'
import * as checkout from '$lib/services/checkout'

vi.mock('$lib/services/cart')
vi.mock('$lib/services/checkout')

describe('POST /cart/:id/checkout', () => {
  test('returns checkout', async () => {
    carts.getByToken.mockResolvedValue({
      id: 'cart_1234'
    })
    checkout.create.mockResolvedValue({
      id: 'cs_1234',
      url: 'https://checkout.stripe.com/cs_1234'
    })

    const headers = new Map()
    headers.set('authorization', 'fake-token')
    const response = await POST({ request: { headers }, params: { cartId: 'cart_1234' } })

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      id: 'cs_1234',
      url: 'https://checkout.stripe.com/cs_1234'
    })
    expect(carts.getByToken).toHaveBeenCalledWith('cart_1234', 'fake-token')
    expect(checkout.create).toHaveBeenCalledWith({
      id: 'cart_1234'
    })
  })
})
