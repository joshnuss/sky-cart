import { PATCH, DELETE } from '$routes/cart/[cartId]/[itemId]/+server'
import * as carts from '$lib/services/cart'
import { request } from 'svelte-kit-test-helpers'

vi.mock('$lib/services/cart')

afterEach(() => {
  vi.resetAllMocks()
})

describe('PATCH /cart/:cartId/:itemId', () => {
  const params = { cartId: 'cart_12345', itemId: 'price_1234' }

  test('when cart is not found, returns 401', async () => {
    carts.getByToken.mockResolvedValue(null)

    const response = request(PATCH, {
      params,
      headers: {
        authorization: 'fake-token'
      }
    })

    await expect(response).rejects.toMatchObject({ status: 401 })

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

    const response = await request(PATCH, {
      params,
      headers: {
        authorization: 'fake-token'
      },
      body: { quantity: 2 }
    })

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

    const response = await request(PATCH, {
      params,
      headers: {
        authorization: 'fake-token'
      },
      body: {}
    })

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

    const response = request(DELETE, { params })

    await expect(response).rejects.toMatchObject({ status: 401 })

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

    const response = request(DELETE, {
      params,
      headers: {
        authorization: 'fake-token'
      }
    })

    await expect(response).rejects.toMatchObject({ status: 400 })

    expect(carts.getByToken).toHaveBeenCalledWith('cart_12345', 'fake-token')
    expect(carts.remove).toHaveBeenCalledWith(expect.objectContaining({ id: 123 }), 'price_1234')
  })
})
