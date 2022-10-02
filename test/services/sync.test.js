import {
  syncProducts,
  syncPrices,
  upsertProduct,
  upsertPrice,
  deleteProduct,
  deletePrice
} from '$lib/services/sync'
import { db } from '$lib/services/db'
import Stripe from 'stripe'
import { createProduct, createPrice } from '$test/factories'

vi.mock('stripe', () => {
  const Stripe = vi.fn()

  Stripe.prototype.products = {
    list: vi.fn()
  }

  Stripe.prototype.prices = {
    list: vi.fn()
  }

  return { default: Stripe }
})

describe('syncProducts', () => {
  test('adds new products', async () => {
    Stripe.prototype.products.list.mockImplementationOnce(async () => {
      return {
        has_more: false,
        data: [
          {
            id: 'prod_1234',
            name: 'product-name',
            description: 'example description',
            default_price: 'price_1234',
            images: ['http://imgur.com/cat.png'],
            active: true,
            shippable: true,
            url: 'https://cat-pictures.tld/product'
          }
        ]
      }
    })

    const count = await syncProducts()
    const product = await db.product.findUnique({ where: { stripeId: 'prod_1234' } })

    expect(count).toBe(1)
    expect(product).not.toBeNull()
    expect(product.id).not.toBeNull()
    expect(product.name).toBe('product-name')
    expect(product.description).toBe('example description')
    expect(product.defaultPriceId).toBe('price_1234')
    expect(product.images).toStrictEqual(['http://imgur.com/cat.png'])
    expect(product.active).toBe(true)
    expect(product.shippable).toBe(true)
    expect(product.url).toBe('https://cat-pictures.tld/product')
  })

  test('updates existing products', async () => {
    const existing = await createProduct({ stripeId: 'prod_1234' })

    Stripe.prototype.products.list.mockImplementationOnce(async () => {
      return {
        has_more: false,
        data: [
          {
            id: 'prod_1234',
            name: 'product-name',
            description: 'example description',
            default_price: 'price_1234',
            images: ['http://imgur.com/cat.png'],
            active: true,
            shippable: true,
            url: 'https://cat-pictures.tld/product'
          }
        ]
      }
    })

    const count = await syncProducts()
    const product = await db.product.findUnique({ where: { stripeId: 'prod_1234' } })

    expect(count).toBe(1)
    expect(product).not.toBeNull()
    expect(product.id).toBe(existing.id)
    expect(product.name).toBe('product-name')
    expect(product.description).toBe('example description')
    expect(product.defaultPriceId).toBe('price_1234')
    expect(product.images).toStrictEqual(['http://imgur.com/cat.png'])
    expect(product.active).toBe(true)
    expect(product.shippable).toBe(true)
    expect(product.url).toBe('https://cat-pictures.tld/product')
  })

  test('handles multiple pages', async () => {
    const productData = {
      id: 'prod_1234',
      name: 'product-name',
      description: 'example description',
      default_price: 'price_1234',
      images: ['http://imgur.com/cat.png'],
      active: true,
      shippable: true,
      url: 'https://cat-pictures.tld/product'
    }

    Stripe.prototype.products.list.mockImplementationOnce(async () => {
      return {
        has_more: true,
        data: [productData, { ...productData, id: 'prod_12345' }]
      }
    })
    Stripe.prototype.products.list.mockImplementationOnce(async () => {
      return {
        has_more: true,
        data: [{ ...productData, id: 'prod_123456' }]
      }
    })
    Stripe.prototype.products.list.mockImplementationOnce(async () => {
      return {
        has_more: false,
        data: [{ ...productData, id: 'prod_1234567' }]
      }
    })

    const count = await syncProducts()
    expect(count).toBe(4)
  })
})

describe('syncPrices', () => {
  let product

  beforeEach(async () => {
    product = await createProduct({ stripeId: 'prod_1234' })
  })

  test('adds new prices', async () => {
    Stripe.prototype.prices.list.mockImplementationOnce(async () => {
      return {
        has_more: false,
        data: [
          {
            id: 'price_1234',
            product: 'prod_1234',
            type: 'one_time',
            billing_scheme: 'per_unit',
            currency: 'usd',
            nickname: 'basic',
            tax_behavior: 'unspecified',
            unit_amount: 1099,
            active: true
          }
        ]
      }
    })

    const count = await syncPrices()
    const price = await db.price.findUnique({ where: { stripeId: 'price_1234' } })

    expect(count).toBe(1)
    expect(price).not.toBeNull()
    expect(price.id).not.toBeNull()
    expect(price.productId).toBe(product.id)
    expect(price.type).toBe('one_time')
    expect(price.billingScheme).toBe('per_unit')
    expect(price.currency).toBe('usd')
    expect(price.nickname).toBe('basic')
    expect(price.taxBehavior).toBe('unspecified')
    expect(price.unitAmount).toBe(1099)
    expect(price.active).toBe(true)
  })

  test('updates existing prices', async () => {
    const existing = await createPrice({
      stripeId: 'price_1234',
      product: { connect: { id: product.id } }
    })

    Stripe.prototype.prices.list.mockImplementationOnce(async () => {
      return {
        has_more: false,
        data: [
          {
            id: 'price_1234',
            product: 'prod_1234',
            type: 'one_time',
            billing_scheme: 'per_unit',
            currency: 'usd',
            nickname: 'basic',
            tax_behavior: 'unspecified',
            unit_amount: 1099,
            active: true
          }
        ]
      }
    })

    const count = await syncPrices()
    const price = await db.price.findUnique({ where: { stripeId: 'price_1234' } })

    expect(count).toBe(1)
    expect(price).not.toBeNull()
    expect(price.id).toBe(existing.id)
    expect(price.productId).toBe(product.id)
    expect(price.type).toBe('one_time')
    expect(price.billingScheme).toBe('per_unit')
    expect(price.currency).toBe('usd')
    expect(price.nickname).toBe('basic')
    expect(price.taxBehavior).toBe('unspecified')
    expect(price.unitAmount).toBe(1099)
    expect(price.active).toBe(true)
  })

  test('handles multiple pages', async () => {
    const priceData = {
      id: 'price_1234',
      product: 'prod_1234',
      type: 'one_time',
      billing_scheme: 'per_unit',
      currency: 'usd',
      nickname: 'basic',
      tax_behavior: 'unspecified',
      unit_amount: 1099,
      active: true
    }

    Stripe.prototype.prices.list.mockImplementationOnce(async () => {
      return {
        has_more: true,
        data: [priceData, { ...priceData, id: 'price_12345' }]
      }
    })
    Stripe.prototype.prices.list.mockImplementationOnce(async () => {
      return {
        has_more: true,
        data: [{ ...priceData, id: 'price_123456' }]
      }
    })
    Stripe.prototype.prices.list.mockImplementationOnce(async () => {
      return {
        has_more: false,
        data: [{ ...priceData, id: 'price_1234567' }]
      }
    })

    const count = await syncPrices()
    expect(count).toBe(4)
  })
})

describe('upsertProduct', () => {
  test('creates new product', async () => {
    await upsertProduct({
      id: 'prod_1234',
      name: 'product-name',
      description: 'example description',
      default_price: 'price_1234',
      images: ['http://imgur.com/cat.png'],
      active: true,
      shippable: true,
      url: 'https://cat-pictures.tld/product'
    })

    const product = await db.product.findUnique({ where: { stripeId: 'prod_1234' } })

    expect(product).not.toBeNull()
    expect(product.id).not.toBeNull()
    expect(product.name).toBe('product-name')
    expect(product.description).toBe('example description')
    expect(product.defaultPriceId).toBe('price_1234')
    expect(product.images).toStrictEqual(['http://imgur.com/cat.png'])
    expect(product.active).toBe(true)
    expect(product.shippable).toBe(true)
    expect(product.url).toBe('https://cat-pictures.tld/product')
  })

  test('updates existing products', async () => {
    const existing = await createProduct({ stripeId: 'prod_1234' })

    await upsertProduct({
      id: 'prod_1234',
      name: 'product-name2',
      description: 'example description2',
      default_price: 'price_1234',
      images: ['http://imgur.com/cat2.png'],
      active: false,
      shippable: true,
      url: 'https://cat-pictures.tld/product2'
    })

    const product = await db.product.findUnique({ where: { stripeId: 'prod_1234' } })

    expect(product).not.toBeNull()
    expect(product.id).toBe(existing.id)
    expect(product.name).toBe('product-name2')
    expect(product.description).toBe('example description2')
    expect(product.defaultPriceId).toBe('price_1234')
    expect(product.images).toStrictEqual(['http://imgur.com/cat2.png'])
    expect(product.active).toBe(false)
    expect(product.shippable).toBe(true)
    expect(product.url).toBe('https://cat-pictures.tld/product2')
  })
})

describe('upsertPrice', () => {
  let product

  beforeEach(async () => {
    product = await createProduct({ stripeId: 'prod_1234' })
  })

  test('creates new price', async () => {
    await upsertPrice({
      id: 'price_1234',
      product: 'prod_1234',
      type: 'one_time',
      billing_scheme: 'per_unit',
      currency: 'usd',
      nickname: 'basic',
      tax_behavior: 'unspecified',
      unit_amount: 1099,
      active: true
    })

    const price = await db.price.findUnique({ where: { stripeId: 'price_1234' } })

    expect(price).not.toBeNull()
    expect(price.id).not.toBeNull()
    expect(price.productId).toBe(product.id)
    expect(price.type).toBe('one_time')
    expect(price.billingScheme).toBe('per_unit')
    expect(price.currency).toBe('usd')
    expect(price.nickname).toBe('basic')
    expect(price.taxBehavior).toBe('unspecified')
    expect(price.unitAmount).toBe(1099)
    expect(price.active).toBe(true)
  })

  test('updates existing price', async () => {
    const existing = await createPrice({
      stripeId: 'price_1234',
      product: { connect: { id: product.id } }
    })

    await upsertPrice({
      id: 'price_1234',
      product: 'prod_1234',
      type: 'one_time',
      billing_scheme: 'per_unit',
      currency: 'usd',
      nickname: 'basic',
      tax_behavior: 'unspecified',
      unit_amount: 1099,
      active: false
    })

    const price = await db.price.findUnique({ where: { stripeId: 'price_1234' } })

    expect(price).not.toBeNull()
    expect(price.id).toBe(existing.id)
    expect(price.productId).toBe(product.id)
    expect(price.type).toBe('one_time')
    expect(price.billingScheme).toBe('per_unit')
    expect(price.currency).toBe('usd')
    expect(price.nickname).toBe('basic')
    expect(price.taxBehavior).toBe('unspecified')
    expect(price.unitAmount).toBe(1099)
    expect(price.active).toBe(false)
  })
})

describe('deleteProduct', () => {
  test('deletes existing product', async () => {
    await createProduct({ stripeId: 'prod_1234' })

    await deleteProduct('prod_1234')

    const product = await db.product.findUnique({ where: { stripeId: 'prod_1234' } })

    expect(product).toBeNull()
  })
})

describe('deletePrice', () => {
  test('deletes existing price', async () => {
    const product = await createProduct()
    await createPrice({
      stripeId: 'price_1234',
      product: { connect: { id: product.id } }
    })

    await deletePrice('price_1234')

    const price = await db.price.findUnique({ where: { stripeId: 'price_1234' } })

    expect(price).toBeNull()
  })
})
