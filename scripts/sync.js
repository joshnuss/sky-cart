import { syncProducts, syncPrices } from '$lib/services/sync.js'

const products = await syncProducts()
const prices = await syncPrices()

console.log(`synced ${products} products`)
console.log(`synced ${prices} prices`)
