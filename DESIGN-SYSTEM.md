# Veromodels Design System

**Version**: 1.0.0
**Last Updated**: October 2025
**Platform**: Next.js 15 + React 19 + Tailwind CSS v4

---

## Table of Contents

1. [Introduction](#introduction)
2. [Brand Identity](#brand-identity)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Components](#components)
7. [Patterns & Best Practices](#patterns--best-practices)
8. [Accessibility](#accessibility)
9. [Development Guidelines](#development-guidelines)

---

## Introduction

The Veromodels Design System is a comprehensive guide to building consistent, premium, and accessible user interfaces for the Veromodels e-commerce platform. This system ensures that every component, page, and interaction reflects our luxury brand identity while maintaining technical excellence.

### Design Philosophy

**Luxury · Exclusive · Premium · Collector-Focused**

Our design system embodies:
- **Elegance**: Clean, sophisticated layouts with generous white space
- **Quality**: High-attention to detail in every interaction
- **Exclusivity**: Premium feel that appeals to serious collectors
- **Consistency**: Uniform experience across all touchpoints
- **Performance**: Beautiful yet fast, optimized for all devices

### Core Principles

1. **Color Discipline**: Strict adherence to the gold and black luxury palette
2. **Spacing Consistency**: Systematic use of spacing scale for harmony
3. **Typography Hierarchy**: Clear, readable text with proper hierarchy
4. **Interactive Delight**: Subtle, premium animations that enhance UX
5. **Accessibility First**: Inclusive design for all users

---

## Brand Identity

### About Veromodels

**Veromodels** is a premium retailer of 1:18 scale die-cast model cars, serving serious collectors and enthusiasts with authentic, officially licensed products from top brands like AutoArt, GT Spirit, OttO mobile, and KYOSHO.

### Brand Personality

- **Premium**: High-end, luxury positioning
- **Authentic**: Officially licensed, genuine products
- **Exclusive**: Limited editions, rare collectibles
- **Professional**: Expert knowledge, quality service
- **Passionate**: Deep understanding of collector needs

### Target Audience

- Serious die-cast model collectors
- Automotive enthusiasts
- Gift buyers seeking premium items
- Investors in collectible models
- Ages: 25-65, higher disposable income

### Brand Values

1. **Authenticity Guaranteed**: Every model is officially licensed
2. **Quality Assurance**: Inspected and verified before shipment
3. **Exclusive Selection**: Rare and limited edition models
4. **Collector-Focused**: Understanding the needs of serious collectors
5. **Premium Experience**: Luxury shopping experience from browse to delivery

---

## Color Palette

### Primary Colors: Gold

Gold is our primary brand color, used for accents, buttons, and premium highlights.

| Color | Hex | Usage | CSS Variable |
|-------|-----|-------|--------------|
| **Primary Gold** | `#D4AF37` | Primary buttons, prices, accents | `--verogold` |
| **Light Gold** | `#E6C757` | Hover states, lighter accents | `--verogold-light` |
| **Dark Gold** | `#B8941F` | Active states, darker accents | `--verogold-dark` |
| **Champagne** | `#F5E6D3` | Subtle backgrounds, highlights | `--verogold-champagne` |

**Usage Guidelines:**
- ✅ Use for primary CTAs (Add to Cart, Buy Now)
- ✅ Use for price displays (with gradient)
- ✅ Use for hover effects on interactive elements
- ✅ Use for borders on featured content
- ❌ Don't overuse - gold should be an accent, not dominant
- ❌ Don't use for body text (readability)

### Neutral Colors: Black & White

The foundation of our luxury aesthetic.

| Color | Hex | Usage | CSS Variable |
|-------|-----|-------|--------------|
| **Pure Black** | `#0A0A0A` | Dark backgrounds, luxury sections | `--veroblack` |
| **Charcoal** | `#1A1A1A` | Secondary dark backgrounds | `--veroblack-charcoal` |
| **Soft Black** | `#2A2A2A` | Tertiary dark backgrounds | `--veroblack-soft` |
| **White** | `#FFFFFF` | Card backgrounds, light areas | `--verowhite` |
| **Cream** | `#FDFBF7` | Subtle backgrounds, sections | `--verocream` |
| **Light Gray** | `#F8F9FA` | Borders, dividers | `--verogray` |
| **Medium Gray** | `#6C757D` | Secondary text, labels | `--verogray-dark` |
| **Text Primary** | `#212529` | Body text, headings | `--verotext` |

### Category Colors

Used for badges, labels, and category differentiation.

| Category | Color | Tailwind Class | Usage |
|----------|-------|----------------|-------|
| **New Arrivals** | Green | `bg-green-500` | Latest additions |
| **Special Price** | Red | `bg-red-500` | Sales, discounts |
| **Limited Editions** | Purple | `bg-purple-500` | Exclusive models |
| **Rare Models** | Amber | `bg-amber-500` | Hard to find |
| **Pre-Order** | Blue | `bg-blue-500` | Upcoming releases |
| **Coming Soon** | Indigo | `bg-indigo-500` | Announced models |

### Semantic Colors

For UI states and feedback.

| State | Color | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| **Success** | Green | `green-500` | Success messages, confirmations |
| **Warning** | Amber | `amber-500` | Warnings, caution messages |
| **Error** | Red | `red-500` | Errors, destructive actions |
| **Info** | Blue | `blue-500` | Informational messages |

### Color Combinations

**✅ Approved Combinations:**
- Gold + White (Primary CTAs)
- Black + Gold (Luxury sections)
- Cream + Text Primary (Body content)
- White + Subtle Gold border (Product cards)

**❌ Avoid:**
- Gold + Black text (poor contrast)
- Multiple bright colors together
- Bright colors on colored backgrounds

---

## Typography

### Font Family

We use the system font stack for optimal performance and native feel:

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

No custom font files = faster loading, less bandwidth, better UX.

### Font Weights

| Weight | Value | Usage | Example |
|--------|-------|-------|---------|
| **Light** | 300 | Large headings, display text | H1, Hero text |
| **Normal** | 400 | Body text, paragraphs | Body copy |
| **Medium** | 500 | Emphasized text, subheadings | H3, H4 |
| **Semibold** | 600 | Buttons, labels, strong emphasis | CTAs, Tags |
| **Bold** | 700 | Very strong emphasis | Rarely used |

### Type Scale

| Name | Tailwind Class | Size | Usage |
|------|----------------|------|-------|
| **Display** | `text-5xl` | 48px | Hero sections (rare) |
| **Display** | `text-4xl` | 36px | Page titles (rare) |
| **H1** | `text-3xl` | 30px | Main page headings |
| **H2** | `text-2xl` | 24px | Section headings |
| **H3** | `text-xl` | 20px | Subsection headings |
| **H4** | `text-lg` | 18px | Card titles |
| **Body Large** | `text-base` | 16px | Large body text |
| **Body** | `text-sm` | 14px | Default body text |
| **Small** | `text-xs` | 12px | Labels, captions |
| **Micro** | `text-[10px]` | 10px | Tiny labels (rare) |

### Line Heights

| Name | Value | Tailwind Class | Usage |
|------|-------|----------------|-------|
| **Tight** | 1.25 | `leading-tight` | Headings |
| **Normal** | 1.5 | `leading-normal` | Body text |
| **Relaxed** | 1.625 | `leading-relaxed` | Long paragraphs |

### Letter Spacing

| Name | Value | Tailwind Class | Usage |
|------|-------|----------------|-------|
| **Tight** | -0.025em | `tracking-tight` | Large headings |
| **Normal** | 0em | `tracking-normal` | Body text |
| **Wide** | 0.025em | `tracking-wide` | Buttons, labels |
| **Wider** | 0.05em | `tracking-wider` | Small caps |
| **Widest** | 0.1em | `tracking-widest` | Special emphasis |

### Typography Patterns

#### Luxury Headings
```tsx
<h1 className="text-3xl font-light uppercase tracking-wider text-[#212529]">
  Premium Collection
</h1>
```

#### Product Names
```tsx
<h2 className="text-base font-light text-[#212529] hover:text-[#D4AF37] transition-colors">
  AutoArt 1:18 Porsche 911 GT3 RS
</h2>
```

#### Buttons & CTAs
```tsx
<button className="text-sm font-semibold uppercase tracking-wide">
  Add to Cart
</button>
```

#### Price Display (Gold Gradient)
```tsx
<p className="text-xl font-semibold vero-text-gradient">
  €149.95
</p>
```

#### Body Text
```tsx
<p className="text-sm text-[#212529] leading-relaxed">
  Officially licensed 1:18 scale die-cast model...
</p>
```

---

## Spacing & Layout

### Spacing Scale

We use Tailwind's default 4px base spacing scale:

| Name | Value | Tailwind Class | Common Usage |
|------|-------|----------------|--------------|
| **0** | 0px | `p-0` | Reset |
| **1** | 4px | `p-1` | Tight spacing |
| **2** | 8px | `p-2` | Small spacing |
| **3** | 12px | `p-3` | Medium-small |
| **4** | 16px | `p-4` | Default spacing |
| **5** | 20px | `p-5` | Card content |
| **6** | 24px | `p-6` | Card padding |
| **8** | 32px | `p-8` | Section spacing |
| **12** | 48px | `p-12` | Large sections |
| **16** | 64px | `p-16` | Extra large |

### Layout System

#### Container

Maximum width with responsive padding:

```tsx
<div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
  {/* Content */}
</div>
```

#### Sections

Standard section spacing:

```tsx
<section className="w-full px-4 py-8 md:py-12">
  {/* Section content */}
</section>
```

#### Grid Patterns

**Product Grid (1/3/4 columns):**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
  {/* Products */}
</div>
```

**Category Grid (1/3/6 columns):**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
  {/* Categories */}
</div>
```

### Border Radius

| Name | Value | Tailwind Class | Usage |
|------|-------|----------------|-------|
| **Small** | 2px | `rounded-sm` | Small elements |
| **Default** | 4px | `rounded` | Badges |
| **Medium** | 6px | `rounded-md` | Buttons |
| **Large** | 8px | `rounded-lg` | Cards |
| **Extra Large** | 12px | `rounded-xl` | Large cards |
| **Full** | 9999px | `rounded-full` | Pills, avatars |

### Shadows

| Name | Value | Tailwind Class | Usage |
|------|-------|----------------|-------|
| **Small** | Subtle | `shadow-sm` | Cards |
| **Medium** | Moderate | `shadow-md` | Elevated elements |
| **Large** | Strong | `shadow-lg` | Modals |
| **Gold** | Custom | Custom CSS | Luxury hover |

---

## Components

### Cards

#### Standard Vero Card

**The primary card component for products and content.**

```tsx
<div className="vero-card rounded-lg overflow-hidden">
  <div className="relative aspect-square bg-white">
    {/* Image */}
  </div>
  <div className="p-5 space-y-3">
    {/* Content */}
  </div>
</div>
```

**Specifications:**
- Background: White
- Border: `1px solid rgba(212, 175, 55, 0.15)`
- Border radius: `rounded-lg`
- Padding: `p-5` or `p-6`
- Shadow: `shadow-sm`
- Hover: Lift + scale + gold border

**Custom CSS (in globals.css):**
```css
.vero-card {
  background: white;
  border: 1px solid rgba(212, 175, 55, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.vero-card:hover {
  border-color: #D4AF37;
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 20px 48px rgba(212, 175, 55, 0.25);
}
```

### Buttons

#### Primary Button (.vero-button)

**The main call-to-action button with gold styling.**

```tsx
<button className="vero-button px-8 py-3 rounded-md">
  Add to Cart
</button>
```

**Specifications:**
- Background: Gold (`#D4AF37`)
- Text: White, uppercase, semibold, tracking-wide
- Padding: `px-6 py-3` or `px-8 py-3`
- Border radius: `rounded-md`
- Hover: Darker gold + lift + ripple effect

#### Outline Button (.vero-button-outline)

```tsx
<button className="vero-button-outline px-8 py-3 rounded-md">
  View Details
</button>
```

**Specifications:**
- Background: Transparent
- Border: `2px solid #D4AF37`
- Text: Gold color
- Hover: Fill with gold, text white

#### Shadcn Button

For secondary actions:

```tsx
<Button variant="outline" size="lg">
  Learn More
</Button>
```

### Badges

#### Category Badges

```tsx
<Badge className="bg-green-500 text-white">NEW</Badge>
<Badge className="bg-red-500 text-white">SALE</Badge>
<Badge className="bg-purple-500 text-white">LIMITED</Badge>
```

**Specifications:**
- Padding: `px-4 py-1.5`
- Font: `text-xs font-bold uppercase`
- Border radius: `rounded-md` or `rounded-full`
- Shadow: `shadow-lg`

### Inputs

#### Standard Input (Shadcn)

```tsx
<Input
  type="text"
  placeholder="Search products..."
  className="h-10 px-3 rounded-md"
/>
```

**Specifications:**
- Height: `h-9` or `h-10`
- Padding: `px-3 py-2`
- Border: `border-input`
- Focus: Ring with primary color

### Navigation

#### Header Pattern

```tsx
<header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-[#D4AF37]/20 py-6">
  <div className="w-full flex items-center gap-4 px-4 lg:px-12">
    {/* Logo, Nav, Search, Icons */}
  </div>
</header>
```

**Specifications:**
- Height: Auto (py-6)
- Background: `bg-white/95` with `backdrop-blur-md`
- Border: `border-b border-[#D4AF37]/20`
- Sticky positioning

---

## Patterns & Best Practices

### Product Cards

**DO:**
- ✅ Use `.vero-card` class
- ✅ Include favorite heart icon
- ✅ Use aspect-square for images
- ✅ Apply gold gradient to prices
- ✅ Add hover lift animation
- ✅ Use `object-contain` for product images

**DON'T:**
- ❌ Use different card styles
- ❌ Skip hover effects
- ❌ Use `object-cover` (crops product)
- ❌ Forget responsive behavior

### Hover Effects

All interactive elements should have hover effects:

```tsx
// Cards
className="transition-all duration-300 hover:scale-[1.02]"

// Buttons
className="transition-all duration-300 hover:scale-105"

// Links
className="transition-colors duration-300 hover:text-[#D4AF37]"
```

### Gradients

#### Gold Text Gradient

```tsx
<p className="vero-text-gradient text-xl font-semibold">
  €149.95
</p>
```

#### Shimmer Text

```tsx
<h1 className="vero-elegant-text text-3xl">
  Premium Collection
</h1>
```

### Responsive Design

**Mobile-First Approach:**

```tsx
<div className="
  grid
  grid-cols-1           // Mobile
  sm:grid-cols-2        // Tablet
  lg:grid-cols-4        // Desktop
  gap-4                 // Mobile gap
  lg:gap-6              // Desktop gap
">
```

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## Accessibility

### Color Contrast

All text meets WCAG AA standards:
- Normal text: Minimum 4.5:1
- Large text: Minimum 3:1
- Gold on white: ✅ Pass
- White on gold: ✅ Pass
- Text primary on white: ✅ Pass

### Focus Indicators

All interactive elements have visible focus:

```tsx
className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
```

### Alt Text

All images require descriptive alt text:

```tsx
<Image
  src={product.image}
  alt="AutoArt 1:18 Porsche 911 GT3 RS - Silver Metallic"
/>
```

### Touch Targets

Minimum 44px for all interactive elements:

```tsx
<button className="h-10 px-6"> // 40px height minimum
```

### Semantic HTML

Use proper HTML elements:
- `<button>` for actions
- `<a>` for navigation
- `<nav>` for navigation sections
- `<header>`, `<main>`, `<footer>` for page structure

---

## Development Guidelines

### File Organization

```
src/
├── design/
│   └── tokens.ts              # Design tokens
├── app/
│   └── globals.css           # Custom Vero classes
├── ui/
│   ├── shadcn/               # Shadcn components
│   ├── products/             # Product components
│   ├── nav/                  # Navigation components
│   └── [feature]/            # Feature components
└── components/               # Shared components
```

### Naming Conventions

**Components:**
- PascalCase: `ProductCard.tsx`
- Descriptive: `CompactProductCard.tsx`
- Vero prefix for custom: `VeroButton.tsx` (if needed)

**CSS Classes:**
- Vero prefix: `.vero-card`, `.vero-button`
- Descriptive: `.vero-text-gradient`
- Lowercase with hyphens

### Import Design Tokens

```typescript
import { colors, spacing, borderRadius } from '@/design/tokens';
```

### Using Custom Vero Classes

Available classes (see `src/app/globals.css` lines 374-609):

```tsx
// Cards
className="vero-card"
className="vero-card-dark"

// Buttons
className="vero-button"
className="vero-button-outline"

// Gradients
className="vero-gradient"
className="vero-luxury-gradient"
className="vero-text-gradient"
className="vero-elegant-text"

// Glass effects
className="vero-glass"
className="vero-glass-dark"
```

### Code Style

**Tailwind Class Order:**
1. Layout (flex, grid)
2. Sizing (w-, h-)
3. Spacing (p-, m-, gap-)
4. Typography (text-, font-)
5. Colors (bg-, text-, border-)
6. Effects (shadow-, opacity-)
7. Transitions (transition-, duration-)
8. States (hover:, focus:)

**Example:**
```tsx
className="flex items-center justify-center w-full h-10 px-6 py-3 text-sm font-semibold uppercase tracking-wide bg-[#D4AF37] text-white rounded-md shadow-sm transition-all duration-300 hover:bg-[#B8941F] hover:scale-105"
```

### Testing Checklist

Before merging:
- [ ] Design system compliance (colors, spacing, typography)
- [ ] Responsive behavior (mobile, tablet, desktop)
- [ ] Hover/focus states
- [ ] Accessibility (contrast, focus, alt text)
- [ ] Performance (image optimization, lazy loading)
- [ ] Browser compatibility

---

## Resources

### Key Files
- Design System: `CLAUDE.md` (lines 197-473)
- Design Tokens: `src/design/tokens.ts`
- Custom CSS: `src/app/globals.css` (lines 374-609)
- V0 Integration: `v0-instructions.md`

### Commands
- Audit component: `/design-audit [file_path]`
- Check consistency: `/consistency-check`
- Generate component: `/vero-component [name] [type]`

### External Links
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Next.js 15 Documentation](https://nextjs.org/docs)

---

**Questions?** Refer to `CLAUDE.md` for detailed technical specifications or use the custom commands to audit and generate components.
