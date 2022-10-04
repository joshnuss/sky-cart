import { GET, DELETE } from '$routes/cart/[cartId]/+server'
import { getByToken, clear } from '$lib/services/cart'

vi.mock('$lib/services/cart')

describe('GET /cart/:id', () => {
  const params = { cartId: 'cart_12345' }

  test('when id is invalid, returns 401', async () => {
    getByToken.mockResolvedValue(null)

    const request = {
      headers: new Map()
    }

    await expect(GET({ params, request })).rejects.toMatchObject({ status: 401 })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', undefined)
  })

  test('when token is invalid, returns 401', async () => {
    getByToken.mockResolvedValue(null)

    const headers = new Map()
    const request = { headers }

    headers.set('authorization', 'fake-token')

    await expect(GET({ params, request })).rejects.toMatchObject({ status: 401 })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
  })

  test('when id and token are valid, returns cart data', async () => {
    getByToken.mockResolvedValue({
      publicId: 'cart_12345',
      status: 'OPEN'
    })

    const headers = new Map()
    const request = { headers }

    headers.set('authorization', 'fake-token')

    const response = await GET({ params, request })

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      id: 'cart_12345'
    })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
  })
})

describe('DELETE /cart/:id', () => {
  const params = { cartId: 'cart_12345' }

  test('when id is invalid, returns 401', async () => {
    getByToken.mockResolvedValue(null)

    const request = {
      headers: new Map()
    }

    await expect(DELETE({ params, request })).rejects.toMatchObject({ status: 401 })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', undefined)
  })

  test('when token is invalid, returns 401', async () => {
    getByToken.mockResolvedValue(null)

    const headers = new Map()
    const request = { headers }

    headers.set('authorization', 'fake-token')

    await expect(DELETE({ params, request })).rejects.toMatchObject({ status: 401 })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
  })

  test('when id and token are valid, clears cart', async () => {
    getByToken.mockResolvedValue({
      id: 123
    })
    clear.mockResolvedValue({
      publicId: 'cart_12345',
      status: 'OPEN'
    })

    const headers = new Map()
    const request = { headers }

    headers.set('authorization', 'fake-token')

    const response = await DELETE({ params, request })

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      id: 'cart_12345'
    })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
    expect(clear).toHaveBeenCalled()
  })
})
