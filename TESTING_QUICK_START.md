# 🚀 Testing Quick Start Guide

Quick reference for running tests in the Veromodels project.

## Run All Tests

```bash
bun test
```

## Run Specific Test Files

```bash
# Authentication tests
bun test auth-actions

# Cart functionality tests
bun test cart-actions

# Product card component
bun test enhanced-product-card

# Login form
bun test login-form

# Signup form
bun test signup-form

# Checkout integration flow
bun test checkout-flow

# E2E authentication (Playwright)
npx playwright test tests/auth.spec.ts
```

## Development Mode

```bash
# Watch mode - reruns tests on file changes
bun test --watch

# Watch specific file
bun test --watch cart-actions
```

## Coverage Reports

```bash
# Generate coverage report
bun test --coverage

# Open HTML coverage report
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

## Test Structure

```
src/
├── actions/__tests__/          # Backend server action tests
│   ├── auth-actions.test.ts    # Authentication (13 tests)
│   └── cart-actions.test.ts    # Cart operations (15 tests)
├── ui/__tests__/               # Frontend component tests
│   ├── login-form.test.tsx     # Login form (10 tests)
│   └── signup-form.test.tsx    # Signup form (11 tests)
└── ui/products/__tests__/
    └── enhanced-product-card.test.tsx  # Product card (14 tests)

tests/
└── integration/
    └── checkout-flow.test.ts   # Checkout flow (8 tests)
```

## Common Commands

| Command | Description |
|---------|-------------|
| `bun test` | Run all tests |
| `bun test --watch` | Watch mode |
| `bun test --coverage` | With coverage |
| `bun test <pattern>` | Run matching tests |
| `bun run lint` | Lint code |
| `tsgo` | Type check |

## Test Count Summary

- **Backend Tests**: 28 scenarios
- **Frontend Tests**: 35 scenarios
- **Integration Tests**: 8 scenarios
- **E2E Tests**: 3 scenarios
- **Total**: **74 test scenarios**

## Documentation

- **Full Documentation**: [`TEST_DOCUMENTATION.md`](./TEST_DOCUMENTATION.md)
- **QA Summary**: [`QA_TEST_SUMMARY.md`](./QA_TEST_SUMMARY.md)
- **This Quick Start**: [`TESTING_QUICK_START.md`](./TESTING_QUICK_START.md)

## Quality Gates

Before committing:
```bash
bun test         # All tests pass
bun run lint     # Linting passes
tsgo             # Type checking passes
```

---

**Need Help?** See [`TEST_DOCUMENTATION.md`](./TEST_DOCUMENTATION.md) for detailed guidance.
