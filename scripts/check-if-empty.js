import { db } from '$lib/services/db'

const productCount = await db.product.count()

if (productCount == 0) process.exit(0)

process.exit(1)
