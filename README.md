# Sky Cart

Cloud-agnostic shopping cart using Stripe Checkout. Reference design for SvelteKit + Prisma apps.

## Features

- **Cloud-native**: Runs as cloud functions.
- **Cloud-agnostic**: Runs on any cloud. Vercel, Netlify, etc...
- **Headless**: Just an API, can use any frontend you like.
- **Stripe integration**: Uses [Stripe Checkout](https://checkout.stripe.dev) for payment. Uses [Stripe products & prices](https://stripe.com/docs/products-prices/overview) for catalog. Supports one-time and recurring items with tiered pricing.
- **SvelteKit**: Uses [SvelteKit](https://kit.svelte.dev) for defining API.
- **Prisma**: Cart data is stored using [prisma](https://prisma.io). Prisma supports Postgres, MySQL, Mongo and [many more](https://www.prisma.io/docs/reference/database-reference/supported-databases).
- **Vitest**: Fully tested with [vitest](https://vitest.dev).

## Cart API

### Create cart

```bash
curl localhost/cart --request POST
```

### Read cart

```bash
curl localhost/cart/:id --header 'authorization: token'
```

### Add an item

```bash
curl localhost/cart/:id \
  --request POST \
  --header 'authorization: token' \
  --data '{"product": "price_xyz123", "quantity": 2}'
```

### Update an item

```bash
curl localhost/cart/:id/price_xyz123 \
  --request PATCH \
  --header 'authorization: token' \
  --data '{"quantity": 2}'
```

### Remove an item

```bash
curl localhost/cart/:id/price_xyz123 \
  --request DELETE \
  --header 'authorization: token'
```

### Clear the cart

```bash
curl localhost/cart/:id \
  --request DELETE \
  --header 'authorization: token'
```

### Checkout

To create a checkout session, post to `/cart/:id/checkout`.

```bash
curl localhost/cart/:id/checkout \
  --request POST \
  --header 'authorization: token'
```

## Catalog API

Provides access to a replicated copy of your Stripe products and prices. There is no throttling, so you can use databind it to your UI. It may use caching in a future version.

### Retrieve all products

Includes prices.

```bash
curl localhost/products
```

### Retrieve a single product

Includes prices.

```bash
curl localhost/products/prod_1234
```

## Setup

1. Configure `STRIPE_SECRET_KEY` in the `.env`.
2. Copy config `cp config.example.js config.js`
3. Configure settings in `config.js`
4. Setup webooks
5. Sync product & price data by running `pnpm catalog:sync`

## License

MIT
