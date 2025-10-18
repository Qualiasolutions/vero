---
description: Check design consistency across all components in the Veromodels project
---

# Project-Wide Design Consistency Check

You are performing a comprehensive consistency analysis across the entire Veromodels e-commerce platform to identify design drift and inconsistencies.

## Objective

Analyze all components to ensure:
1. Consistent color usage across components
2. Uniform spacing patterns
3. Matching component styles (cards, buttons, etc.)
4. Consistent typography hierarchy
5. Uniform animation and transition patterns
6. Aligned responsive breakpoints

## Analysis Scope

Examine these key directories:
- `src/ui/products/*` - Product components
- `src/ui/nav/*` - Navigation components
- `src/ui/shadcn/*` - Shadcn/UI components
- `src/components/*` - Shared components
- `src/app/(store)/*` - Store pages

## Consistency Analysis Steps

### Step 1: Color Usage Analysis

**Examine all component files for:**
1. Gold color usage (`#D4AF37`, `#E6C757`, `#B8941F`)
2. Black/neutral usage (`#0A0A0A`, `#212529`, `#6C757D`)
3. Category badge colors (green, red, purple, amber, blue, indigo)
4. Any custom or arbitrary colors not in the design system

**Generate Report:**
```markdown
## COLOR CONSISTENCY REPORT

### Compliant Components
- [Component name] at [file path] - Uses approved gold palette
- [Component name] at [file path] - Uses semantic colors correctly

### Components with Color Issues
- **[Component name]** at [file path]:
  - Issue: Uses arbitrary color `#ABC123` at line X
  - Should use: `#D4AF37` (Vero gold)
  - Severity: High

### Color Usage Statistics
- Total components analyzed: X
- Fully compliant: X (X%)
- Need minor fixes: X (X%)
- Need major fixes: X (X%)

### Most Common Color Violations
1. [Color] used in X components (should be [correct color])
2. [Color] used in X components (should be [correct color])
```

### Step 2: Card Component Consistency

**Compare all card-style components:**
1. Product cards (`src/ui/products/*`)
2. Category cards (in homepage)
3. Feature cards
4. Content cards

**Check for consistency in:**
- Background color (should be white)
- Border (1px solid rgba(212, 175, 55, 0.15))
- Border radius (rounded-lg or rounded-xl)
- Padding (p-5 or p-6)
- Hover effects (lift, scale, border color change)
- Shadow (shadow-sm or custom gold shadow)

**Generate Report:**
```markdown
## CARD CONSISTENCY REPORT

### Standard Pattern (from product-list.tsx)
- Background: white
- Border: 1px solid rgba(212, 175, 55, 0.15)
- Border radius: rounded-lg
- Padding: p-5
- Hover: scale-[1.02], gold border
- Class: .vero-card

### Component Analysis

#### ✓ Fully Consistent Cards
- [Component name] at [file path] - Perfect match

#### ⚠ Partially Consistent Cards
- **[Component name]** at [file path]:
  - Matches: Border radius, padding
  - Differs: Using shadow-md instead of shadow-sm
  - Recommendation: Change to shadow-sm for consistency

#### ✗ Inconsistent Cards
- **[Component name]** at [file path]:
  - Uses different border color
  - Missing hover effects
  - Wrong padding (p-4 instead of p-5)
  - Action required: Refactor to use .vero-card class

### Recommendations
1. [Specific action item]
2. [Specific action item]
```

### Step 3: Button Consistency

**Compare all button implementations:**
1. Primary buttons (should use `.vero-button`)
2. Outline buttons (should use `.vero-button-outline`)
3. Shadcn Button variants
4. Link-style buttons

**Check for:**
- Color consistency (gold vs semantic colors)
- Padding consistency (px-6 py-3 or px-8 py-3)
- Font weight (should be semibold/600)
- Text transform (uppercase for primary actions)
- Border radius (rounded-md)
- Hover effects (scale, color change)

**Generate Report:**
```markdown
## BUTTON CONSISTENCY REPORT

### Standard Patterns

**Primary Button (.vero-button)**:
- Background: #D4AF37
- Text: white, uppercase, tracking-wide, font-semibold
- Padding: px-8 py-3
- Hover: darker gold, translateY(-2px)

**Outline Button (.vero-button-outline)**:
- Border: 2px solid #D4AF37
- Text: #D4AF37
- Hover: fill with gold

### Component Analysis

#### ✓ Consistent Button Usage
- [Component] at [file path] - Uses .vero-button correctly
- [Component] at [file path] - Proper Shadcn Button variant

#### ✗ Inconsistent Button Usage
- **[Component]** at [file path]:
  - Issue: Custom button with different styling
  - Should use: .vero-button class
  - Line: X

### Button Usage Statistics
- Total buttons: X
- Using .vero-button: X (X%)
- Using Shadcn Button: X (X%)
- Custom/Inconsistent: X (X%)

### Action Items
1. Convert custom buttons to .vero-button at [files]
2. Standardize padding across all buttons
```

### Step 4: Typography Consistency

**Analyze text hierarchy across pages:**
1. Heading sizes (h1, h2, h3, h4)
2. Body text sizes
3. Font weights used
4. Letter spacing patterns
5. Line heights

**Check for:**
- Consistent heading hierarchy
- Matching font sizes for similar content
- Proper use of font weights (light for headings, semibold for emphasis)
- Uppercase + tracking-wide for labels/buttons

**Generate Report:**
```markdown
## TYPOGRAPHY CONSISTENCY REPORT

### Standard Hierarchy (from design system)
- H1: text-3xl, font-light
- H2: text-2xl, font-light
- H3: text-xl, font-normal
- Body: text-sm or text-base
- Labels: text-xs, uppercase, tracking-wide, font-semibold

### Component Analysis

#### ✓ Consistent Typography
- [Page/Component] - Proper heading hierarchy
- [Page/Component] - Consistent body text sizing

#### ⚠ Typography Issues
- **[Page/Component]** at [file path]:
  - H1 uses text-4xl (should be text-3xl)
  - Body text inconsistent (mixing text-sm and text-base)
  - Missing uppercase on buttons
  - Line: X

### Typography Violations by Type
1. Heading size inconsistency: X components
2. Missing uppercase on labels: X components
3. Wrong font weights: X components
4. Missing letter spacing: X components

### Recommendations
[Specific fixes needed]
```

### Step 5: Spacing Pattern Consistency

**Analyze spacing across components:**
1. Card padding (should be p-5 or p-6)
2. Section spacing (should be py-8 to py-12)
3. Grid gaps (should be gap-4 to gap-6)
4. Container padding (px-4 mobile, px-8+ desktop)

**Check for:**
- Arbitrary spacing values
- Inconsistent padding patterns
- Misaligned grid gaps

**Generate Report:**
```markdown
## SPACING CONSISTENCY REPORT

### Standard Patterns
- Card padding: p-5 or p-6
- Section spacing: py-8, py-12
- Grid gaps: gap-4 (mobile), gap-6 (tablet+)
- Container padding: px-4 (mobile) to px-12 (desktop)

### Component Analysis

#### ✓ Consistent Spacing
- [Component] - Uses proper Tailwind scale

#### ✗ Spacing Violations
- **[Component]** at [file path]:
  - Uses arbitrary p-[13px]
  - Should use: p-3 (12px) or p-4 (16px)
  - Line: X

### Arbitrary Value Count
- Total arbitrary spacing values found: X
- Components affected: [list]

### Action Items
1. Replace p-[13px] with p-3 at [locations]
2. Standardize card padding to p-5 across [components]
```

### Step 6: Animation & Transition Consistency

**Check animation patterns:**
1. Hover animations (lift, scale)
2. Transition durations (300ms, 500ms)
3. Easing functions
4. Custom animation classes (animate-fade-in, etc.)

**Generate Report:**
```markdown
## ANIMATION CONSISTENCY REPORT

### Standard Patterns
- Default transition: transition-all duration-300
- Hover lift: translateY(-4px) to translateY(-6px)
- Hover scale: scale-[1.02] to scale-105
- Easing: ease-in-out or cubic-bezier(0.4, 0, 0.2, 1)

### Component Analysis

#### ✓ Consistent Animations
- [Component] - Proper hover effects

#### ⚠ Animation Issues
- **[Component]** at [file path]:
  - Missing hover transition
  - Using duration-200 (should be duration-300)
  - Inconsistent scale value

### Recommendations
[Specific fixes for animation consistency]
```

### Step 7: Responsive Design Consistency

**Check responsive patterns:**
1. Grid columns (1/3/4 or 1/3/6 patterns)
2. Breakpoint usage (sm, md, lg, xl)
3. Mobile-first approach
4. Responsive spacing/padding

**Generate Report:**
```markdown
## RESPONSIVE CONSISTENCY REPORT

### Standard Patterns
- Product grids: 1 col mobile, 3 tablet, 4 desktop
- Category grids: 1 col mobile, 3 tablet, 6 desktop
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### Component Analysis

#### ✓ Consistent Responsive Design
- [Component] - Proper breakpoint usage

#### ✗ Responsive Issues
- **[Component]** at [file path]:
  - Missing mobile breakpoint
  - Fixed width not responsive
  - Wrong column count at tablet

### Action Items
[Specific responsive fixes needed]
```

## Cross-Component Comparison

Compare similar components directly:

```markdown
## COMPONENT COMPARISON MATRIX

### Product Cards
| Component | Border | Padding | Hover | Shadow | Consistent? |
|-----------|--------|---------|-------|--------|-------------|
| ProductList | ✓ | ✓ | ✓ | ✓ | ✓ YES |
| CompactCard | ✓ | ⚠ p-3 | ✓ | ✗ missing | ⚠ PARTIAL |
| EnhancedCard | ✓ | ✓ | ✗ different | ✓ | ⚠ PARTIAL |

### Buttons
| Component | Class | Padding | Style | Hover | Consistent? |
|-----------|-------|---------|-------|-------|-------------|
| [Component] | .vero-button | px-8 py-3 | ✓ | ✓ | ✓ YES |
| [Component] | custom | px-6 py-2 | ✗ | ✗ | ✗ NO |
```

## Final Consistency Score

Generate an overall consistency score:

```markdown
# PROJECT-WIDE CONSISTENCY REPORT

## Overall Consistency Score: X/100

### Category Scores
- Color Consistency: X/15
- Card Components: X/15
- Button Components: X/15
- Typography: X/15
- Spacing: X/15
- Animations: X/15
- Responsive Design: X/10

## Priority Action Items

### 🔴 Critical (Must Fix)
1. [Issue] - Affects X components
2. [Issue] - Breaks brand consistency

### 🟡 Important (Should Fix)
1. [Issue] - Minor inconsistency
2. [Issue] - Optimization opportunity

### 🟢 Optional (Nice to Have)
1. [Issue] - Enhancement
2. [Issue] - Future improvement

## Component Refactoring Recommendations

### Components to Refactor
1. **[Component Name]** at [file path]
   - Issues: [list]
   - Effort: Low/Medium/High
   - Impact: Low/Medium/High
   - Priority: High/Medium/Low

### New Components to Create
1. [Shared component idea] - Would eliminate duplication in [X] places

## Conclusion

[Summary of overall consistency state]
[Key recommendations]
[Next steps]
```

## Execution Instructions

1. Start by reading all component files in the specified directories
2. Build a mental model of patterns used in each component
3. Compare components against the design system (CLAUDE.md)
4. Compare components against each other
5. Generate all reports as specified above
6. Provide prioritized action items
7. Ask user if they want you to implement fixes

---

**BEGIN CONSISTENCY CHECK NOW**
