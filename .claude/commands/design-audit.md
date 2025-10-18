---
description: Audit a component or file for Veromodels design system compliance
args:
  - name: file_path
    description: Path to the file to audit (e.g., src/ui/products/product-card.tsx)
    required: true
---

# Design System Audit

You are performing a comprehensive design system audit for the Veromodels e-commerce platform.

## File to Audit
**Target**: {{file_path}}

## Audit Checklist

Perform a thorough analysis of the specified file against the Veromodels design system defined in `CLAUDE.md` (lines 197-473) and `src/design/tokens.ts`.

### 1. Color Compliance
**Check all color values used in the file:**

✓ **COMPLIANT Colors** (should ONLY use these):
- Gold: `#D4AF37`, `#E6C757`, `#B8941F`, `#F5E6D3`
- Black: `#0A0A0A`, `#1A1A1A`, `#2A2A2A`
- Neutral: `#FFFFFF`, `#FDFBF7`, `#F8F9FA`, `#6C757D`, `#212529`
- Category colors: `green-500`, `red-500`, `purple-500`, `amber-500`, `blue-500`, `indigo-500`
- Shadcn semantic colors (via CSS variables)
- Custom Vero CSS variables: `var(--verogold)`, `var(--veroblack)`, etc.

✗ **VIOLATIONS to report**:
- Any arbitrary hex codes not in the palette
- Random Tailwind colors that don't match (e.g., `bg-pink-400`)
- Hardcoded colors that should use CSS variables
- Missing color definitions

**Report Format:**
```
COLOR AUDIT:
✓ Compliant: [list all correct color usages]
✗ Violations: [list any non-compliant colors with line numbers]
→ Recommendations: [suggest fixes]
```

### 2. Spacing Compliance
**Check all spacing values (padding, margin, gap):**

✓ **COMPLIANT Spacing** (Tailwind scale only):
- `p-1` through `p-24` (4px base)
- `m-1` through `m-24`
- `gap-1` through `gap-24`
- NO arbitrary values like `p-[17px]`

✗ **VIOLATIONS to report**:
- Any arbitrary pixel values: `p-[13px]`, `m-[27px]`
- Inconsistent spacing patterns
- Missing responsive spacing adjustments

**Report Format:**
```
SPACING AUDIT:
✓ Compliant: [confirm Tailwind scale usage]
✗ Violations: [list arbitrary values with line numbers]
→ Recommendations: [suggest Tailwind equivalents]
```

### 3. Typography Compliance
**Check font usage:**

✓ **COMPLIANT Typography**:
- Font family: System default (no custom fonts unless specified)
- Font sizes: Tailwind classes (`text-xs` to `text-5xl`)
- Font weights: 300, 400, 500, 600, 700
- Uppercase + `tracking-wide` for buttons/labels
- Light weights (300) for headings

✗ **VIOLATIONS to report**:
- Custom font imports not in design system
- Arbitrary font sizes: `text-[17px]`
- Inconsistent heading hierarchy
- Missing letter spacing on uppercase text

**Report Format:**
```
TYPOGRAPHY AUDIT:
✓ Compliant: [confirm proper usage]
✗ Violations: [list issues with line numbers]
→ Recommendations: [suggest fixes]
```

### 4. Component Pattern Compliance
**Check if component follows established patterns:**

✓ **COMPLIANT Patterns**:
- Uses `.vero-card`, `.vero-button`, or other Vero classes when appropriate
- Cards have `rounded-lg` or `rounded-xl`
- Buttons use `vero-button` class or proper Shadcn variant
- Includes hover effects (lift, scale, color transitions)
- Uses proper animation utilities (`animate-fade-in`, `transition-all`)
- Follows responsive grid patterns (1/3/4 or 1/3/6 columns)

✗ **VIOLATIONS to report**:
- Missing hover effects on interactive elements
- Inconsistent border radius (not using lg/xl)
- Not using existing Vero component classes
- Missing transitions/animations
- Inconsistent card/button styling compared to other components

**Report Format:**
```
COMPONENT PATTERN AUDIT:
✓ Compliant: [list correct patterns]
✗ Violations: [list deviations with line numbers]
→ Recommendations: [suggest pattern alignment]
```

### 5. Vero Class Usage
**Check if custom Vero classes are properly used:**

Available custom classes (from `globals.css`):
- `.vero-card`, `.vero-card-dark`
- `.vero-button`, `.vero-button-outline`
- `.vero-gradient`, `.vero-black-gradient`, `.vero-luxury-gradient`, `.vero-gold-gradient`
- `.vero-text-gradient`, `.vero-elegant-text`
- `.vero-glass`, `.vero-glass-dark`

**Report Format:**
```
VERO CLASS USAGE:
✓ Correctly used: [list instances]
✗ Should be using but isn't: [opportunities to use Vero classes]
→ Recommendations: [suggest adding Vero classes]
```

### 6. Accessibility Compliance
**Check accessibility requirements:**

✓ **COMPLIANT**:
- Color contrast ratio ≥ 4.5:1
- Focus indicators visible (ring utilities)
- Alt text on images
- Interactive elements ≥ 44px touch target
- Semantic HTML (buttons, links, headings)

✗ **VIOLATIONS to report**:
- Missing alt text
- Insufficient contrast
- Missing focus states
- Touch targets too small
- Non-semantic elements used interactively

**Report Format:**
```
ACCESSIBILITY AUDIT:
✓ Compliant: [list accessible features]
✗ Violations: [list issues with line numbers]
→ Recommendations: [suggest accessibility improvements]
```

### 7. Responsive Design
**Check responsive behavior:**

✓ **COMPLIANT**:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Responsive grid columns
- Responsive padding/spacing
- Responsive typography (if needed)

✗ **VIOLATIONS to report**:
- Fixed widths that don't respond
- Missing mobile styles
- Improper breakpoint usage
- Non-responsive images

**Report Format:**
```
RESPONSIVE AUDIT:
✓ Compliant: [list responsive features]
✗ Violations: [list issues with line numbers]
→ Recommendations: [suggest responsive improvements]
```

## Comparison with Similar Components

Compare the audited file with similar components in the project:
- For product cards: check `src/ui/products/product-list.tsx`
- For buttons: check usage of `.vero-button` throughout the project
- For navigation: check `src/ui/nav/nav.tsx`
- For layout: check `src/app/(store)/page.tsx`

**Report Format:**
```
CONSISTENCY COMPARISON:
Similar component: [file path]
✓ Matches pattern: [list similarities]
✗ Deviates from pattern: [list differences]
→ Recommendations: [suggest alignment]
```

## Final Audit Report

Provide a comprehensive summary:

```markdown
# Design System Audit Report
**File**: {{file_path}}
**Date**: [current date]

## Executive Summary
[Overall compliance status: Excellent / Good / Needs Improvement / Poor]
[Brief overview of findings]

## Compliance Score
- Color Compliance: X/10
- Spacing Compliance: X/10
- Typography Compliance: X/10
- Component Patterns: X/10
- Vero Class Usage: X/10
- Accessibility: X/10
- Responsive Design: X/10

**TOTAL SCORE**: X/70

## Critical Issues (Must Fix)
1. [Issue 1 with line number]
2. [Issue 2 with line number]

## Recommendations (Should Fix)
1. [Recommendation 1]
2. [Recommendation 2]

## Optional Improvements (Nice to Have)
1. [Improvement 1]
2. [Improvement 2]

## Specific Code Changes

### Change 1: [Description]
**Location**: Line X
**Current**:
```tsx
[current code]
```

**Recommended**:
```tsx
[improved code]
```

### Change 2: [Description]
[Continue with specific fixes...]

## Conclusion
[Summary of what needs to be done to achieve full compliance]
```

## Action Items

After completing the audit:
1. Present the full audit report to the user
2. Ask if they want you to implement the recommended changes
3. Prioritize critical issues over optional improvements
4. If implementing fixes, do them one at a time with confirmation

---

**BEGIN AUDIT NOW**
