#!/bin/bash

# Update Stripe Product Metadata Script
# This script reads products from CSV and updates Stripe products with slug and category metadata

set -e  # Exit on error

# Check for Stripe secret key
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ Error: STRIPE_SECRET_KEY environment variable not set"
    echo "   Load it from .env.production.local or set it manually"
    exit 1
fi

CSV_FILE="./products_cleaned.csv"

if [ ! -f "$CSV_FILE" ]; then
    echo "❌ Error: CSV file not found: $CSV_FILE"
    exit 1
fi

echo "======================================================================"
echo "🚀 UPDATING STRIPE PRODUCT METADATA"
echo "======================================================================"
echo ""

# Skip header line and process CSV
UPDATED=0
FAILED=0
SKIPPED=0

tail -n +2 "$CSV_FILE" | while IFS=',' read -r _ _ _ category slug title _ sku _; do
    # Clean fields (remove quotes and whitespace)
    sku=$(echo "$sku" | tr -d '"' | xargs)
    slug=$(echo "$slug" | tr -d '"' | xargs)
    category=$(echo "$category" | tr -d '"' | xargs)

    # Skip empty SKUs
    if [ -z "$sku" ]; then
        continue
    fi

    echo "🔄 Processing SKU: $sku"
    echo "   Slug: $slug"
    echo "   Category: $category"

    # Search for product by SKU metadata
    SEARCH_RESULT=$(curl -s "https://api.stripe.com/v1/products/search" \
        -u "$STRIPE_SECRET_KEY:" \
        -d "query=metadata['sku']:'$sku'" \
        -d "limit=1")

    # Extract product ID using grep and sed
    PRODUCT_ID=$(echo "$SEARCH_RESULT" | grep -o '"id":"prod_[^"]*"' | head -1 | sed 's/"id":"//;s/"//')

    if [ -z "$PRODUCT_ID" ]; then
        echo "   ⚠️  Product not found in Stripe, skipping"
        ((SKIPPED++))
        echo ""
        continue
    fi

    echo "   Found product: $PRODUCT_ID"

    # Update product metadata
    UPDATE_RESULT=$(curl -s "https://api.stripe.com/v1/products/$PRODUCT_ID" \
        -u "$STRIPE_SECRET_KEY:" \
        -d "metadata[sku]=$sku" \
        -d "metadata[slug]=$slug" \
        -d "metadata[category]=$category")

    if echo "$UPDATE_RESULT" | grep -q '"object":"product"'; then
        echo "   ✅ Updated metadata successfully"
        ((UPDATED++))
    else
        echo "   ❌ Failed to update"
        ((FAILED++))
    fi

    echo ""

    # Rate limiting: 100ms delay between requests
    sleep 0.1
done

echo "======================================================================"
echo "📊 UPDATE SUMMARY"
echo "======================================================================"
echo "✅ Updated:  $UPDATED products"
echo "❌ Failed:   $FAILED products"
echo "⏭️  Skipped:  $SKIPPED products"
echo "======================================================================"
echo ""
echo "✨ Metadata update complete!"
echo "   Products should now appear on your website with proper slugs."
echo ""
