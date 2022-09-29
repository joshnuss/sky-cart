import { GET } from '$routes/products/[stripeId]/+server'
import { get } from '$lib/services/catalog'

vi.mock('$lib/services/catalog')

describe('GET /products/:stripeId', () => {
  const params = { stripeId: 'prod_1234' }

  test('returns product when found', async () => {
    get.mockImplementation(async () => ({ id: 1 }))

    const response = await GET({ params })

    expect(response.status).toBe(200)
    expect(await response.json()).toContain({ id: 1})
    expect(get).toHaveBeenCalled()
  })

  test('returns 404 when not found', async () => {
    get.mockImplementation(async () => null)

    const response = GET({ params })

    expect(response).rejects.toContain({ status: 404 })
    expect(get).toHaveBeenCalled()
  })
})
