import { get } from '$lib/services/cart'
import { createCart } from '$test/factories'

describe('get', () => {
  test('returns cart when exists', async () => {
    const cart = createCart()
    const result = get(cart.token)

    expect(result).not.toBeNull()
    expect(result.id).toBe(cart.id)
  })

  test('returns null when not found', async () => {
    const result = await get('unknown')

    expect(result).toBeNull()
  })
})
