import { POST } from '$routes/cart/+server'
import { create } from '$lib/services/cart'
import { request } from 'svelte-kit-test-helpers'

vi.mock('$lib/services/cart')

describe('POST /cart', () => {
  test('returns cart', async () => {
    create.mockResolvedValue({
      publicId: 'cart_1234',
      currency: 'usd',
      token: 'abcd123',
      status: 'OPEN',
      total: 0
    })

    const response = await request(POST)

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      id: 'cart_1234',
      token: 'abcd123',
      status: 'open',
      currency: 'usd',
      total: 0
    })
    expect(create).toHaveBeenCalled()
  })
})
