import { all, get } from '$lib/services/catalog'
import { createProduct, buildPrice } from '$test/factories'

describe('all()', () => {
  test('returns all products', async () => {
    await createProduct({
      prices: {
        create: buildPrice()
      }
    })

    const products = await all()

    expect(products).toHaveLength(1)

    const product = products[0]
    expect(product.prices).toHaveLength(1)
  })
})

describe('get()', () => {
  test('returns null when not found', async () => {
    const product = await get('prod_1234')

    expect(product).toBeNull()
  })

  test('returns product when found', async () => {
    await createProduct({
      stripeId: 'prod_1234',
      prices: {
        create: buildPrice()
      }
    })

    const product = await get('prod_1234')

    expect(product).not.toBeNull()
    expect(product.stripeId).toBe('prod_1234')
    expect(product.prices).toHaveLength(1)
  })
})
