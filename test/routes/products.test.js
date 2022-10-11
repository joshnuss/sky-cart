import { GET } from '$routes/products/+server'
import { all } from '$lib/services/catalog'
import { request } from 'svelte-kit-test-helpers'

vi.mock('$lib/services/catalog')

describe('GET /products', () => {
  test('returns products', async () => {
    all.mockResolvedValue([{ stripeId: 'prod_1234', prices: [] }])

    const response = await request(GET)

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual([expect.objectContaining({ id: 'prod_1234' })])
    expect(all).toHaveBeenCalled()
  })
})
