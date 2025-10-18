# V0-MCP Design System Integration Instructions

This document provides specific instructions for using v0-mcp with the Veromodels design system. **CRITICAL**: Always follow these guidelines when generating components with v0.

## Table of Contents
1. [Before Using V0](#before-using-v0)
2. [Mandatory Design Constraints](#mandatory-design-constraints)
3. [Prompt Templates](#prompt-templates)
4. [Color Usage Rules](#color-usage-rules)
5. [Component Patterns](#component-patterns)
6. [Common Mistakes to Avoid](#common-mistakes-to-avoid)

---

## Before Using V0

**YOU MUST:**
1. Read the complete design system in `CLAUDE.md` (lines 197-473)
2. Review existing similar components in `src/ui/` or `src/components/`
3. Import design tokens from `src/design/tokens.ts` when possible
4. Check `src/app/globals.css` (lines 374-609) for custom Vero classes

**NEVER:**
- Create arbitrary colors not in the Veromodels palette
- Use arbitrary spacing values (e.g., `m-[17px]`)
- Generate components without referencing the design system
- Skip checking for existing patterns

---

## Mandatory Design Constraints

### Color Palette (ONLY USE THESE)
When prompting v0, ALWAYS specify these exact colors:

**Gold (Primary Brand)**
- Primary: `#D4AF37`
- Light: `#E6C757`
- Dark: `#B8941F`
- Champagne: `#F5E6D3`

**Black & Neutrals**
- Black: `#0A0A0A`
- Charcoal: `#1A1A1A`
- White: `#FFFFFF`
- Cream: `#FDFBF7`
- Gray: `#F8F9FA`
- Text: `#212529`
- Text Secondary: `#6C757D`

**Category Colors**
- Green (New): `rgb(34 197 94)` - green-500
- Red (Sale): `rgb(239 68 68)` - red-500
- Purple (Limited): `rgb(168 85 247)` - purple-500
- Amber (Rare): `rgb(245 158 11)` - amber-500
- Blue (Pre-order): `rgb(59 130 246)` - blue-500
- Indigo (Coming): `rgb(99 102 241)` - indigo-500

### Typography Constraints
- Font family: System default (`-apple-system, sans-serif`)
- Font weights: 300 (light), 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- Sizes: Use Tailwind classes (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`)
- Headings: Use `font-light` or `font-normal` with larger sizes
- Buttons/Labels: Use `font-semibold` with `uppercase` and `tracking-wide`

### Spacing Scale (Tailwind Only)
- NEVER use arbitrary values like `p-[13px]`
- ALWAYS use: `p-1` (4px), `p-2` (8px), `p-3` (12px), `p-4` (16px), `p-5` (20px), `p-6` (24px), `p-8` (32px), `p-12` (48px)
- Common patterns:
  - Card padding: `p-5` or `p-6`
  - Button padding: `px-6 py-3` or `px-8 py-3`
  - Section spacing: `py-8` to `py-12`

### Border Radius
- Cards: `rounded-lg` or `rounded-xl`
- Buttons: `rounded-md` or `rounded-lg`
- Badges: `rounded-md` or `rounded-full`
- Images: `rounded-lg`

---

## Prompt Templates

### Template 1: Product Card Component
```
Generate a product card component for Veromodels following our design system:

Design Requirements:
- Use white background with subtle gold border (1px solid rgba(212, 175, 55, 0.15))
- Border radius: rounded-lg
- Add hover effect: lift animation (translateY(-6px) scale(1.01))
- On hover, border should become gold (#D4AF37)
- Include subtle shadow: shadow-sm
- Product image should have aspect-square
- Price text should use gold gradient (from #D4AF37 to #B8941F)
- Include favorite heart icon in top-right of image
- Font: Use text-base font-light for product name
- Padding: p-5 for content area

Colors:
- Gold: #D4AF37
- Text: #212529
- Secondary text: #6C757D

Use Next.js Image component, TypeScript, and Tailwind CSS.
```

### Template 2: Button Component
```
Generate a luxury button component for Veromodels:

Design Requirements:
- Background: #D4AF37 (Vero gold)
- Text: white, font-semibold, uppercase, tracking-wide
- Padding: px-8 py-3
- Border radius: rounded-md
- Add ripple effect on hover
- Hover state: darker gold (#B8941F) with translateY(-2px)
- Include subtle shadow on hover: 0 8px 24px rgba(212, 175, 55, 0.35)
- Transition: all 300ms ease-in-out

Also create an outline variant:
- Background: transparent
- Border: 2px solid #D4AF37
- Text: #D4AF37
- Hover: fill with gold, text becomes white

Use TypeScript, class-variance-authority for variants.
```

### Template 3: Category Badge
```
Generate a category badge component for Veromodels product categories:

Requirements:
- Support 6 variants: new, sale, limited, rare, preorder, soon
- Colors:
  - new: bg-green-500 (#22C55E)
  - sale: bg-red-500 (#EF4444)
  - limited: bg-purple-500 (#A855F7)
  - rare: bg-amber-500 (#F59E0B)
  - preorder: bg-blue-500 (#3B82F6)
  - soon: bg-indigo-500 (#6366F1)
- Text: white, text-xs, font-bold, uppercase
- Padding: px-4 py-1.5
- Border radius: rounded-md or rounded-full
- Add subtle shadow: shadow-lg

Use class-variance-authority, TypeScript.
```

### Template 4: Responsive Layout
```
Generate a responsive grid layout for Veromodels:

Requirements:
- Max width: 1400px, centered
- Container padding: px-4 (mobile), px-8 (tablet), px-12 (desktop)
- Grid: 1 column (mobile), 3 columns (tablet), 6 columns (desktop)
- Gap: gap-4 (mobile), gap-6 (tablet+)
- Section spacing: py-8 to py-12
- Background: gradient from white to cream (#FDFBF7)

Use Tailwind responsive classes, TypeScript.
```

---

## Color Usage Rules

### When V0 Should Use Gold (#D4AF37)
- Primary buttons
- Active links
- Price displays (as gradient)
- Brand accents
- Hover states
- Borders on featured elements

### When V0 Should Use Neutrals
- Body text: `#212529`
- Secondary text: `#6C757D`
- Backgrounds: White or Cream (`#FDFBF7`)
- Borders: Light gray or subtle gold

### When V0 Should Use Category Colors
- Badge backgrounds
- Status indicators
- Category labels
- Special promotions

### FORBIDDEN Color Actions
- DO NOT generate arbitrary hex codes
- DO NOT use colors outside the defined palette
- DO NOT use generic Tailwind colors without checking if they match our palette
- DO NOT create new shades (stick to defined light/dark variants)

---

## Component Patterns

### Pattern 1: Vero Card
v0 should generate cards with this structure:
```tsx
<div className="vero-card rounded-lg overflow-hidden transition-all duration-500 hover:scale-[1.02]">
  <div className="relative aspect-square bg-white">
    {/* Image with object-contain */}
    <Image className="object-contain p-2" ... />
  </div>
  <div className="p-5 space-y-3">
    <h3 className="text-base font-light text-[#212529] hover:text-[#D4AF37] transition-colors">
      {/* Product name */}
    </h3>
    <p className="text-xl font-semibold" style={{
      background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }}>
      {/* Price */}
    </p>
  </div>
</div>
```

### Pattern 2: Vero Button
```tsx
<button className="vero-button px-8 py-3 rounded-md uppercase tracking-wide font-semibold transition-all duration-300 hover:scale-105">
  {/* Button text */}
</button>
```

### Pattern 3: Section Container
```tsx
<section className="w-full px-4 py-8 bg-gradient-to-b from-white via-[#FDFBF7]/30 to-white">
  <div className="max-w-[1400px] mx-auto">
    {/* Section content */}
  </div>
</section>
```

---

## Common Mistakes to Avoid

### ❌ WRONG - Arbitrary Colors
```tsx
<div className="bg-[#FF6B6B]"> {/* Random red not in palette */}
```

### ✅ CORRECT - Use Defined Colors
```tsx
<div className="bg-red-500"> {/* Defined red for sale/special */}
```

---

### ❌ WRONG - Arbitrary Spacing
```tsx
<div className="p-[17px]"> {/* Random pixel value */}
```

### ✅ CORRECT - Tailwind Scale
```tsx
<div className="p-4"> {/* 16px from scale */}
```

---

### ❌ WRONG - Generic Component
```tsx
<Card className="p-6 rounded-lg shadow-md">
  {/* Generic styling */}
</Card>
```

### ✅ CORRECT - Vero-Styled Component
```tsx
<div className="vero-card rounded-lg overflow-hidden">
  {/* Veromodels luxury styling */}
</div>
```

---

### ❌ WRONG - Missing Hover Effects
```tsx
<button className="bg-[#D4AF37] text-white px-6 py-3">
  Click Me
</button>
```

### ✅ CORRECT - With Animations
```tsx
<button className="vero-button px-6 py-3 rounded-md transition-all duration-300 hover:scale-105">
  Click Me
</button>
```

---

## V0 Prompt Checklist

Before sending a prompt to v0, verify:

- [ ] Specified exact Veromodels color values
- [ ] Referenced existing component patterns
- [ ] Used Tailwind spacing scale (no arbitrary values)
- [ ] Included hover/animation effects
- [ ] Specified border radius (rounded-lg, rounded-xl)
- [ ] Mentioned font weights and text transforms
- [ ] Included responsive behavior
- [ ] Referenced design system constraints
- [ ] Specified TypeScript and Next.js requirements
- [ ] Mentioned accessibility considerations

---

## Example V0 Prompt

**GOOD PROMPT:**
```
Generate a product grid component for Veromodels following our luxury design system.

Design System Constraints:
- Colors: Gold (#D4AF37), Black (#0A0A0A), White, Cream (#FDFBF7)
- Typography: System fonts, font-light for headings, font-semibold for buttons
- Spacing: Use Tailwind scale (p-4, p-6, gap-6)
- Cards: Use .vero-card class with rounded-lg, hover lift animation
- Responsive: 1 col mobile, 3 cols tablet, 4 cols desktop

Component Requirements:
- Grid of product cards with hover effects
- Each card: white bg, subtle gold border (rgba(212,175,55,0.15))
- Product image: aspect-square, object-contain
- Price: gold gradient text (#D4AF37 to #B8941F)
- Favorite heart icon in top-right
- On hover: lift with scale(1.02), border becomes solid gold

Use Next.js Image, TypeScript, Tailwind CSS, and our custom .vero-card class.
```

**BAD PROMPT:**
```
Make me a product grid with nice cards.
```

---

## Quick Reference

### Import Design Tokens (when applicable)
```typescript
import { colors, spacing, borderRadius } from '@/design/tokens';
```

### Use Custom Vero Classes
```tsx
// Available in globals.css
className="vero-card"           // Luxury card style
className="vero-button"         // Gold button
className="vero-button-outline" // Outline button
className="vero-text-gradient"  // Gold gradient text
className="vero-elegant-text"   // Shimmer gold text
```

### Shadcn Component Base
```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
```

---

## Final Reminder

**EVERY TIME YOU USE V0:**
1. Reference this document
2. Check CLAUDE.md design system section
3. Review similar existing components
4. Ensure color palette compliance
5. Verify spacing uses Tailwind scale
6. Include proper animations/transitions
7. Test responsive behavior

**v0 is a powerful tool, but it's only as good as your prompt. Always be specific about design constraints to maintain Veromodels' luxury brand consistency.**
