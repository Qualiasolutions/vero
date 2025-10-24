# Sentry Error Tracking Setup

## Why Sentry?

Sentry provides:
- ✅ Real-time error tracking
- ✅ Performance monitoring
- ✅ User feedback collection
- ✅ Release tracking
- ✅ Source map upload
- ✅ Next.js integration

## Installation

### 1. Install Sentry SDK

```bash
bun add @sentry/nextjs
```

### 2. Run Sentry Wizard

```bash
bunx @sentry/wizard -i nextjs
```

The wizard will:
- Create `sentry.client.config.ts`
- Create `sentry.server.config.ts`
- Create `sentry.edge.config.ts`
- Update `next.config.ts`
- Add environment variables template

### 3. Add Environment Variables

Add to `.env.local`:

```bash
# Sentry DSN (from Sentry dashboard)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# Sentry Auth Token (for uploading source maps)
SENTRY_AUTH_TOKEN=sntrys_...

# Sentry Organization and Project
SENTRY_ORG=your-org
SENTRY_PROJECT=veromodels
```

Add to Vercel environment variables for production.

## Configuration

### Client Configuration

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: 1.0,

  // Session replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // User feedback
  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
  ],
});
```

### Server Configuration

```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 1.0,

  environment: process.env.NODE_ENV,

  release: process.env.VERCEL_GIT_COMMIT_SHA,

  // Additional server-specific options
  integrations: [
    // Prisma integration
    new Sentry.Integrations.Prisma({ client: prisma }),
  ],

  beforeSend(event) {
    // Don't send errors in development
    if (process.env.NODE_ENV === "development") {
      return null;
    }
    return event;
  },
});
```

### Edge Configuration

```typescript
// sentry.edge.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

## Integration with Existing Logger

Update `src/lib/logger.ts` to send errors to Sentry:

```typescript
import * as Sentry from "@sentry/nextjs";

class Logger {
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, context));
    }

    // Send to Sentry in production
    if (this.isProduction && error) {
      Sentry.captureException(error, {
        extra: context,
        tags: {
          location: message,
        },
      });
    }
  }
}
```

## Capture Errors Manually

### In Server Actions

```typescript
import * as Sentry from "@sentry/nextjs";

export async function createOrder() {
  try {
    // ... order logic
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        action: "createOrder",
      },
      extra: {
        // Additional context
      },
    });
    throw error;
  }
}
```

### In API Routes

```typescript
import * as Sentry from "@sentry/nextjs";

export async function POST(request: Request) {
  try {
    // ... API logic
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
```

### In React Components

```typescript
"use client";

import * as Sentry from "@sentry/nextjs";

function MyComponent() {
  function handleError() {
    try {
      // ... logic
    } catch (error) {
      Sentry.captureException(error);
      // Show user-friendly error message
    }
  }
}
```

## Error Boundaries

Sentry automatically captures errors in Error Boundaries:

```typescript
// src/components/error-boundary.tsx
import { ErrorBoundary } from "@sentry/nextjs";

<ErrorBoundary
  fallback={<ErrorFallback />}
  beforeCapture={(scope) => {
    scope.setTag("location", "checkout");
  }}
>
  <CheckoutForm />
</ErrorBoundary>
```

Or use our custom error boundary with Sentry:

```typescript
// Update src/components/error-boundary.tsx
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  // Send to Sentry
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo.componentStack,
      },
    },
  });

  // Call custom error handler
  if (this.props.onError) {
    this.props.onError(error, errorInfo);
  }
}
```

## User Feedback

Collect user feedback on errors:

```typescript
import * as Sentry from "@sentry/nextjs";

// After an error occurs
Sentry.showReportDialog({
  eventId: eventId,
  user: {
    email: user.email,
    name: user.name,
  },
});
```

## Performance Monitoring

### Track Custom Transactions

```typescript
import * as Sentry from "@sentry/nextjs";

export async function loadProducts() {
  const transaction = Sentry.startTransaction({
    op: "db.query",
    name: "Load Products",
  });

  try {
    const products = await getProducts();
    return products;
  } finally {
    transaction.finish();
  }
}
```

### Track API Performance

```typescript
import * as Sentry from "@sentry/nextjs";

export async function GET(request: Request) {
  const transaction = Sentry.startTransaction({
    op: "http.server",
    name: "GET /api/products",
  });

  try {
    // ... API logic
    return NextResponse.json(data);
  } finally {
    transaction.finish();
  }
}
```

## Source Maps

Sentry wizard automatically configures source map upload.

Verify in `next.config.ts`:

```typescript
const { withSentryConfig } = require("@sentry/nextjs");

const config = {
  // ... your Next.js config
};

module.exports = withSentryConfig(
  config,
  {
    // Sentry options
    silent: true,
    org: "your-org",
    project: "veromodels",
  },
  {
    // Upload source maps during build
    hideSourceMaps: true,
    disableLogger: true,
  }
);
```

## Release Tracking

Track releases in Sentry:

```bash
# Set in Vercel environment variables
SENTRY_RELEASE=$VERCEL_GIT_COMMIT_SHA
```

In Sentry config:

```typescript
Sentry.init({
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
});
```

## Testing

### Test in Development

```typescript
// pages/debug/sentry.tsx
"use client";

export default function SentryTest() {
  return (
    <button
      onClick={() => {
        throw new Error("Test Sentry Error");
      }}
    >
      Trigger Error
    </button>
  );
}
```

### Test Source Maps

After deploying, trigger an error and verify:
1. Error appears in Sentry dashboard
2. Stack trace shows actual source code (not minified)
3. File paths are correct

## Dashboard Setup

### 1. Create Alerts

Set up alerts for:
- New error types
- High error volume
- Performance degradation
- Failed payments

### 2. Create Projects

Separate projects for:
- Production
- Staging
- Development (optional)

### 3. Configure Integrations

- GitHub (link commits to releases)
- Slack (error notifications)
- Vercel (deployment tracking)

## Best Practices

### 1. Don't Over-Report

```typescript
// Filter noisy errors
ignoreErrors: [
  "ResizeObserver loop limit exceeded",
  "Non-Error promise rejection",
  /timeout/i,
],
```

### 2. Add Context

```typescript
Sentry.setContext("checkout", {
  cart_total: cart.total,
  item_count: cart.items.length,
});
```

### 3. Set User Info

```typescript
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});
```

### 4. Tag Important Errors

```typescript
Sentry.setTag("payment_method", "stripe");
Sentry.setTag("currency", "EUR");
```

### 5. Breadcrumbs

Sentry automatically tracks:
- Navigation
- Console logs
- Network requests
- DOM events

Add custom breadcrumbs:

```typescript
Sentry.addBreadcrumb({
  category: "cart",
  message: "Item added to cart",
  level: "info",
  data: {
    product_id: productId,
  },
});
```

## Cost Optimization

Sentry pricing is based on:
- Number of errors
- Number of transactions
- Data retention

### Optimize Costs:

1. **Sample transactions**
   ```typescript
   tracesSampleRate: 0.1, // Only track 10% of transactions
   ```

2. **Filter errors**
   ```typescript
   beforeSend(event) {
     if (shouldIgnore(event)) return null;
     return event;
   }
   ```

3. **Limit session replay**
   ```typescript
   replaysSessionSampleRate: 0.1, // 10% of sessions
   replaysOnErrorSampleRate: 1.0, // 100% of errors
   ```

## Troubleshooting

### Source Maps Not Working

1. Verify `SENTRY_AUTH_TOKEN` is set
2. Check upload logs during build
3. Verify release matches deployed version

### Too Many Errors

1. Add error filters
2. Fix underlying issues
3. Adjust sample rates

### Missing Context

1. Set user info after authentication
2. Add custom context in error handlers
3. Use breadcrumbs for tracking user actions

## Support

- [Sentry Documentation](https://docs.sentry.io/)
- [Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Discord](https://discord.gg/sentry)
