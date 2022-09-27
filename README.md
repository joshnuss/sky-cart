# Sky Cart

Cloud-agnostic shopping cart using Stripe Checkout.

## Features

- **Cloud-native**: Runs as cloud functions.
- **Cloud-agnostic**: Runs on any cloud. Including Vercel, Netlify, etc...
- **Headless**: Just an API, can use any frontend you like.
- **Stripe**: Uses [Stripe Checkout](https://checkout.stripe.dev) for payment. Uses [Stripe Products & prices](https://stripe.com/docs/products-prices/overview) for catalog.
- **SvelteKit**: Uses to [SvelteKit](https://kit.svelte.dev) for defining API.
- **Prisma**: Cart data is stored using [prisma](https://prisma.io).
- **Vitest**: Fully tested with [vitest](https://vitest.dev).

## API

### Read cart

```bash
curl localhost/cart --header 'x-cart-token: token'
```

### Add an item

```bash
curl localhost/cart \
  --header 'x-cart-token: token' \
  --data 'product=prod_xyz123'
```

### Update an item

```bash
curl localhost/cart/prod_xyz123 \
  --request=PATCH \
  --header 'x-cart-token: token' \
  --data 'quantity=2'
```

### Remove an item

```bash
curl localhost/cart/prod_xyz123 \
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

```bash
curl localhost/cart/checkout \
  --request=POST \
  --header 'x-cart-token: token' \
```

## License

MIT
