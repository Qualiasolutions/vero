import type { Product } from "commerce-kit";
import Image from "next/image";
import { getLocale } from "@/i18n/server";
import { formatMoney } from "@/lib/utils";
import { JsonLd, mappedProductsToJsonLd } from "@/ui/json-ld";
import { YnsLink } from "@/ui/yns-link";

export const ProductList = async ({ products }: { products: Product[] }) => {
	const locale = await getLocale();

	return (
		<>
			<ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{products.map((product, idx) => {
					return (
						<li key={product.id} className="group">
							<YnsLink href={`/product/${product.slug}`}>
								<article className="vero-card rounded-lg overflow-hidden transition-all duration-500 hover:scale-[1.02]">
									{product.images[0] && (
										<div className="relative aspect-square w-full overflow-hidden bg-black/50">
											<div className="relative h-full w-full border-2 border-transparent group-hover:border-[#D4AF37]/30 transition-colors duration-500">
												<Image
													className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
													src={product.images[0]}
													width={768}
													height={768}
													loading={idx < 3 ? "eager" : "lazy"}
													priority={idx < 3}
													sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
													alt={product.name}
												/>
											</div>
										</div>
									)}
									<div className="p-5 space-y-3">
										<h2 className="text-base font-light text-[#212529] group-hover:text-[#D4AF37] transition-colors duration-300 tracking-wide line-clamp-2">
											{product.name}
										</h2>
										<footer className="pt-2 border-t border-[#D4AF37]/20">
											{product.price && (
												<p className="text-xl font-semibold vero-text-gradient">
													{formatMoney({
														amount: product.price,
														currency: product.currency,
														locale,
													})}
												</p>
											)}
										</footer>
									</div>
								</article>
							</YnsLink>
						</li>
					);
				})}
			</ul>
			<JsonLd jsonLd={mappedProductsToJsonLd(products)} />
		</>
	);
};
