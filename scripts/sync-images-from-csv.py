#!/usr/bin/env python3
"""
Sync Images from CSV to Stripe Products

Properly parses CSV and adds missing images to Stripe products
"""

import csv
import os
import stripe
import time
from dotenv import load_dotenv

load_dotenv()

# Initialize Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

CSV_FILE = './products_Oct-10_05-30-12PM.csv'

def parse_csv():
    """Parse CSV and extract products with images"""
    products_with_images = []
    
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        next(reader)  # Skip header
        
        for row in reader:
            if len(row) < 7:
                continue
            
            name = row[3].strip()
            sku = row[5].strip()
            image_url = row[6].strip()
            
            if image_url and image_url.startswith('http'):
                products_with_images.append({
                    'name': name,
                    'sku': sku,
                    'image_url': image_url
                })
    
    return products_with_images

def clean_name(name):
    """Clean product name for matching"""
    import re
    # Remove special characters and normalize spaces
    cleaned = re.sub(r'[^\w\s]', '', name.lower())
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def main():
    print("🔍 Parsing CSV file...\n")
    csv_products = parse_csv()
    print(f"✅ Found {len(csv_products)} products with images in CSV\n")
    
    if len(csv_products) == 0:
        print("⚠️  No products with images found in CSV\n")
        return
    
    print("🔍 Fetching all active products from Stripe...\n")
    
    # Fetch all active Stripe products
    stripe_products = []
    starting_after = None
    
    while True:
        params = {'limit': 100, 'active': True}
        if starting_after:
            params['starting_after'] = starting_after
        
        response = stripe.Product.list(**params)
        stripe_products.extend(response.data)
        
        if not response.has_more:
            break
        if response.data:
            starting_after = response.data[-1].id
    
    print(f"✅ Found {len(stripe_products)} active products in Stripe\n")
    
    # Create name lookup dictionary for Stripe products
    stripe_lookup = {}
    for product in stripe_products:
        cleaned = clean_name(product.name)
        stripe_lookup[cleaned] = product
    
    # Match CSV products with Stripe products
    updates = []
    
    for csv_product in csv_products:
        csv_name_clean = clean_name(csv_product['name'])
        
        # Try exact match first
        if csv_name_clean in stripe_lookup:
            stripe_product = stripe_lookup[csv_name_clean]
            has_image = stripe_product.images and len(stripe_product.images) > 0
            has_correct_image = has_image and csv_product['image_url'] in stripe_product.images
            
            if not has_correct_image:
                updates.append({
                    'product': stripe_product,
                    'image_url': csv_product['image_url'],
                    'has_current_image': has_image
                })
        else:
            # Try partial match (first 40 chars)
            csv_name_partial = csv_name_clean[:40]
            for stripe_name_clean, stripe_product in stripe_lookup.items():
                if csv_name_partial in stripe_name_clean or stripe_name_clean[:40] in csv_name_partial:
                    has_image = stripe_product.images and len(stripe_product.images) > 0
                    has_correct_image = has_image and csv_product['image_url'] in stripe_product.images
                    
                    if not has_correct_image:
                        updates.append({
                            'product': stripe_product,
                            'image_url': csv_product['image_url'],
                            'has_current_image': has_image
                        })
                    break
    
    print("=" * 80)
    print("📊 IMAGE UPDATE PLAN")
    print("=" * 80)
    print(f"\n📷 Products to update: {len(updates)}")
    print(f"✅ Already correct: {len(csv_products) - len(updates)}")
    
    if len(updates) == 0:
        print("\n✅ All products already have correct images!\n")
        return
    
    print("\n" + "=" * 80)
    print(f"📷 PRODUCTS TO UPDATE (showing first 20):")
    print("=" * 80)
    
    for i, item in enumerate(updates[:20]):
        status = "🔄 REPLACE" if item['has_current_image'] else "➕ ADD NEW"
        print(f"\n{i+1:2}. {status}")
        print(f"    {item['product'].name[:70]}")
        print(f"    ID: {item['product'].id}")
        print(f"    Image: {item['image_url'][:70]}...")
    
    if len(updates) > 20:
        print(f"\n... and {len(updates) - 20} more products")
    
    print(f"\n⚠️  This will update {len(updates)} products with images from CSV")
    print("⚠️  Press Ctrl+C to cancel or wait 5 seconds to continue...\n")
    time.sleep(5)
    
    print("🚀 Adding/updating images...\n")
    
    success_count = 0
    error_count = 0
    
    for item in updates:
        try:
            stripe.Product.modify(
                item['product'].id,
                images=[item['image_url']]
            )
            
            action = "Updated" if item['has_current_image'] else "Added"
            print(f"✅ {action} image: {item['product'].name[:50]}")
            success_count += 1
            
            # Small delay to avoid rate limiting
            time.sleep(0.1)
            
        except Exception as e:
            print(f"❌ Failed: {item['product'].name}: {e}")
            error_count += 1
    
    print("\n" + "=" * 80)
    print("📈 SUMMARY")
    print("=" * 80)
    print(f"✅ Successfully updated: {success_count} products")
    print(f"❌ Failed: {error_count} products")
    print(f"📦 Total processed: {len(updates)} products")
    print(f"\n🎉 {len(csv_products)} CSV products synced with Stripe!")
    print("\n✨ Image sync complete!\n")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Cancelled by user\n")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}\n")
        raise
