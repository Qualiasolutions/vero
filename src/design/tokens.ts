/**
 * Veromodels Design System Tokens
 *
 * Centralized design tokens for the Veromodels luxury e-commerce platform.
 * These tokens ensure consistency across all components and pages.
 *
 * IMPORTANT: Always import and use these tokens instead of hardcoding values.
 * Never create arbitrary colors, spacing, or other design values.
 */

// ============================================================================
// COLOR SYSTEM
// ============================================================================

/**
 * Veromodels Luxury Palette
 * The core brand colors that define the premium black & gold aesthetic
 */
export const colors = {
	// Gold Palette (Primary Brand Color)
	gold: {
		primary: "#D4AF37",
		light: "#E6C757",
		dark: "#B8941F",
		champagne: "#F5E6D3",
	},

	// Black Palette
	black: {
		pure: "#0A0A0A",
		charcoal: "#1A1A1A",
		soft: "#2A2A2A",
	},

	// Neutral Palette
	neutral: {
		white: "#FFFFFF",
		cream: "#FDFBF7",
		gray: "#F8F9FA",
		grayDark: "#6C757D",
		textPrimary: "#212529",
	},

	// Category Badge Colors (matching store.config.ts)
	categories: {
		newArrivals: "rgb(34 197 94)", // green-500
		specialPrice: "rgb(239 68 68)", // red-500
		limitedEdition: "rgb(168 85 247)", // purple-500
		rare: "rgb(245 158 11)", // amber-500
		preOrder: "rgb(59 130 246)", // blue-500
		comingSoon: "rgb(99 102 241)", // indigo-500
	},

	// Semantic Colors (from Shadcn theme)
	semantic: {
		success: "rgb(34 197 94)", // green-500
		warning: "rgb(245 158 11)", // amber-500
		error: "rgb(239 68 68)", // red-500
		info: "rgb(59 130 246)", // blue-500
	},
} as const;

/**
 * CSS variable names for colors (as defined in globals.css)
 */
export const cssVars = {
	gold: "var(--verogold)",
	goldLight: "var(--verogold-light)",
	goldDark: "var(--verogold-dark)",
	goldChampagne: "var(--verogold-champagne)",
	black: "var(--veroblack)",
	blackCharcoal: "var(--veroblack-charcoal)",
	blackSoft: "var(--veroblack-soft)",
	white: "var(--verowhite)",
	cream: "var(--verocream)",
	gray: "var(--verogray)",
	grayDark: "var(--verogray-dark)",
	text: "var(--verotext)",
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

/**
 * Font family stack
 */
export const fonts = {
	sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"].join(", "),
} as const;

/**
 * Font weights
 */
export const fontWeights = {
	light: 300,
	normal: 400,
	medium: 500,
	semibold: 600,
	bold: 700,
} as const;

/**
 * Font sizes (matching Tailwind classes)
 */
export const fontSizes = {
	xs: "0.75rem", // 12px - text-xs
	sm: "0.875rem", // 14px - text-sm
	base: "1rem", // 16px - text-base
	lg: "1.125rem", // 18px - text-lg
	xl: "1.25rem", // 20px - text-xl
	"2xl": "1.5rem", // 24px - text-2xl
	"3xl": "1.875rem", // 30px - text-3xl
	"4xl": "2.25rem", // 36px - text-4xl
	"5xl": "3rem", // 48px - text-5xl
} as const;

/**
 * Line heights
 */
export const lineHeights = {
	tight: 1.25,
	normal: 1.5,
	relaxed: 1.625,
} as const;

/**
 * Letter spacing
 */
export const letterSpacing = {
	tight: "-0.025em",
	normal: "0em",
	wide: "0.025em",
	wider: "0.05em",
	widest: "0.1em",
} as const;

// ============================================================================
// SPACING SYSTEM
// ============================================================================

/**
 * Spacing scale (matching Tailwind)
 * Use these values for padding, margin, gap, etc.
 */
export const spacing = {
	0: "0px",
	1: "0.25rem", // 4px
	2: "0.5rem", // 8px
	3: "0.75rem", // 12px
	4: "1rem", // 16px
	5: "1.25rem", // 20px
	6: "1.5rem", // 24px
	8: "2rem", // 32px
	10: "2.5rem", // 40px
	12: "3rem", // 48px
	16: "4rem", // 64px
	20: "5rem", // 80px
	24: "6rem", // 96px
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

/**
 * Border radius values
 */
export const borderRadius = {
	none: "0px",
	sm: "0.125rem", // 2px
	DEFAULT: "0.25rem", // 4px
	md: "0.375rem", // 6px
	lg: "0.5rem", // 8px
	xl: "0.75rem", // 12px
	"2xl": "1rem", // 16px
	full: "9999px",
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

/**
 * Box shadow values
 */
export const shadows = {
	sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
	DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
	md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
	lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
	xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
	"2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
	// Custom gold shadows
	gold: "0 4px 16px rgba(212, 175, 55, 0.2)",
	goldLg: "0 20px 48px rgba(212, 175, 55, 0.25), 0 8px 16px rgba(0, 0, 0, 0.1)",
} as const;

// ============================================================================
// LAYOUT
// ============================================================================

/**
 * Layout constants
 */
export const layout = {
	containerMaxWidth: "1400px",
	containerPadding: {
		mobile: spacing[4],
		tablet: spacing[8],
		desktop: spacing[12],
	},
	sectionSpacing: {
		sm: spacing[8],
		md: spacing[12],
		lg: spacing[16],
	},
	gridGap: {
		sm: spacing[4],
		md: spacing[6],
		lg: spacing[8],
	},
} as const;

// ============================================================================
// TRANSITIONS & ANIMATIONS
// ============================================================================

/**
 * Transition durations
 */
export const transitions = {
	fast: "150ms",
	normal: "300ms",
	slow: "500ms",
	slower: "700ms",
} as const;

/**
 * Transition timing functions
 */
export const easings = {
	default: "ease-in-out",
	smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
	bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

// ============================================================================
// COMPONENT DEFAULTS
// ============================================================================

/**
 * Default values for common components
 */
export const components = {
	button: {
		height: "40px",
		padding: `${spacing[3]} ${spacing[6]}`,
		borderRadius: borderRadius.md,
		fontWeight: fontWeights.semibold,
		fontSize: fontSizes.sm,
		transition: `all ${transitions.normal} ${easings.default}`,
	},
	card: {
		padding: spacing[6],
		borderRadius: borderRadius.lg,
		shadow: shadows.sm,
		border: "1px solid rgba(212, 175, 55, 0.15)",
	},
	input: {
		height: "40px",
		padding: `${spacing[2]} ${spacing[3]}`,
		borderRadius: borderRadius.md,
		border: "1px solid rgb(214.3 31.8% 91.4%)",
	},
	badge: {
		padding: `${spacing[1]} ${spacing[3]}`,
		borderRadius: borderRadius.md,
		fontSize: fontSizes.xs,
		fontWeight: fontWeights.semibold,
	},
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

/**
 * Responsive breakpoints (matching Tailwind defaults)
 */
export const breakpoints = {
	xs: "400px",
	sm: "640px",
	md: "768px",
	lg: "1024px",
	xl: "1280px",
	"2xl": "1536px",
	smb: "720px", // Custom breakpoint from globals.css
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

/**
 * Z-index values for layering
 */
export const zIndex = {
	base: 0,
	dropdown: 10,
	sticky: 20,
	fixed: 30,
	modalBackdrop: 40,
	modal: 50,
	popover: 60,
	tooltip: 70,
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ColorKey = keyof typeof colors;
export type SpacingKey = keyof typeof spacing;
export type FontSizeKey = keyof typeof fontSizes;
export type BorderRadiusKey = keyof typeof borderRadius;
export type ShadowKey = keyof typeof shadows;
export type BreakpointKey = keyof typeof breakpoints;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a color value by key
 */
export function getColor(category: keyof typeof colors, shade?: string): string {
	const colorGroup = colors[category];
	if (!shade) return typeof colorGroup === "string" ? colorGroup : (Object.values(colorGroup)[0] ?? colors.neutral.textPrimary);
	return (colorGroup as Record<string, string>)[shade] || colors.neutral.textPrimary;
}

/**
 * Get spacing value by key
 */
export function getSpacing(key: SpacingKey): string {
	return spacing[key];
}

/**
 * Get font size by key
 */
export function getFontSize(key: FontSizeKey): string {
	return fontSizes[key];
}

/**
 * Get border radius by key
 */
export function getBorderRadius(key: BorderRadiusKey): string {
	return borderRadius[key];
}

/**
 * Get shadow by key
 */
export function getShadow(key: ShadowKey): string {
	return shadows[key];
}

/**
 * Create a responsive value object for CSS-in-JS
 */
export function responsive<T>(mobile: T, tablet?: T, desktop?: T) {
	return {
		mobile,
		tablet: tablet || mobile,
		desktop: desktop || tablet || mobile,
	};
}
