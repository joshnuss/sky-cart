export async function eachPage(object, callback) {
  let count = 0
  let starting_after = undefined

  while (true) {
    const { data, has_more } = await object.list({
      starting_after,
      limit: 20
    })

    await Promise.all(data.map(callback))
    count += data.length

    if (!has_more) break

    starting_after = data.at(-1).id
  }

  return count
}

