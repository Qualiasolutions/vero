import { getProducts } from "@/lib/product-service";
import { Home1Client } from "./home1-client";

export default async function Home1Page() {
	// Fetch products on the server
	const productsResult = await getProducts(6);
	const products = productsResult.data || [];

	return <Home1Client products={products} />;
}
