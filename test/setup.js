import { installPolyfills } from '@sveltejs/kit/node/polyfills'
import { truncateAll } from 'prisma-database-cleaner'

installPolyfills()

beforeEach(async () => { await truncateAll()})
