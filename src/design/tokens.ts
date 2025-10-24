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
 * Professional automotive-inspired color scheme with sophisticated champagne gold
 */
export const colors = {
	// Luxury Metallic Gold Palette (Primary Luxury Brand Color)
	gold: {
		champagne: "#D4AF37",
		light: "#E8C468",
		dark: "#B8941F",
		pale: "#F5E6C3",
	},

	// Rose Gold (Premium Accent)
	roseGold: {
		primary: "#B76E79",
		light: "#D4909C",
		dark: "#8E5560",
	},

	// Black Palette (Deep & Sophisticated)
	black: {
		pure: "#0F0F0F",
		charcoal: "#1A1A1A",
		soft: "#2A2A2A",
		medium: "#374151",
	},

	// Platinum & Silvers
	platinum: {
		primary: "#E5E4E2",
		silver: "#C0C0C0",
		silverDark: "#A8A8A8",
	},

	// Sophisticated Neutrals
	neutral: {
		white: "#FFFFFF",
		offWhite: "#FAF9F6",
		cream: "#F5F3EF",
		grayLightest: "#F9FAFB",
		grayLight: "#F3F4F6",
		grayMedium: "#9CA3AF",
		grayDark: "#6B7280",
		grayDarker: "#4B5563",
	},

	// Text Colors
	text: {
		primary: "#111827",
		secondary: "#374151",
		muted: "#6B7280",
		light: "#9CA3AF",
	},

	// Premium Accents
	accents: {
		burgundy: "#8B1538",
		burgundyLight: "#A02348",
		navy: "#1E3A5F",
		navyLight: "#2C4F7C",
		forest: "#2C5530",
		forestLight: "#3D7043",
	},

	// Category Badge Colors (Professional palette)
	categories: {
		newArrivals: "#3D7043", // forest green
		specialPrice: "#8B1538", // burgundy
		limitedEdition: "#C4A962", // champagne gold
		rare: "#B76E79", // rose gold
		preOrder: "#2C4F7C", // navy
		comingSoon: "#1E3A5F", // deep navy
	},

	// Semantic Colors (Professional)
	semantic: {
		success: "#059669",
		successLight: "#10B981",
		warning: "#D97706",
		warningLight: "#F59E0B",
		error: "#DC2626",
		errorLight: "#EF4444",
		info: "#2563EB",
		infoLight: "#3B82F6",
	},

	// Background System
	backgrounds: {
		primary: "#FFFFFF",
		secondary: "#FAF9F6",
		tertiary: "#F5F3EF",
		quaternary: "#F9FAFB",
	},

	// Border Colors
	borders: {
		light: "#E5E7EB",
		medium: "#D1D5DB",
		dark: "#9CA3AF",
		gold: "#C4A962",
	},
} as const;

/**
 * CSS variable names for colors (as defined in globals.css)
 */
export const cssVars = {
	// Gold Variables
	goldChampagne: "var(--vero-gold-champagne)",
	goldLight: "var(--vero-gold-light)",
	goldDark: "var(--vero-gold-dark)",
	goldPale: "var(--vero-gold-pale)",
	goldGlow: "var(--vero-gold-glow)",

	// Rose Gold
	roseGold: "var(--vero-rose-gold)",
	roseGoldLight: "var(--vero-rose-gold-light)",
	roseGoldDark: "var(--vero-rose-gold-dark)",

	// Black Variables
	blackPure: "var(--vero-black-pure)",
	blackCharcoal: "var(--vero-black-charcoal)",
	blackSoft: "var(--vero-black-soft)",
	blackMedium: "var(--vero-black-medium)",

	// Platinum & Silvers
	platinum: "var(--vero-platinum)",
	silver: "var(--vero-silver)",
	silverDark: "var(--vero-silver-dark)",

	// Neutrals
	white: "var(--vero-white-pure)",
	offWhite: "var(--vero-white-off)",
	cream: "var(--vero-cream)",
	grayLightest: "var(--vero-gray-lightest)",
	grayLight: "var(--vero-gray-light)",
	grayMedium: "var(--vero-gray-medium)",
	grayDark: "var(--vero-gray-dark)",
	grayDarker: "var(--vero-gray-darker)",

	// Text Colors
	textPrimary: "var(--vero-text-primary)",
	textSecondary: "var(--vero-text-secondary)",
	textMuted: "var(--vero-text-muted)",
	textLight: "var(--vero-text-light)",

	// Backgrounds
	bgPrimary: "var(--vero-bg-primary)",
	bgSecondary: "var(--vero-bg-secondary)",
	bgTertiary: "var(--vero-bg-tertiary)",
	bgQuaternary: "var(--vero-bg-quaternary)",

	// Borders
	borderLight: "var(--vero-border-light)",
	borderMedium: "var(--vero-border-medium)",
	borderDark: "var(--vero-border-dark)",
	borderGold: "var(--vero-border-gold)",

	// Accents
	burgundy: "var(--vero-burgundy)",
	burgundyLight: "var(--vero-burgundy-light)",
	navy: "var(--vero-navy)",
	navyLight: "var(--vero-navy-light)",
	forest: "var(--vero-forest)",
	forestLight: "var(--vero-forest-light)",

	// Semantic
	success: "var(--vero-success)",
	successLight: "var(--vero-success-light)",
	warning: "var(--vero-warning)",
	warningLight: "var(--vero-warning-light)",
	error: "var(--vero-error)",
	errorLight: "var(--vero-error-light)",
	info: "var(--vero-info)",
	infoLight: "var(--vero-info-light)",

	// Legacy Compatibility (will map to new colors)
	gold: "var(--vero-gold-champagne)",
	black: "var(--vero-black-pure)",
	text: "var(--vero-text-primary)",
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
 * Box shadow values - Sophisticated luxury shadows
 */
export const shadows = {
	sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
	DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
	md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
	lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
	xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
	"2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
	// Luxury metallic gold shadows
	gold: "0 4px 16px rgba(212, 175, 55, 0.3)",
	goldLg: "0 20px 48px rgba(212, 175, 55, 0.35), 0 8px 16px rgba(0, 0, 0, 0.12)",
	goldGlow: "0 0 24px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.15)",
	// Premium dark shadows
	premium: "0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(212, 175, 55, 0.2)",
	premiumLg: "0 12px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(212, 175, 55, 0.25)",
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
	if (!shade)
		return typeof colorGroup === "string"
			? colorGroup
			: (Object.values(colorGroup)[0] ?? colors.text.primary);
	return (colorGroup as Record<string, string>)[shade] || colors.text.primary;
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
