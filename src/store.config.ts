// Veromodels Store Configuration
export const config = {
	name: "Veromodels",
	description: "Premium 1:18 Scale Die-Cast Model Cars",

	categories: [
		{
			name: "New Arrivals",
			slug: "new-arrivals",
			description: "Latest additions to our collection",
			image:
				"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759069015843-XQ6Y657GDY19YBQ0GGTL/DSC07389.jpg",
			badge: "NEW",
			badgeColor: "bg-green-500 text-white shadow-md",
		},
		{
			name: "Special Price",
			slug: "on-sale",
			description: "Exclusive deals and discounts",
			image:
				"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759069013979-BBM6TFNE5PSBYWVD01K7/Volvo%2BFH25%2BEvolution%2B500%2BHP%2BCab.png",
			badge: "SALE",
			badgeColor: "bg-red-500 text-white shadow-md",
		},
		{
			name: "Limited Editions",
			slug: "limited-edition",
			description: "Rare and exclusive models",
			image:
				"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759068995264-GPKHHZHUIETW1Z3OB1J8/gt341-toyota-supra-gr-fuji-speedway-edition-01-2.jpg",
			badge: "LIMITED",
			badgeColor: "bg-purple-500 text-white shadow-md",
		},
		{
			name: "Rare Models",
			slug: "rare",
			description: "Hard to find collectors items",
			image:
				"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759068993890-PNRG69L3L6KO8UHVH89B/toyota-supra-3000-gt-trd-renaissance-red-1998.jpg",
			badge: "RARE",
			badgeColor: "bg-amber-500 text-white shadow-md",
		},
		{
			name: "Pre-Order",
			slug: "pre-order",
			description: "Reserve upcoming releases",
			image:
				"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759068996639-TWPXCZ2S0EH30Z78F3T2/Generated%2BImage%2BSeptember%2B27%252C%2B2025%2B-%2B11_37AM.png",
			badge: "PRE-ORDER",
			badgeColor: "bg-blue-500 text-white shadow-md",
		},
		{
			name: "Coming Soon",
			slug: "coming-soon",
			description: "Upcoming models - Release dates announced",
			image:
				"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759068991286-XEBWB6VLMWKEBXEEHAVC/subaru-impreza-22b-sonic-blue-1998-01.jpg",
			badge: "SOON",
			badgeColor: "bg-indigo-500 text-white shadow-md",
		},
	],

	brands: [
		"AutoArt",
		"ALPINA",
		"SOLIDO",
		"GT Spirit",
		"OttO mobile",
		"Norev",
		"IXO",
		"PARAGON",
		"KK Scale",
		"MCG",
		"Almost Real",
		"Ottomobile",
		"KYOSHO",
		"Premium ClassiXXs",
	],

	social: {
		instagram: "https://instagram.com/veromodels",
		facebook: "https://facebook.com/veromodels",
		x: "https://x.com/veromodels",
	},

	contact: {
		email: "info@veromodels.com",
		phone: "+49 (0) 123 456789", // Update with actual number
		address: "Germany", // Update with actual address
	},

	// Feature flags
	features: {
		preorders: true,
		wishlist: true,
		reviews: false, // Can enable later
		newsletter: true,
	},
};

export type StoreConfig = typeof config;
export default config;
