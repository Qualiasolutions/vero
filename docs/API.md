# API Documentation

## Overview

This document describes the API endpoints and Server Actions available in the Veromodels application.

## Base URL

- **Local**: `http://localhost:3000`
- **Production**: `https://veromodels.com` (or your production URL)

---

## API Routes

### Webhooks

#### POST `/api/webhooks/stripe`

Handles Stripe webhook events for payment processing, order creation, and product synchronization.

**Authentication**: Stripe signature verification

**Headers**:
```http
stripe-signature: <webhook_signature>
Content-Type: application/json
```

**Events Handled**:
- `checkout.session.completed` - Creates order and sends confirmation email
- `payment_intent.succeeded` - Updates order status to PROCESSING
- `payment_intent.payment_failed` - Marks order as CANCELLED
- `product.created/updated/deleted` - Syncs products to database cache
- `price.created/updated/deleted` - Syncs prices to database cache

**Response**:
```json
{
  "received": true
}
```

**Errors**:
- `400` - Invalid webhook signature
- `500` - Webhook processing failed

---

### Authentication

#### GET `/api/auth/check`

Checks if the user is authenticated.

**Response**:
```json
{
  "authenticated": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

---

### Debug Endpoints (Development Only)

#### GET `/api/debug/checkout`

Returns checkout session information for debugging.

**Query Parameters**:
- `session_id`: Stripe checkout session ID

---

## Server Actions

Server Actions are called directly from React components and run on the server.

### Cart Actions

Located in: `src/actions/cart-actions.ts`

#### `getCartAction()`

Retrieves the current user's cart.

**Returns**: `Promise<Cart | null>`

```typescript
interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  currency: string;
}
```

#### `addToCartAction(productId: string, quantity?: number)`

Adds a product to the cart.

**Parameters**:
- `productId`: Stripe product ID
- `quantity`: Number of items (default: 1)

**Returns**: `Promise<void>`

**Errors**:
- Throws error if product not found
- Throws error if price invalid

#### `updateCartItemQuantityAction(productId: string, quantity: number)`

Updates the quantity of a cart item.

**Parameters**:
- `productId`: Stripe product ID
- `quantity`: New quantity (0 to remove)

**Returns**: `Promise<void>`

#### `removeFromCartAction(productId: string)`

Removes an item from the cart.

**Parameters**:
- `productId`: Stripe product ID

**Returns**: `Promise<void>`

#### `clearCartAction()`

Clears all items from the cart.

**Returns**: `Promise<void>`

---

### Checkout Actions

Located in: `src/actions/checkout-actions.ts`

#### `createCheckoutSession()`

Creates a Stripe Checkout session and redirects to Stripe.

**Returns**: Never returns (redirects to Stripe)

**Errors**:
- Redirects to `/cart` if cart is empty
- Throws error if items have invalid pricing
- Throws error if Stripe session creation fails

#### `createOrderFromCheckout(sessionId: string)`

Creates an order in the database after successful payment.

**Parameters**:
- `sessionId`: Stripe checkout session ID

**Returns**: `Promise<Order>`

```typescript
interface Order {
  id: string;
  stripe_checkout_session_id: string;
  stripe_payment_intent_id: string;
  total_amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}
```

**Called By**: Stripe webhook (`checkout.session.completed`)

---

### Auth Actions

Located in: `src/actions/auth-actions.ts`

#### `signUpAction(email: string, password: string, name?: string)`

Creates a new user account.

**Parameters**:
- `email`: User's email
- `password`: User's password (min 8 characters)
- `name`: Optional display name

**Returns**: `Promise<User>`

**Errors**:
- Throws if email already exists
- Throws if password is too weak
- Throws if Supabase signup fails

#### `signInAction(email: string, password: string)`

Signs in an existing user.

**Parameters**:
- `email`: User's email
- `password`: User's password

**Returns**: `Promise<User>`

**Errors**:
- Throws if credentials are invalid

#### `signOutAction()`

Signs out the current user.

**Returns**: `Promise<void>`

#### `getCurrentUser()`

Gets the currently authenticated user.

**Returns**: `Promise<User | null>`

---

## Data Models

### Product

```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  metadata: {
    category?: string;
    brand?: string;
    scale?: string;
    material?: string;
    featured?: string;
  };
  description?: string;
  active: boolean;
  currency: string;
}
```

### Cart

```typescript
interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  currency: string;
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}
```

### Order

```typescript
interface Order {
  id: string;
  userId?: string;
  email: string;
  stripeSessionId?: string;
  stripePaymentId?: string;
  total: number;
  currency: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  createdAt: Date;
  updatedAt: Date;
}

enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED"
}
```

---

## Error Handling

All API routes and Server Actions use standardized error responses:

### API Route Errors

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

### Common Error Codes

- `VALIDATION_ERROR` (400) - Invalid input data
- `AUTH_ERROR` (401) - Authentication required
- `AUTHORIZATION_ERROR` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `PAYMENT_ERROR` (402) - Payment processing failed
- `INTERNAL_ERROR` (500) - Server error

### Server Action Errors

Server Actions throw errors that can be caught in components:

```typescript
try {
  await addToCartAction(productId);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
  } else if (error instanceof AuthenticationError) {
    // Redirect to login
  } else {
    // Handle generic error
  }
}
```

---

## Rate Limiting

Currently not implemented. Consider adding rate limiting for:
- Authentication endpoints (prevent brute force)
- Checkout endpoints (prevent abuse)
- API webhooks (Stripe handles this)

Recommended: Use Upstash Redis (@upstash/ratelimit is already installed)

---

## Authentication

### Supabase Auth

All authenticated requests use Supabase JWT tokens:

**Client-side**:
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();
```

**Server-side** (Server Actions):
```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

**Middleware**:
- Automatically refreshes auth tokens
- Protects authenticated routes
- Handles auth redirects

---

## Webhooks

### Stripe Webhooks

**Endpoint**: `POST /api/webhooks/stripe`

**Setup**:
1. Add webhook endpoint in Stripe Dashboard
2. Select events to listen for
3. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

**Local Testing**:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Events**:
- Payment events: `payment_intent.*`
- Checkout events: `checkout.session.*`
- Product sync: `product.*`, `price.*`
- Subscriptions: `customer.subscription.*` (future)

---

## Best Practices

1. **Always validate input** - Use Zod schemas for validation
2. **Use Server Actions** - For mutations (POST, PUT, DELETE)
3. **Use React Server Components** - For data fetching (GET)
4. **Handle errors gracefully** - Use try-catch and error boundaries
5. **Log errors** - Use the logger utility
6. **Never expose secrets** - Use environment variables
7. **Test webhooks locally** - Use Stripe CLI

---

## Examples

### Adding to Cart

```typescript
"use client";

import { addToCartAction } from "@/actions/cart-actions";
import { useState } from "react";

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  
  async function handleAddToCart() {
    setLoading(true);
    try {
      await addToCartAction(productId, 1);
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <button onClick={handleAddToCart} disabled={loading}>
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
```

### Fetching Products

```typescript
// Server Component
import { getProducts } from "@/lib/product-service";

export default async function ProductsPage() {
  const { data: products } = await getProducts(24);
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## Support

For API questions or issues:
- Email: dev@veromodels.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Documentation: [View full docs](./README.md)
