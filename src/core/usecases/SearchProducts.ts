// CORE LAYER - USE CASE
// Business logic for searching products
// Independent of framework and infrastructure

import { Product } from "../entities/Product";
import { ProductPrice } from "../entities/ProductPrice";

// PORT: Interface that infrastructure must implement
export interface ProductRepository {
  searchProducts(query: string): Promise<Product[]>;
  getProductPrices(productId: string): Promise<ProductPrice[]>;
}

// USE CASE: Core business logic
export class SearchProducts {
  constructor(private productRepository: ProductRepository) {}

  async execute(query: string): Promise<Product[]> {
    // Business rule: Query must be at least 2 characters
    if (query.length < 2) {
      throw new Error("Search query must be at least 2 characters long");
    }

    // Business rule: Normalize query
    const normalizedQuery = query.trim();

    // Delegate data retrieval to repository (port)
    const products = await this.productRepository.searchProducts(normalizedQuery);

    // Business rule: Sort by relevance (name match first, then brand)
    return products.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(normalizedQuery.toLowerCase());
      const bNameMatch = b.name.toLowerCase().includes(normalizedQuery.toLowerCase());
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      return a.name.localeCompare(b.name);
    });
  }
}
