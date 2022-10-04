#/bin/bash
if pnpm run --silent check-if-empty; then
  echo "database is empty, initializing..."
  # database is empty
  pnpm stripe:sync
else
  echo "database contains data, skipping initialization"
fi
