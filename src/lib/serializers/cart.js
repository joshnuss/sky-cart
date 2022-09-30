import { json } from '@sveltejs/kit'

export default function(data) {
  return json({
    id: data.publicId,
    token: data.token,
    status: data.status.toLowerCase(),
    currency: data.currency,
    total: data.total
  })
}
