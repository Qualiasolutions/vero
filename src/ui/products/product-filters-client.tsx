"use client";

import { ProductFilters } from "./product-filters";

// Export default for React.lazy compatibility
export default function ProductFiltersClient(props: any) {
	return <ProductFilters {...props} />;
}
