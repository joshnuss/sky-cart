import { GET } from '$routes/products/[stripeId]/+server'
import { get } from '$lib/services/catalog'

vi.mock('$lib/services/catalog')

describe('GET /products/:stripeId', () => {
  const params = { stripeId: 'prod_1234' }

  test('when found, returns product', async () => {
    get.mockResolvedValue({ stripeId: 'prod_1234', prices: [] })

    const response = await GET({ params })

    expect(response.status).toBe(200)
    expect(await response.json()).toContain({ id: 'prod_1234' })
    expect(get).toHaveBeenCalled()
  })

  test('when not found, returns 404', async () => {
    get.mockResolvedValue(null)

    const response = GET({ params })

    expect(response).rejects.toContain({ status: 404 })
    expect(get).toHaveBeenCalled()
  })
})
