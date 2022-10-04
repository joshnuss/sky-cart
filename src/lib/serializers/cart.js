import { json } from '@sveltejs/kit'
import { productAttributes, priceAttributes } from './product'

export default function (cart, options = {}) {
  const { publicId: id, token, status, currency, total } = cart

  return json({
    id,
    status: status.toLowerCase(),
    token: options.token ? token : undefined,
    currency,
    total,
    items: cart.items?.map(itemAttributes)
  })
}

function itemAttributes(item) {
  const { quantity, subtotal, product, price } = item
  return {
    quantity,
    subtotal,
    product: productAttributes(product),
    price: priceAttributes(price)
  }
}
