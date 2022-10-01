import { GET, DELETE } from '$routes/cart/[cartId]/+server'
import { getByToken, clear } from '$lib/services/cart'

vi.mock('$lib/services/cart')

describe('GET /cart/:id', () => {
  const params = { cartId: 'cart_12345' }

  test('when id is invalid, returns 401', async () => {
    getByToken.mockImplementation(async () => null)

    const request = {
      headers: new Map()
    }

    await expect(GET({ params, request })).rejects.toMatchObject({ status: 401 })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', undefined)
  })

  test('when token is invalid, returns 401', async () => {
    getByToken.mockImplementation(async () => null)

    const headers = new Map()
    const request = { headers }

    headers.set('authorization', 'fake-token')

    await expect(GET({ params, request })).rejects.toMatchObject({ status: 401 })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
  })

  test('when id and token is valid, returns cart data', async () => {
    getByToken.mockImplementation(async () => {
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

    expect(getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
  })
})

describe('DELETE /cart/:id', () => {
  const params = { cartId: 'cart_12345' }

  test('when id is invalid, returns 401', async () => {
    getByToken.mockImplementation(async () => null)

    const request = {
      headers: new Map()
    }

    await expect(DELETE({ params, request })).rejects.toMatchObject({ status: 401 })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', undefined)
  })

  test('when token is invalid, returns 401', async () => {
    getByToken.mockImplementation(async () => null)

    const headers = new Map()
    const request = { headers }

    headers.set('authorization', 'fake-token')

    await expect(DELETE({ params, request })).rejects.toMatchObject({ status: 401 })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
  })

  test('when id and token is valid, clears cart', async () => {
    getByToken.mockImplementation(async () => {
      return {
        id: 123
      }
    })
    clear.mockImplementation(async () => {
      return {
        publicId: 'cart_12345',
        status: 'OPEN'
      }
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
