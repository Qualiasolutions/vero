// Veromodels Store Configuration
export const config = {
	name: "Veromodels",
	description: "Premium 1:18 Scale Die-Cast Model Cars",

	categories: [
		{
			name: "New Arrivals",
			slug: "new-arrivals",
			description: "Latest additions to our collection",
			image: "https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759069004658-V41WK6HW0YQUQA70Q3FJ/18RMC093A.20-1-800x509__01814.jpg",
			badge: "NEW",
			badgeColor: "bg-green-500"
		},
		{
			name: "Special Price",
			slug: "on-sale",
			description: "Exclusive deals and discounts",
			image: "https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759068988286-JQ2OYCE61NE1JW0P27Y0/aston-martin-db5-silver-birch-1964-01.jpg",
			badge: "SALE",
			badgeColor: "bg-red-500"
		},
		{
			name: "Limited Editions",
			slug: "limited-edition",
			description: "Rare and exclusive models",
			image: "https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759068991286-XEBWB6VLMWKEBXEEHAVC/subaru-impreza-22b-sonic-blue-1998-01.jpg",
			badge: "LIMITED",
			badgeColor: "bg-purple-500"
		},
		{
			name: "Rare Models",
			slug: "rare",
			description: "Hard to find collectors items",
			image: "https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759068992633-DQXRN89XN3VEF2L6DB0J/1976-Mercedes-Benz-450-SEL-6-9-W116-silver-1-18-Norev-diecast-scale-model-car-7_grande.webp",
			badge: "RARE",
			badgeColor: "bg-amber-500"
		},
		{
			name: "Pre-Order",
			slug: "pre-order",
			description: "Reserve upcoming releases",
			image: "https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1760105376228-PY89I4JJY67J7SFI8K4Q/gt541nh.jpg",
			badge: "PRE-ORDER",
			badgeColor: "bg-blue-500"
		},
		{
			name: "Coming Soon",
			slug: "coming-soon",
			description: "Upcoming models - Release dates announced",
			image: "https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1760105382315-WUX5MM4J10OVB2GL3PDA/gt552n.jpg",
			badge: "SOON",
			badgeColor: "bg-indigo-500"
		},
	],

	brands: [
		"AutoArt", "ALPINA", "SOLIDO", "GT Spirit", "OttO mobile", "Norev",
		"IXO", "PARAGON", "KK Scale", "MCG", "Almost Real", "Ottomobile",
		"KYOSHO", "Premium ClassiXXs"
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
		reviews: false,  // Can enable later
		newsletter: true,
	}
};

export type StoreConfig = typeof config;
export default config;
