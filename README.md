# Sky Cart

Cloud-agnostic shopping cart using Stripe products & checkout.

## Features

**Cloud-native**: Runs as cloud functions.
**Cloud-agnostic**: Runs on any cloud. Including Vercel, Netlify, etc...

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
