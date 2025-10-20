# 🧪 Veromodels Test Documentation

Comprehensive test suite for the Veromodels e-commerce platform covering backend server actions, frontend UI components, and integration flows.

## 📋 Table of Contents

1. [Test Overview](#test-overview)
2. [Test Structure](#test-structure)
3. [Running Tests](#running-tests)
4. [Test Scenarios](#test-scenarios)
5. [Coverage Report](#coverage-report)
6. [Writing New Tests](#writing-new-tests)

---

## Test Overview

### Testing Stack

- **Framework**: Vitest (compatible with Bun runtime)
- **UI Testing**: React Testing Library
- **E2E Testing**: Playwright (existing)
- **Assertion Library**: @testing-library/jest-dom
- **Coverage**: Vitest Coverage (v8)

### Test Types

1. **Unit Tests** - Individual functions and components
2. **Integration Tests** - Multi-component workflows
3. **E2E Tests** - Full user journeys (Playwright)

---

## Test Structure

```
vero-new/
├── src/
│   ├── actions/
│   │   ├── __tests__/
│   │   │   ├── auth-actions.test.ts       # Authentication server actions
│   │   │   └── cart-actions.test.ts       # Cart management server actions
│   │   ├── auth-actions.ts
│   │   ├── cart-actions.ts
│   │   └── checkout-actions.ts
│   ├── ui/
│   │   ├── __tests__/
│   │   │   ├── login-form.test.tsx        # Login form component
│   │   │   └── signup-form.test.tsx       # Signup form component
│   │   ├── products/
│   │   │   └── __tests__/
│   │   │       └── enhanced-product-card.test.tsx  # Product card component
│   │   └── ...
│   └── setup-tests.ts                     # Global test configuration
├── tests/
│   ├── integration/
│   │   └── checkout-flow.test.ts          # End-to-end checkout flow
│   └── auth.spec.ts                       # Playwright E2E auth tests
├── vitest.config.ts                       # Vitest configuration
└── TEST_DOCUMENTATION.md                  # This file
```

---

## Running Tests

### Run All Tests

```bash
bun test
```

### Run Specific Test File

```bash
bun test auth-actions
bun test login-form
bun test checkout-flow
```

### Run Tests in Watch Mode

```bash
bun test --watch
```

### Run Tests with Coverage

```bash
bun test --coverage
```

### Run E2E Tests (Playwright)

```bash
bun run test:e2e  # If configured
# OR manually:
npx playwright test tests/auth.spec.ts
```

---

## Test Scenarios

### 🔐 Backend: Authentication Actions (`auth-actions.test.ts`)

#### **Signup Tests**
- ✅ Validates all required fields (name, email, password, confirmPassword)
- ✅ Validates name length (minimum 2 characters)
- ✅ Validates email format using regex
- ✅ Validates password match between password and confirmPassword
- ✅ Validates password strength (8+ chars, uppercase, lowercase, number)
- ✅ Sanitizes inputs (trims whitespace, lowercases email)
- ✅ Handles Supabase errors (duplicate email, invalid email)
- ✅ Redirects to homepage on successful signup

#### **Login Tests**
- ✅ Validates required fields (email, password)
- ✅ Validates email format
- ✅ Handles invalid credentials error
- ✅ Sanitizes email input (lowercase, trim)
- ✅ Redirects to homepage on successful login

#### **Logout Tests**
- ✅ Calls Supabase signOut function
- ✅ Redirects to homepage after logout

#### **Get User Tests**
- ✅ Retrieves current authenticated user
- ✅ Returns user object with id and email

---

### 🛒 Backend: Cart Actions (`cart-actions.test.ts`)

#### **Get Cart Tests**
- ✅ Returns null when no cart ID exists in cookies
- ✅ Fetches cart from Commerce Kit using cart ID
- ✅ Uses structuredClone to serialize Stripe objects
- ✅ Handles errors gracefully (returns null)

#### **Add to Cart Tests**
- ✅ Creates new cart when no cart ID exists
- ✅ Stores new cart ID in cookies
- ✅ Adds item to existing cart
- ✅ Supports custom quantity
- ✅ Throws error on failure

#### **Update Cart Item Tests**
- ✅ Returns null when no cart exists
- ✅ Updates item quantity in existing cart
- ✅ Uses Commerce Kit update method

#### **Remove from Cart Tests**
- ✅ Returns null when no cart exists
- ✅ Removes item from cart by variant ID
- ✅ Returns updated cart state

#### **Clear Cart Tests**
- ✅ Does nothing when no cart exists
- ✅ Clears all items from cart
- ✅ Removes cart ID from cookies

#### **Get Cart Item Count Tests**
- ✅ Returns 0 for empty/non-existent cart
- ✅ Calculates total quantity across all items

---

### 🎨 Frontend: Enhanced Product Card (`enhanced-product-card.test.tsx`)

#### **Rendering Tests**
- ✅ Renders product name, brand, price correctly
- ✅ Displays product image or placeholder
- ✅ Links to correct product detail page
- ✅ Uses default currency (AED) when not specified

#### **Badge Display Tests**
- ✅ Shows "SPECIAL PRICE" badge for sale items
- ✅ Shows "PRE-ORDER" badge with release date
- ✅ Shows "LIMITED EDITION" badge for limited products
- ✅ Shows "RARE" badge for rare models
- ✅ Shows "NEW ARRIVAL" badge for new collection items

#### **Pricing Tests**
- ✅ Displays regular price correctly
- ✅ Shows strikethrough original price for sale items
- ✅ Calculates and displays discount percentage
- ✅ Formats prices with two decimal places (fils conversion)

#### **Design System Tests**
- ✅ Applies Vero design system classes (.vero-card)
- ✅ Implements luxury gold/black color palette
- ✅ Includes hover animations and effects

---

### 🔐 Frontend: Login Form (`login-form.test.tsx`)

#### **Form Rendering Tests**
- ✅ Displays heading "Sign In" and subtitle
- ✅ Renders email and password inputs with correct attributes
- ✅ Shows "Forgot password?" link
- ✅ Displays "Create Account" link to signup
- ✅ Shows Terms of Service and Privacy Policy links

#### **Form State Tests**
- ✅ Displays error messages from server action
- ✅ Shows "Signing In..." during pending state
- ✅ Disables inputs and button when form is pending
- ✅ Requires email and password fields

#### **Design System Tests**
- ✅ Applies Vero glass card styling
- ✅ Uses Vero button and input classes
- ✅ Accepts custom className prop

---

### 📝 Frontend: Signup Form (`signup-form.test.tsx`)

#### **Form Rendering Tests**
- ✅ Displays all required fields (name, email, password, confirm)
- ✅ Shows password requirements hint
- ✅ Renders "Sign In" link for existing users
- ✅ Displays Terms and Privacy links

#### **Input Validation Tests**
- ✅ Name input requires text type
- ✅ Email input requires email type
- ✅ Password inputs require minimum 8 characters
- ✅ All fields are marked as required

#### **Form State Tests**
- ✅ Displays server error messages
- ✅ Shows "Creating Account..." during pending
- ✅ Disables all inputs when form is pending

#### **Design System Tests**
- ✅ Applies Vero glass card styling
- ✅ Uses Vero premium color palette
- ✅ Accepts custom className prop

---

### 🛍️ Integration: Checkout Flow (`checkout-flow.test.ts`)

#### **Complete Purchase Flow**
- ✅ Handles full flow: add to cart → checkout → clear cart
- ✅ Maintains cart state with cookies
- ✅ Supports multiple items in cart
- ✅ Prevents checkout with empty cart

#### **Cart State Management**
- ✅ Persists cart across page refreshes
- ✅ Retrieves same cart using cart ID

#### **Error Handling**
- ✅ Handles cart retrieval errors gracefully
- ✅ Rolls back on add to cart failure
- ✅ Returns null instead of throwing on errors

#### **Price Calculations**
- ✅ Correctly calculates totals for multiple quantities
- ✅ Handles AED currency in fils (smallest unit)

---

## Coverage Report

### How to Generate Coverage

```bash
bun test --coverage
```

### Coverage Output

Coverage reports are generated in:
- **Text**: Console output
- **HTML**: `coverage/index.html` (open in browser)
- **JSON**: `coverage/coverage-final.json`

### Target Coverage

| Category | Target | Current |
|----------|--------|---------|
| **Statements** | 80%+ | TBD |
| **Branches** | 75%+ | TBD |
| **Functions** | 80%+ | TBD |
| **Lines** | 80%+ | TBD |

---

## Writing New Tests

### Test File Naming Convention

- **Unit tests**: `{component-name}.test.ts(x)`
- **Integration tests**: `{feature-name}.test.ts`
- **E2E tests**: `{feature-name}.spec.ts`

### Example Test Template

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyComponent } from "../my-component";

describe("MyComponent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render correctly", () => {
		render(<MyComponent />);
		expect(screen.getByText("Expected Text")).toBeInTheDocument();
	});

	it("should handle user interaction", async () => {
		const mockFn = vi.fn();
		render(<MyComponent onClick={mockFn} />);

		const button = screen.getByRole("button");
		await userEvent.click(button);

		expect(mockFn).toHaveBeenCalledTimes(1);
	});
});
```

### Best Practices

#### ✅ DO
- Write tests in Given-When-Then pattern
- Use meaningful test descriptions
- Test user-facing behavior, not implementation
- Mock external dependencies
- Use data-testid sparingly (prefer semantic queries)
- Test accessibility (roles, labels)

#### ❌ DON'T
- Test internal state or implementation details
- Over-mock (mock only external boundaries)
- Write tests that depend on other tests
- Use fragile selectors (CSS classes for styling)
- Skip error cases

---

## Test Utilities

### Common Testing Library Queries

```typescript
// Preferred (by accessibility)
screen.getByRole("button", { name: /submit/i });
screen.getByLabelText("Email");
screen.getByPlaceholderText("Enter email");
screen.getByText("Welcome");

// Fallback
screen.getByTestId("custom-element");
```

### Async Testing

```typescript
import { waitFor } from "@testing-library/react";

await waitFor(() => {
	expect(screen.getByText("Loaded")).toBeInTheDocument();
});
```

### Mocking Server Actions

```typescript
vi.mock("@/actions/auth-actions", () => ({
	login: vi.fn(),
}));

const { login } = await import("@/actions/auth-actions");
(login as any).mockResolvedValue({ success: true });
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test --coverage
      - run: bun run lint
```

---

## Troubleshooting

### Common Issues

#### Issue: "Cannot find module"
**Solution**: Check `vitest.config.ts` path aliases match `tsconfig.json`

#### Issue: "ReferenceError: structuredClone is not defined"
**Solution**: Ensured polyfill is in `setup-tests.ts`

#### Issue: "Next.js router not mocked"
**Solution**: Added router mock in `setup-tests.ts`

#### Issue: "Tests hang or timeout"
**Solution**: Ensure async operations use `await` and have proper cleanup

---

## Quality Gates

### Before Committing
1. ✅ All tests pass: `bun test`
2. ✅ Linting passes: `bun run lint`
3. ✅ Type checking passes: `tsgo`
4. ✅ Coverage meets minimum thresholds

### Before Merging PR
1. ✅ All tests pass on CI
2. ✅ No reduction in code coverage
3. ✅ New features have test coverage
4. ✅ E2E tests pass

---

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 📊 Test Summary

| Category | Tests | Status |
|----------|-------|--------|
| **Auth Actions** | 13 | ✅ Implemented |
| **Cart Actions** | 15 | ✅ Implemented |
| **Product Card** | 14 | ✅ Implemented |
| **Login Form** | 10 | ✅ Implemented |
| **Signup Form** | 11 | ✅ Implemented |
| **Checkout Flow** | 8 | ✅ Implemented |
| **E2E Auth (Playwright)** | 3 | ✅ Existing |
| **TOTAL** | **74 Tests** | ✅ Complete |

---

**Last Updated**: 2025-10-20
**Maintained By**: Quinn (QA Test Architect)
