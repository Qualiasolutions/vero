# Image Optimization Strategy

## Current State

Currently, product images are hosted on external services:
- imgbb.co
- Squarespace CDN (images.squarespace-cdn.com)

**Issues with current approach**:
- External dependencies (availability, performance)
- No control over caching and optimization
- Potential CORS issues
- No automatic format conversion (WebP, AVIF)
- Slower load times from external domains

## Recommended Solution: Vercel Blob

Vercel Blob is already installed in the project (@vercel/blob) and provides:
- ✅ Automatic image optimization
- ✅ CDN delivery
- ✅ Format conversion (WebP, AVIF)
- ✅ Responsive images
- ✅ Fast edge caching
- ✅ Simple API integration

### Implementation Steps

#### 1. Set up Vercel Blob

```bash
# Add Vercel Blob environment variable
# Get this from Vercel Dashboard > Storage > Create Blob Store
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

#### 2. Create Image Upload Utility

```typescript
// src/lib/image-upload.ts
import { put } from '@vercel/blob';

export async function uploadImage(file: File, path: string) {
  const blob = await put(path, file, {
    access: 'public',
  });
  
  return blob.url; // Returns CDN URL
}

export async function uploadImageFromUrl(url: string, path: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], path);
  
  return uploadImage(file, path);
}
```

#### 3. Migrate Existing Images

```typescript
// scripts/migrate-images.ts
import { uploadImageFromUrl } from '@/lib/image-upload';
import { getStripeClient } from '@/lib/stripe';

async function migrateProductImages() {
  const stripe = getStripeClient();
  const products = await stripe.products.list({ limit: 100 });
  
  for (const product of products.data) {
    if (product.images && product.images.length > 0) {
      const newImages: string[] = [];
      
      for (const [index, imageUrl] of product.images.entries()) {
        // Skip if already on Vercel Blob
        if (imageUrl.includes('vercel-storage.com')) {
          newImages.push(imageUrl);
          continue;
        }
        
        try {
          const newUrl = await uploadImageFromUrl(
            imageUrl,
            `products/${product.id}/${index}.jpg`
          );
          newImages.push(newUrl);
          console.log(`Migrated: ${imageUrl} -> ${newUrl}`);
        } catch (error) {
          console.error(`Failed to migrate ${imageUrl}:`, error);
          newImages.push(imageUrl); // Keep original on failure
        }
      }
      
      // Update product in Stripe
      await stripe.products.update(product.id, {
        images: newImages,
      });
    }
  }
}
```

#### 4. Use Next.js Image Component

```tsx
// Already implemented in the codebase
import Image from 'next/image';

<Image
  src={product.images[0]}
  alt={product.name}
  width={600}
  height={600}
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={isAboveFold}
/>
```

## Alternative Solutions

### 1. Cloudinary

**Pros**:
- Advanced transformations
- Generous free tier
- AI-powered features
- Video support

**Cons**:
- Additional service to manage
- More complex setup

**Setup**:
```bash
bun add cloudinary
```

### 2. AWS S3 + CloudFront

**Pros**:
- Full control
- Extremely scalable
- Lower costs at scale

**Cons**:
- More complex setup
- Requires AWS account management
- Manual optimization needed

### 3. Keep Current + Optimization

**Pros**:
- No migration needed
- Works with current setup

**Cons**:
- Still dependent on external services
- No automatic optimization

## Image Optimization Best Practices

### 1. Use Next.js Image Component

✅ **Already implemented** - The codebase uses `next/image` throughout

Benefits:
- Automatic lazy loading
- Responsive images
- Format optimization
- Blur placeholder support

### 2. Optimize Image Sizes

```typescript
// Recommended sizes for Veromodels
const imageSizes = {
  thumbnail: { width: 300, height: 300 },
  card: { width: 600, height: 600 },
  hero: { width: 1200, height: 1200 },
  zoom: { width: 2400, height: 2400 },
};
```

### 3. Use Modern Formats

Next.js automatically converts to WebP/AVIF when supported by the browser.

### 4. Implement Progressive Loading

```tsx
<Image
  src={product.images[0]}
  alt={product.name}
  fill
  className="object-cover"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..." // Low-res base64
/>
```

### 5. Lazy Load Below-the-Fold Images

```tsx
<Image
  src={product.images[0]}
  alt={product.name}
  width={600}
  height={600}
  loading="lazy" // Default behavior
  priority={false} // Only set true for above-fold images
/>
```

## Performance Metrics

### Current Performance (External CDN)
- Average load time: ~800ms
- LCP (Largest Contentful Paint): ~2.5s
- Total transfer: ~500KB per image

### Expected with Vercel Blob
- Average load time: ~200ms
- LCP: ~1.0s
- Total transfer: ~150KB per image (with WebP)

## Implementation Checklist

- [ ] Add Vercel Blob token to environment variables
- [ ] Create image upload utility
- [ ] Test image upload locally
- [ ] Create migration script for existing images
- [ ] Run migration in staging
- [ ] Verify all images work correctly
- [ ] Update Stripe products with new URLs
- [ ] Run migration in production
- [ ] Monitor performance improvements
- [ ] Clean up old images (if needed)

## Monitoring

After implementing, monitor:
- Vercel Blob usage (Dashboard > Storage)
- Image loading performance (Vercel Speed Insights)
- Core Web Vitals improvements
- User feedback on loading speed

## Cost Estimation

**Vercel Blob Pricing**:
- Free: 500GB storage, 10M reads/month
- Pro: $0.15/GB storage, $0.10/1M reads

**Estimated for Veromodels**:
- ~100 products × 5 images × 500KB = ~250MB storage
- ~10K monthly visitors × 10 images = ~100K reads

**Cost**: Likely stays within free tier

## Fallback Strategy

If migration fails, implement a proxy:

```typescript
// src/app/api/image-proxy/[...path]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const imageUrl = decodeURIComponent(params.path.join('/'));
  
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  
  return new Response(blob, {
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
```

## References

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [Cloudinary Next.js Integration](https://cloudinary.com/documentation/next_image_integration)
