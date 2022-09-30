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
curl localhost/cart --request=POST
```

### Read cart

```bash
curl localhost/cart --header 'x-cart-token: token'
```

### Add an item

```bash
curl localhost/cart \
  --header 'x-cart-token: token' \
  --data 'product=price_xyz123'
```

### Update an item

```bash
curl localhost/cart/price_xyz123 \
  --request=PATCH \
  --header 'x-cart-token: token' \
  --data 'quantity=2'
```

### Remove an item

```bash
curl localhost/cart/price_xyz123 \
  --request=DELETE \
  --header 'x-cart-token: token' \
```

### Clear the cart

```bash
curl localhost/cart \
  --request=DELETE \
  --header 'x-cart-token: token' \
```

### Checkout

To create a checkout session, post to `/cart/checkout`.

```bash
curl localhost/cart/checkout \
  --request=POST \
  --header 'x-cart-token: token' \
```

### Payment Intent

For a one-click checkout request a payment intent via `/cart/payment-intent`

```bash
curl localhost/cart/payment-intent \
  --request=POST \
  --header 'x-cart-token: token' \
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
2. Configure CORS domain(s) in the `.env`.
3. Setup webooks
4. Sync product & price data by running `pnpm catalog:sync`

## License

MIT
