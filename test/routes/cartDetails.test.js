import { GET } from '$routes/cart/[id]/+server'
import { get } from '$lib/services/cart'

vi.mock('$lib/services/cart')

describe('GET /cart', () => {
  const params = { id: 'cart_12345' }

  test('when id is invalid, returns 401', async () => {
    get.mockImplementation(async () => null)

    const request = {
      headers: new Map()
    }

    await expect(GET({params, request}))
      .rejects
      .toMatchObject({ status: 401 })

    expect(get).toHaveBeenCalledWith({ publicId: 'cart_12345', token: undefined })
  })

  test('when token is invalid, returns 401', async () => {
    get.mockImplementation(async () => null)

    const headers = new Map()
    const request = { headers }

    headers.set('authorization', 'fake-token')

    await expect(GET({ params, request }))
      .rejects
      .toMatchObject({ status: 401 })

    expect(get).toHaveBeenCalledWith({ publicId: 'cart_12345', token: 'fake-token' })
  })

  test('when id and token is valid, returns cart data', async () => {
    get.mockImplementation(async () => {
      return {
        publicId: 'cart_12345',
        status: 'OPEN'
      }
    })

    const headers = new Map()
    const request = { headers }

    headers.set('authorization', 'fake-token')

    const response = await GET({ params, request })

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      id: 'cart_12345'
    })

    expect(get).toHaveBeenCalledWith({ publicId: 'cart_12345', token: 'fake-token' })
  })
})
