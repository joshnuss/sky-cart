import { json } from '@sveltejs/kit'

export default function (cart) {
  const { publicId: id, token, status, currency, total } = cart

  return json({
    id,
    status: status.toLowerCase(),
    token,
    currency,
    total
  })
}
