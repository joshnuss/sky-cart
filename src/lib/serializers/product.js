import { json } from '@sveltejs/kit'

export function list(products) {
  const data = products.map(productAttributes)

  return json(data)
}

export function details(product) {
  const attributes = productAttributes(product)

  return json(attributes)
}

function productAttributes(product) {
  const { publicId: id, name, description, images, shippable, unitLabel, url } = product

  return {
    id,
    name,
    description,
    images,
    shippable,
    unitLabel,
    url
  }
}
