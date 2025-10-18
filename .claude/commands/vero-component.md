---
description: Generate a new Veromodels-styled component following the design system
args:
  - name: component_name
    description: Name of the component to create (e.g., FeatureCard, ProductBadge)
    required: true
  - name: component_type
    description: Type of component (card, button, badge, layout, form, etc.)
    required: true
---

# Vero Component Generator

Generate a new component for the Veromodels e-commerce platform that follows the established design system.

## Component Details
- **Name**: {{component_name}}
- **Type**: {{component_type}}

## Pre-Generation Checklist

Before creating this component, verify:

1. **Check for Existing Similar Components**
   - Search in `src/ui/` for similar components
   - Search in `src/components/` for related functionality
   - Review `src/ui/products/` for product-related components
   - Review `src/ui/nav/` for navigation components

2. **Review Design System**
   - Read `CLAUDE.md` design system section (lines 197-473)
   - Reference `src/design/tokens.ts` for design values
   - Check `src/app/globals.css` for custom Vero classes (lines 374-609)

3. **Identify Component Category**
   Based on {{component_type}}, determine the pattern to follow:
   - **Card**: Use `.vero-card` as base
   - **Button**: Use `.vero-button` or Shadcn Button
   - **Badge**: Reference category badge patterns
   - **Layout**: Follow container and grid patterns
   - **Form**: Use Shadcn form components with Vero styling

## Component Generation Rules

### Rule 1: Color Usage (MANDATORY)
**ONLY use these colors:**
- Gold: `#D4AF37`, `#E6C757`, `#B8941F`
- Black: `#0A0A0A`, `#1A1A1A`
- Neutral: `#FFFFFF`, `#FDFBF7`, `#F8F9FA`, `#6C757D`, `#212529`
- Category colors: `green-500`, `red-500`, `purple-500`, `amber-500`, `blue-500`, `indigo-500`

**Import design tokens:**
```typescript
import { colors } from '@/design/tokens';
```

### Rule 2: Spacing (MANDATORY)
**ONLY use Tailwind spacing scale:**
- NO arbitrary values: ❌ `p-[17px]`
- YES Tailwind scale: ✅ `p-4` (16px)

**Common patterns:**
- Card padding: `p-5` or `p-6`
- Button padding: `px-6 py-3` or `px-8 py-3`
- Section spacing: `py-8` to `py-12`

### Rule 3: Typography (MANDATORY)
**Font specifications:**
- Font family: System default (no imports needed)
- Sizes: Use Tailwind classes (`text-xs` through `text-5xl`)
- Weights: 300 (light), 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

**Patterns:**
- Headings: `font-light` with larger sizes
- Buttons/Labels: `font-semibold uppercase tracking-wide`
- Body text: `font-normal text-sm` or `text-base`

### Rule 4: Border Radius (MANDATORY)
- Cards: `rounded-lg` or `rounded-xl`
- Buttons: `rounded-md`
- Badges: `rounded-md` or `rounded-full`

### Rule 5: Animations (REQUIRED)
**Every interactive component must have:**
- Transitions: `transition-all duration-300`
- Hover effects: Scale, lift, or color change
- Smooth easing: `ease-in-out`

**Available animation classes:**
- `animate-fade-in`
- `animate-lift` (with hover)
- Custom: `hover:scale-[1.02]`, `hover:translateY(-2px)`

### Rule 6: Vero Classes (USE WHEN APPLICABLE)
**Available custom classes:**
- `.vero-card` - Luxury card styling
- `.vero-button` - Gold primary button
- `.vero-button-outline` - Gold outline button
- `.vero-text-gradient` - Gold gradient text
- `.vero-elegant-text` - Shimmer gold text

## Component Template Selection

Based on {{component_type}}, use the appropriate template:

### Template: Card Component
```typescript
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface {{component_name}}Props {
	children: ReactNode;
	className?: string;
	// Add specific props
}

export function {{component_name}}({ children, className }: {{component_name}}Props) {
	return (
		<div className={cn(
			"vero-card rounded-lg overflow-hidden",
			"transition-all duration-300 hover:scale-[1.02]",
			className
		)}>
			<div className="p-5">
				{children}
			</div>
		</div>
	);
}
```

### Template: Button Component
```typescript
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface {{component_name}}Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: "primary" | "outline";
	size?: "default" | "lg";
}

export function {{component_name}}({
	children,
	variant = "primary",
	size = "default",
	className,
	...props
}: {{component_name}}Props) {
	return (
		<button
			className={cn(
				// Base styles
				"font-semibold uppercase tracking-wide",
				"transition-all duration-300 rounded-md",
				// Variants
				variant === "primary" && "vero-button",
				variant === "outline" && "vero-button-outline",
				// Sizes
				size === "default" && "px-6 py-3 text-sm",
				size === "lg" && "px-8 py-3 text-base",
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
}
```

### Template: Badge Component
```typescript
import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-md px-4 py-1.5 text-xs font-bold uppercase text-white",
	{
		variants: {
			variant: {
				new: "bg-green-500",
				sale: "bg-red-500",
				limited: "bg-purple-500",
				rare: "bg-amber-500",
				preorder: "bg-blue-500",
				soon: "bg-indigo-500",
			},
		},
		defaultVariants: {
			variant: "new",
		},
	}
);

interface {{component_name}}Props extends VariantProps<typeof badgeVariants> {
	children: ReactNode;
	className?: string;
}

export function {{component_name}}({
	variant,
	children,
	className
}: {{component_name}}Props) {
	return (
		<span className={cn(badgeVariants({ variant }), className)}>
			{children}
		</span>
	);
}
```

### Template: Layout Component
```typescript
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface {{component_name}}Props {
	children: ReactNode;
	className?: string;
	maxWidth?: "default" | "wide" | "full";
}

export function {{component_name}}({
	children,
	className,
	maxWidth = "default"
}: {{component_name}}Props) {
	return (
		<section className={cn(
			"w-full px-4 py-8",
			"bg-gradient-to-b from-white via-[#FDFBF7]/30 to-white",
			className
		)}>
			<div className={cn(
				"mx-auto",
				maxWidth === "default" && "max-w-[1400px]",
				maxWidth === "wide" && "max-w-[1600px]",
				maxWidth === "full" && "max-w-full"
			)}>
				{children}
			</div>
		</section>
	);
}
```

## Component Generation Process

### Step 1: Research Phase
1. Search for similar existing components
2. Review design system requirements
3. Identify reusable patterns
4. Check if Shadcn component can be extended

**Report findings:**
```markdown
## Component Research
- Similar components found: [list]
- Shadcn base component: [if applicable]
- Design patterns to follow: [list]
- Custom requirements: [list]
```

### Step 2: Design Phase
1. Define component props interface
2. Plan variants (if needed)
3. Design responsive behavior
4. Plan animations/interactions

**Present design plan:**
```markdown
## Component Design
**Props:**
- [prop name]: [type] - [description]

**Variants:**
- [variant name]: [description]

**Responsive:**
- Mobile: [behavior]
- Tablet: [behavior]
- Desktop: [behavior]

**Interactions:**
- Hover: [effect]
- Click: [effect]
```

### Step 3: Implementation Phase
1. Create component file at appropriate location:
   - Product components: `src/ui/products/`
   - Navigation: `src/ui/nav/`
   - Shared UI: `src/ui/`
   - Shadcn extensions: `src/ui/shadcn/`
   - General components: `src/components/`

2. Implement with full TypeScript types
3. Apply Veromodels design system
4. Include proper JSDoc comments

### Step 4: Validation Phase
After creating the component:
1. **Design System Compliance Check:**
   - ✓ Uses approved colors only
   - ✓ Uses Tailwind spacing scale
   - ✓ Follows typography rules
   - ✓ Includes animations
   - ✓ Has proper TypeScript types
   - ✓ Follows responsive patterns

2. **Code Quality Check:**
   - ✓ Proper imports
   - ✓ Clean, readable code
   - ✓ JSDoc comments
   - ✓ Follows project conventions
   - ✓ Uses `cn()` utility for className merging

### Step 5: Usage Example
Provide a complete usage example:
```tsx
import { {{component_name}} } from '@/[path]/{{component_name}}';

export default function Example() {
	return (
		<{{component_name}}
			// props here
		>
			{/* content */}
		</{{component_name}}>
	);
}
```

### Step 6: Integration Instructions
Provide instructions for integrating the component:
1. Where to use it
2. When to use it vs alternatives
3. Common patterns
4. Accessibility considerations

## Final Deliverable

Provide:
1. ✅ Complete component code
2. ✅ TypeScript interfaces
3. ✅ Usage examples
4. ✅ Integration instructions
5. ✅ Design system compliance confirmation

---

**BEGIN COMPONENT GENERATION NOW**

Follow these steps:
1. Research existing similar components
2. Present design plan for approval
3. Implement component following all rules
4. Validate against design system
5. Provide usage examples and integration guide
