import { PATCH, DELETE } from '$routes/cart/[cartId]/[itemId]/+server'
import * as carts from '$lib/services/cart'

vi.mock('$lib/services/cart')

afterEach(() => {
  vi.resetAllMocks()
})

describe('PATCH /cart/:cartId/:itemId', () => {
  const params = { cartId: 'cart_12345', itemId: 'price_1234' }

  test('when cart is not found, returns 401', async () => {
    carts.getByToken.mockResolvedValue(null)

    const headers = new Map()
    const request = { headers }

    headers.set('authorization', 'fake-token')

    await expect(PATCH({ params, request })).rejects.toMatchObject({ status: 401 })

    expect(carts.getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
    expect(carts.upsert).not.toHaveBeenCalled()
  })

  test('when item is valid, updates cart', async () => {
    carts.getByToken.mockResolvedValue({
      publicId: 'cart_12345'
    })

    carts.upsert.mockResolvedValue({
      success: true,
      cart: {
        publicId: 'cart_12345',
        status: 'OPEN'
      }
    })

    const headers = new Map()
    const request = {
      headers,
      async json() {
        return { quantity: 2 }
      }
    }

    headers.set('authorization', 'fake-token')

    const response = await PATCH({ params, request })

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      id: 'cart_12345'
    })

    expect(carts.getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
    expect(carts.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ publicId: 'cart_12345' }),
      'price_1234',
      2
    )
  })

  test('when no quantity is passed, defaults to 1', async () => {
    carts.getByToken.mockResolvedValue({
      publicId: 'cart_12345'
    })

    carts.upsert.mockResolvedValue({
      success: true,
      cart: {
        publicId: 'cart_12345',
        status: 'OPEN'
      }
    })

    const headers = new Map()
    const request = {
      headers,
      async json() {
        return {}
      }
    }

    headers.set('authorization', 'fake-token')

    const response = await PATCH({ params, request })

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      id: 'cart_12345'
    })

    expect(carts.getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
    expect(carts.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ publicId: 'cart_12345' }),
      'price_1234',
      1
    )
  })
})

describe('DELETE /cart/:cartId/:itemId', () => {
  const params = { cartId: 'cart_12345', itemId: 'price_1234' }

  test('when cart not found, returns 401', async () => {
    carts.getByToken.mockResolvedValue(null)

    const request = {
      headers: new Map()
    }

    await expect(DELETE({ params, request })).rejects.toMatchObject({ status: 401 })

    expect(carts.getByToken).toHaveBeenCalledWith('cart_12345', undefined)
    expect(carts.remove).not.toHaveBeenCalled()
  })

  test('when item is valid, removes item', async () => {
    carts.getByToken.mockResolvedValue({
      id: 123
    })
    carts.remove.mockResolvedValue({
      success: true,
      cart: {
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

    expect(carts.getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
    expect(carts.remove).toHaveBeenCalledWith(expect.objectContaining({ id: 123 }), 'price_1234')
  })

  test('when item is invalid, returns 400', async () => {
    carts.getByToken.mockResolvedValue({
      id: 123
    })
    carts.remove.mockResolvedValue({
      success: false,
      errors: {
        invalid: true
      }
    })

    const headers = new Map()
    const request = { headers }

    headers.set('authorization', 'fake-token')

    await expect(DELETE({ params, request })).rejects.toMatchObject({ status: 400 })

    expect(carts.getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
    expect(carts.remove).toHaveBeenCalledWith(expect.objectContaining({ id: 123 }), 'price_1234')
  })
})
