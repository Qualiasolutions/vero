// Veromodels Store Configuration
export const config = {
	name: "Veromodels",
	description: "Premium 1:18 Scale Die-Cast Model Cars",

	categories: [
		{
			name: "New Arrivals",
			slug: "new-arrivals",
			description: "Latest additions to our collection",
			image: "https://i.ibb.co/xqHXVyhP/Generated-Image-October-19-2025-7-48-PM.png",
			badge: "NEW",
			badgeColor: "bg-[#C4A962] text-[#0F0F0F] shadow-lg font-semibold",
		},
		{
			name: "Special Price",
			slug: "on-sale",
			description: "Exclusive deals and discounts",
			image:
				"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759069013979-BBM6TFNE5PSBYWVD01K7/Volvo%2BFH25%2BEvolution%2B500%2BHP%2BCab.png",
			badge: "SALE",
			badgeColor: "bg-[#0F0F0F] text-[#C4A962] shadow-lg font-semibold",
		},
		{
			name: "Limited Editions",
			slug: "limited-edition",
			description: "Rare and exclusive models",
			image:
				"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759068995264-GPKHHZHUIETW1Z3OB1J8/gt341-toyota-supra-gr-fuji-speedway-edition-01-2.jpg",
			badge: "LIMITED",
			badgeColor: "bg-[#8B1538] text-[#FFFFFF] shadow-lg font-semibold",
		},
		{
			name: "Rare Models",
			slug: "rare",
			description: "Hard to find collectors items",
			image:
				"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759068993890-PNRG69L3L6KO8UHVH89B/toyota-supra-3000-gt-trd-renaissance-red-1998.jpg",
			badge: "RARE",
			badgeColor: "bg-[#B76E79] text-[#FFFFFF] shadow-lg font-semibold",
		},
		{
			name: "Pre-Order",
			slug: "pre-order",
			description: "Reserve upcoming releases",
			image:
				"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759068996639-TWPXCZ2S0EH30Z78F3T2/Generated%2BImage%2BSeptember%2B27%252C%2B2025%2B-%2B11_37AM.png",
			badge: "PRE-ORDER",
			badgeColor: "bg-[#FFFFFF] text-[#0F0F0F] border border-[#C4A962] shadow-lg font-semibold",
		},
		{
			name: "Coming Soon",
			slug: "coming-soon",
			description: "Upcoming models - Release dates announced",
			image:
				"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1759068991286-XEBWB6VLMWKEBXEEHAVC/subaru-impreza-22b-sonic-blue-1998-01.jpg",
			badge: "SOON",
			badgeColor: "bg-[#2A2A2A] text-[#FFFFFF] shadow-lg font-semibold",
		},
	],

	brands: [
		"ALPINA",
		"Audi",
		"AutoArt",
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
		phone: "+971 50 123 4567", // Update with actual number
		address: "Dubai, UAE", // Update with actual address
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
