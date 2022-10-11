import { GET, DELETE } from '$routes/cart/[cartId]/+server'
import { getByToken, clear } from '$lib/services/cart'
import { request } from 'svelte-kit-test-helpers'

vi.mock('$lib/services/cart')

describe('GET /cart/:id', () => {
  const params = { cartId: 'cart_12345' }

  test('when id is invalid, returns 401', async () => {
    getByToken.mockResolvedValue(null)

    const response = request(GET, { params })

    await expect(response).rejects.toMatchObject({ status: 401 })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', undefined)
  })

  test('when token is invalid, returns 401', async () => {
    getByToken.mockResolvedValue(null)

    const response = request(GET, {
      params,
      headers: {
        authorization: 'fake-token'
      }
    })

    await expect(response).rejects.toMatchObject({ status: 401 })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
  })

  test('when id and token are valid, returns cart data', async () => {
    getByToken.mockResolvedValue({
      publicId: 'cart_12345',
      status: 'OPEN'
    })

    const response = await request(GET, {
      params,
      headers: {
        authorization: 'fake-token'
      }
    })

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

    const response = request(DELETE, { params })

    await expect(response).rejects.toMatchObject({ status: 401 })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', undefined)
  })

  test('when token is invalid, returns 401', async () => {
    getByToken.mockResolvedValue(null)

    const response = request(DELETE, {
      params,
      headers: {
        authorization: 'fake-token'
      }
    })

    await expect(response).rejects.toMatchObject({ status: 401 })

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

    const response = await request(DELETE, {
      params,
      headers: {
        authorization: 'fake-token'
      }
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      id: 'cart_12345'
    })

    expect(getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
    expect(clear).toHaveBeenCalled()
  })
})
