import * as sync from '$lib/services/sync'
import * as carts from '$lib/services/cart'
import * as webhooks from '$lib/services/webhooks'
import Stripe from 'stripe'

vi.mock('$lib/services/sync')
vi.mock('$lib/services/cart')
vi.mock('stripe', () => {
  const Stripe = vi.fn()

  Stripe.prototype.products = {
    retrieve: vi.fn()
  }

  Stripe.prototype.prices = {
    retrieve: vi.fn()
  }

  return { default: Stripe }
})

describe('handleProductCreated', () => {
  test('finds & upserts product', async () => {
    Stripe.prototype.products.retrieve.mockResolvedValue({ id: 'prod_1234' })
    sync.upsertProduct.mockResolvedValue()

    await webhooks.handleProductCreated('prod_1234')

    expect(Stripe.prototype.products.retrieve).toHaveBeenCalledWith('prod_1234')
    expect(sync.upsertProduct).toHaveBeenCalledWith({ id: 'prod_1234' })
  })
})

describe('handleProductUpdated', () => {
  test('finds & upserts product', async () => {
    Stripe.prototype.products.retrieve.mockResolvedValue({ id: 'prod_1234' })
    sync.upsertProduct.mockResolvedValue()

    await webhooks.handleProductUpdated('prod_1234')

    expect(Stripe.prototype.products.retrieve).toHaveBeenCalledWith('prod_1234')
    expect(sync.upsertProduct).toHaveBeenCalledWith({ id: 'prod_1234' })
  })
})

describe('handleProductDeleted', () => {
  test('finds & deletes product', async () => {
    Stripe.prototype.products.retrieve.mockResolvedValue({ id: 'prod_1234' })
    sync.upsertProduct.mockResolvedValue()

    await webhooks.handleProductDeleted('prod_1234')

    expect(Stripe.prototype.products.retrieve).toHaveBeenCalledWith('prod_1234')
    expect(sync.upsertProduct).toHaveBeenCalledWith({ id: 'prod_1234' })
  })
})

describe('handlePriceCreated', () => {
  test('finds & upserts price', async () => {
    Stripe.prototype.prices.retrieve.mockResolvedValue({ id: 'price_1234' })
    sync.upsertPrice.mockResolvedValue()

    await webhooks.handlePriceCreated('price_1234')

    expect(Stripe.prototype.prices.retrieve).toHaveBeenCalledWith('price_1234')
    expect(sync.upsertPrice).toHaveBeenCalledWith({ id: 'price_1234' })
  })
})

describe('handlePriceUpdated', () => {
  test('finds & upserts price', async () => {
    Stripe.prototype.prices.retrieve.mockResolvedValue({ id: 'price_1234' })
    sync.upsertPrice.mockResolvedValue()

    await webhooks.handlePriceUpdated('price_1234')

    expect(Stripe.prototype.prices.retrieve).toHaveBeenCalledWith('price_1234')
    expect(sync.upsertPrice).toHaveBeenCalledWith({ id: 'price_1234' })
  })
})

describe('handlePriceDeleted', () => {
  test('finds & deletes price', async () => {
    Stripe.prototype.prices.retrieve.mockResolvedValue({ id: 'price_1234' })
    sync.upsertPrice.mockResolvedValue()

    await webhooks.handlePriceDeleted('price_1234')

    expect(Stripe.prototype.prices.retrieve).toHaveBeenCalledWith('price_1234')
    expect(sync.upsertPrice).toHaveBeenCalledWith({ id: 'price_1234' })
  })
})

describe('handlePriceDeleted', () => {
  test('finds & deletes price', async () => {
    Stripe.prototype.prices.retrieve.mockResolvedValue({ id: 'price_1234' })
    sync.upsertPrice.mockResolvedValue()

    await webhooks.handlePriceDeleted('price_1234')

    expect(Stripe.prototype.prices.retrieve).toHaveBeenCalledWith('price_1234')
    expect(sync.upsertPrice).toHaveBeenCalledWith({ id: 'price_1234' })
  })
})

describe('handleCheckoutCompleted', () => {
  test('finds cart & marks paid', async () => {
    carts.get.mockResolvedValue({ publicId: 'cart_1234' })

    await webhooks.handleCheckoutCompleted({
      id: 'cs_1234',
      metadata: { id: 'cart_1234' }
    })

    expect(carts.get).toHaveBeenCalledWith({ publicId: 'cart_1234' })
    expect(carts.markPaid).toHaveBeenCalledWith({ publicId: 'cart_1234' }, 'cs_1234')
  })
})
