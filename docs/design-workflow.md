# Veromodels Design System Workflow

**A practical guide for developers and designers working with the Veromodels design system.**

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Daily Workflow](#daily-workflow)
3. [Creating New Components](#creating-new-components)
4. [Using V0-MCP](#using-v0-mcp)
5. [Design Audits](#design-audits)
6. [Common Scenarios](#common-scenarios)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

Before you start working with the design system:

1. **Read the Design System Documentation**
   - [ ] Read `DESIGN-SYSTEM.md` completely
   - [ ] Review `CLAUDE.md` design system section (lines 197-473)
   - [ ] Understand the Veromodels brand identity

2. **Familiarize Yourself with Key Files**
   - [ ] `src/design/tokens.ts` - Design tokens
   - [ ] `src/app/globals.css` - Custom Vero classes (lines 374-609)
   - [ ] `src/store.config.ts` - Store configuration
   - [ ] `v0-instructions.md` - V0-MCP integration guide

3. **Explore Existing Components**
   - [ ] Browse `src/ui/products/` - Product components
   - [ ] Browse `src/ui/nav/` - Navigation components
   - [ ] Browse `src/ui/shadcn/` - Shadcn components
   - [ ] Browse `src/components/` - Shared components

### Design System Quick Reference

**Always available at your fingertips:**
- **Colors**: Gold (#D4AF37), Black (#0A0A0A), White, Cream (#FDFBF7)
- **Spacing**: Use Tailwind scale (p-4, p-6, gap-6) - NO arbitrary values
- **Typography**: System fonts, font-light for headings, font-semibold for buttons
- **Components**: Use `.vero-card`, `.vero-button` classes when applicable

---

## Daily Workflow

### Morning Checklist

Before starting your day:

1. **Pull Latest Changes**
   ```bash
   git pull origin main
   ```

2. **Review Design System Updates**
   - Check if `CLAUDE.md` or `DESIGN-SYSTEM.md` was updated
   - Review any new custom classes in `globals.css`

3. **Run Consistency Check** (if working on multiple components)
   ```
   /consistency-check
   ```

### Development Workflow

#### Step 1: Plan Your Work

Before writing code:

1. **Define Requirements**
   - What component/feature are you building?
   - What is the user story?
   - What are the acceptance criteria?

2. **Research Existing Patterns**
   - Search for similar components in `src/ui/` and `src/components/`
   - Review how existing components handle similar use cases
   - Note patterns to follow or avoid

3. **Create Task List**
   - Break down the work into small, manageable tasks
   - Identify dependencies
   - Estimate complexity

#### Step 2: Design Phase

1. **Sketch Component Structure**
   - What props does it need?
   - What variants should it support?
   - How should it respond to different screen sizes?

2. **Verify Design System Compliance**
   - Will you use approved colors?
   - Does spacing follow the Tailwind scale?
   - Are you using existing Vero classes?

3. **Plan Interactions**
   - What hover effects?
   - What animations?
   - What focus states?

#### Step 3: Implementation

1. **Choose Development Method**
   - **Option A**: Generate with V0-MCP (see [Using V0-MCP](#using-v0-mcp))
   - **Option B**: Use `/vero-component` command
   - **Option C**: Code manually (following patterns)

2. **Write Component Code**
   - Import design tokens: `import { colors } from '@/design/tokens'`
   - Use TypeScript for all components
   - Include JSDoc comments
   - Follow naming conventions

3. **Apply Design System**
   - Use `.vero-*` classes when applicable
   - Use Tailwind classes for everything else
   - Add proper transitions and animations
   - Ensure responsive behavior

#### Step 4: Testing

1. **Self-Audit**
   - Run `/design-audit [your-file-path]`
   - Fix any violations found

2. **Manual Testing**
   - Test on mobile (375px width)
   - Test on tablet (768px width)
   - Test on desktop (1280px+ width)
   - Test hover/focus states
   - Test with keyboard navigation

3. **Accessibility Check**
   - Check color contrast
   - Verify focus indicators
   - Test with screen reader (if possible)
   - Ensure semantic HTML

#### Step 5: Review & Iterate

1. **Code Review**
   - Review your own code first
   - Compare with similar components
   - Ensure consistency

2. **Refine**
   - Apply feedback
   - Optimize performance
   - Clean up code

3. **Document**
   - Add JSDoc comments
   - Update README if needed
   - Note any deviations (with justification)

---

## Creating New Components

### Method 1: Using the /vero-component Command

**Best for**: Components that follow established patterns

```
/vero-component ProductBadge badge
```

This will:
1. Research similar components
2. Present a design plan
3. Generate component code
4. Validate against design system
5. Provide usage examples

**Pros:**
- ✅ Follows design system automatically
- ✅ Includes TypeScript types
- ✅ Provides usage examples
- ✅ Fast and efficient

**Cons:**
- ⚠️ May need customization for unique requirements

### Method 2: Using V0-MCP

**Best for**: Complex UI or exploring design alternatives

See detailed guide in [Using V0-MCP](#using-v0-mcp) section below.

### Method 3: Manual Coding

**Best for**: Small tweaks or very specific requirements

```tsx
// 1. Import dependencies
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { colors } from "@/design/tokens";

// 2. Define TypeScript interface
interface MyComponentProps {
	children: ReactNode;
	variant?: "default" | "premium";
	className?: string;
}

// 3. Implement component with design system
export function MyComponent({
	children,
	variant = "default",
	className
}: MyComponentProps) {
	return (
		<div className={cn(
			// Base styles
			"vero-card rounded-lg p-5",
			// Variants
			variant === "premium" && "border-[#D4AF37] shadow-lg",
			// Animations
			"transition-all duration-300 hover:scale-[1.02]",
			// Merge custom classes
			className
		)}>
			{children}
		</div>
	);
}
```

**Checklist:**
- [ ] TypeScript interfaces defined
- [ ] Design tokens imported (if needed)
- [ ] Vero classes used where applicable
- [ ] Proper spacing (Tailwind scale)
- [ ] Responsive behavior
- [ ] Hover/focus effects
- [ ] JSDoc comments

---

## Using V0-MCP

### When to Use V0

**Use V0 when:**
- ✅ Creating complex layouts
- ✅ Exploring design alternatives
- ✅ Need visual preview quickly
- ✅ Building forms or multi-step flows
- ✅ Creating marketing sections

**Don't use V0 for:**
- ❌ Simple tweaks to existing components
- ❌ Logic-heavy components (use manual coding)
- ❌ Components with complex state management

### V0 Workflow

#### Step 1: Prepare Your Prompt

**Always reference the design system:**

```
Generate a [component type] for Veromodels following our luxury design system.

Design System Constraints:
- Colors: Gold (#D4AF37), Black (#0A0A0A), White, Cream (#FDFBF7)
- Typography: System fonts, font-light for headings, font-semibold for buttons
- Spacing: Use Tailwind scale (p-4, p-6, gap-6) - NO arbitrary values
- Components: Use .vero-card class with rounded-lg, hover lift animation
- Responsive: [specify breakpoint behavior]

Component Requirements:
[Your specific requirements here]

Use Next.js Image, TypeScript, Tailwind CSS, and our custom .vero-* classes.
```

**Pro Tip:** Copy prompt templates from `v0-instructions.md`

#### Step 2: Review V0 Output

When V0 generates code:

1. **First Pass Review**
   - Does it use approved colors?
   - Does it use Tailwind spacing scale?
   - Does it include animations?
   - Is it responsive?

2. **Compare with Design System**
   - Open `DESIGN-SYSTEM.md`
   - Compare component patterns
   - Check for consistency

3. **Check for Custom Classes**
   - Could `.vero-card` be used?
   - Could `.vero-button` be used?
   - Are there opportunities to use existing Vero classes?

#### Step 3: Refine V0 Code

```tsx
// BEFORE (V0 generated)
<div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">

// AFTER (Design system compliance)
<div className="vero-card rounded-lg">
  <div className="p-6">
```

#### Step 4: Audit V0 Component

Run the design audit:
```
/design-audit src/[path]/[component-name].tsx
```

Fix any violations before proceeding.

### V0 Common Adjustments

**Color Adjustments:**
```tsx
// V0 might generate
className="bg-amber-500"

// Change to approved gold
className="bg-[#D4AF37]"
```

**Spacing Adjustments:**
```tsx
// V0 might generate
className="p-[18px]"

// Change to Tailwind scale
className="p-4"  // 16px
// or
className="p-5"  // 20px
```

**Button Adjustments:**
```tsx
// V0 might generate
<button className="bg-amber-500 px-6 py-3 rounded-lg">

// Change to Vero button
<button className="vero-button px-6 py-3 rounded-md">
```

---

## Design Audits

### When to Run Audits

Run audits:
- ✅ Before submitting a pull request
- ✅ After completing a feature
- ✅ When integrating V0 components
- ✅ Periodically to catch drift

### Running a Component Audit

```
/design-audit src/ui/products/new-product-card.tsx
```

**What it checks:**
1. Color compliance
2. Spacing consistency
3. Typography correctness
4. Component pattern adherence
5. Vero class usage
6. Accessibility compliance
7. Responsive design

**Sample Output:**
```markdown
# Design System Audit Report
**File**: src/ui/products/new-product-card.tsx

## Compliance Score: 62/70

## Critical Issues
1. ❌ Uses arbitrary color `#FF6B6B` at line 15 (should use design system colors)
2. ❌ Uses arbitrary spacing `p-[13px]` at line 23 (should use `p-3` or `p-4`)

## Recommendations
1. ⚠️  Could use `.vero-card` class instead of custom styling
2. ⚠️  Missing hover effect on button

## Optional Improvements
1. Consider adding gold gradient to price text
```

### Running a Project-Wide Consistency Check

```
/consistency-check
```

This will:
- Analyze all components
- Compare against design system
- Compare components with each other
- Generate comprehensive report
- Prioritize fixes

---

## Common Scenarios

### Scenario 1: Adding a New Product Card Variant

**Steps:**

1. **Research**
   - Look at `src/ui/products/product-list.tsx`
   - Note the `.vero-card` usage
   - Understand the hover pattern

2. **Design**
   - Sketch the variant
   - Identify differences from standard card
   - Plan props/variants needed

3. **Implement**
   ```tsx
   // Extend existing pattern
   <div className={cn(
     "vero-card rounded-lg overflow-hidden",
     variant === "featured" && "border-2 border-[#D4AF37]",
     "transition-all duration-300 hover:scale-[1.02]"
   )}>
   ```

4. **Test**
   - Compare visually with standard card
   - Ensure consistent spacing
   - Verify hover behavior

### Scenario 2: Creating a Custom Button

**Question**: When to use `.vero-button` vs Shadcn Button?

**Answer:**
- **Use `.vero-button`** for primary CTAs (Add to Cart, Buy Now, Subscribe)
- **Use Shadcn Button** for secondary actions (Learn More, View Details, Cancel)

**Implementation:**
```tsx
// Primary CTA
<button className="vero-button px-8 py-3 rounded-md">
  Add to Cart
</button>

// Secondary action
<Button variant="outline" size="lg">
  View Details
</Button>
```

### Scenario 3: Fixing Color Violations

**Problem**: Audit found non-compliant colors

**Before:**
```tsx
<div className="bg-orange-400 text-white">
  Hot Deal!
</div>
```

**After:**
```tsx
// If it's for "Sale" category
<div className="bg-red-500 text-white">
  Hot Deal!
</div>

// If it's for "New" category
<div className="bg-green-500 text-white">
  Hot Deal!
</div>

// If it's a primary accent
<div className="bg-[#D4AF37] text-white">
  Hot Deal!
</div>
```

### Scenario 4: Implementing Responsive Design

**Pattern:**
```tsx
<div className="
  // Mobile (< 640px)
  grid grid-cols-1 gap-4 px-4 py-6

  // Tablet (>= 768px)
  md:grid-cols-3 md:gap-6 md:px-8

  // Desktop (>= 1024px)
  lg:grid-cols-4 lg:gap-8 lg:px-12 lg:py-12
">
  {/* Content */}
</div>
```

**Testing:**
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1280px (MacBook)

### Scenario 5: Adding Animations

**Pattern:**
```tsx
// Card lift animation
<div className="
  vero-card
  transition-all duration-300
  hover:scale-[1.02]
  hover:-translate-y-1
">

// Button scale animation
<button className="
  vero-button
  transition-all duration-300
  hover:scale-105
">

// Text color transition
<a className="
  text-[#212529]
  transition-colors duration-300
  hover:text-[#D4AF37]
">
```

---

## Troubleshooting

### Issue: My component doesn't match the design system

**Solution:**
1. Run `/design-audit [your-file]`
2. Review violations
3. Compare with similar existing components
4. Apply fixes one by one
5. Re-run audit to verify

### Issue: V0 generated code doesn't follow our patterns

**Solution:**
1. V0 doesn't know our custom `.vero-*` classes
2. Manually refactor to use Vero classes
3. Adjust colors to match palette
4. Fix spacing to use Tailwind scale
5. Run audit to catch remaining issues

### Issue: Not sure which component pattern to follow

**Solution:**
1. Search for similar components:
   ```bash
   grep -r "ProductCard" src/ui/
   ```
2. Review `DESIGN-SYSTEM.md` Components section
3. Ask for clarification in team chat
4. When in doubt, follow the simplest pattern

### Issue: Hover effect not working

**Checklist:**
- [ ] Did you add `transition-all duration-300`?
- [ ] Did you add `hover:` prefix to the effect?
- [ ] Is the element actually hoverable (not inside a link/button)?
- [ ] Did you check browser dev tools for conflicting styles?

### Issue: Colors look different than expected

**Possible causes:**
1. **Wrong color variable**: Using `#D3AF37` instead of `#D4AF37`
2. **Opacity applied**: Using `bg-[#D4AF37]/50` unintentionally
3. **Dark mode**: Component might have dark mode styles
4. **CSS variable**: Using CSS variable without fallback

**Solution:**
```tsx
// Always use exact hex from design system
className="bg-[#D4AF37]"

// Or import from tokens
import { colors } from '@/design/tokens';
// Then use colors.gold.primary
```

### Issue: Spacing doesn't look right

**Problem**: Mixing arbitrary and Tailwind spacing

**Solution:**
```tsx
// ❌ WRONG - Arbitrary and inconsistent
<div className="p-[17px] mb-[23px]">

// ✅ CORRECT - Tailwind scale
<div className="p-4 mb-6">
```

**Tip**: Use browser dev tools to measure spacing in pixels, then map to Tailwind:
- 4px → `p-1`
- 8px → `p-2`
- 12px → `p-3`
- 16px → `p-4`
- 20px → `p-5`
- 24px → `p-6`

---

## Quick Reference

### Design System Files
| File | Purpose | Lines |
|------|---------|-------|
| `CLAUDE.md` | Design system rules | 197-473 |
| `DESIGN-SYSTEM.md` | Visual guide | All |
| `src/design/tokens.ts` | Design tokens | All |
| `src/app/globals.css` | Custom Vero classes | 374-609 |
| `v0-instructions.md` | V0-MCP guide | All |

### Commands
| Command | Purpose |
|---------|---------|
| `/design-audit [file]` | Audit single component |
| `/consistency-check` | Check all components |
| `/vero-component [name] [type]` | Generate component |

### Color Quick Reference
| Usage | Color | Hex |
|-------|-------|-----|
| Primary CTA | Gold | `#D4AF37` |
| Text | Dark | `#212529` |
| Background | White | `#FFFFFF` |
| Subtle BG | Cream | `#FDFBF7` |
| Borders | Light Gray | `#F8F9FA` |

### Spacing Quick Reference
| Use Case | Spacing |
|----------|---------|
| Card padding | `p-5` or `p-6` |
| Button padding | `px-6 py-3` |
| Section spacing | `py-8` to `py-12` |
| Grid gap | `gap-4` to `gap-6` |

---

## Getting Help

**Resources:**
1. Check `DESIGN-SYSTEM.md` for visual examples
2. Read `CLAUDE.md` for technical specs
3. Review existing components in `src/ui/`
4. Run audits to identify issues

**Questions?**
- Refer back to this workflow guide
- Review the design system documentation
- Compare with existing components

---

**Happy coding! Build beautiful, consistent Veromodels experiences.** ✨
