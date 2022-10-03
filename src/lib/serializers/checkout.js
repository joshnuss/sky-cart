import { json } from '@sveltejs/kit'

export default function (checkout) {
  const { id, url } = checkout

  return json({ id, url })
}
