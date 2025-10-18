#!/bin/bash

# Load environment variables from .env.local
set -a
source .env.local
set +a

# Run the sync script with all arguments passed through
node scripts/sync-stripe-products.js "$@"
