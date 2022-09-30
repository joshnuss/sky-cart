import { GET } from '$routes/products/+server'
import { all } from '$lib/services/catalog'

vi.mock('$lib/services/catalog')

describe('GET /products', () => {
  test('returns products', async () => {
    all.mockImplementation(async () => [{ id: 1 }])

    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toStrictEqual([{ id: 1 }])
    expect(all).toHaveBeenCalled()
  })
})
