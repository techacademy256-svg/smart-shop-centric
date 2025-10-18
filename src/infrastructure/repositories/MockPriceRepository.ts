// INFRASTRUCTURE LAYER - ADAPTER
// Mock implementation of PriceRepository port

import { ProductPrice } from "../../domain/entities/ProductPrice";
import { PriceRepository } from "../../domain/usecases/GetBestPrice";
import { MockProductRepository } from "./MockProductRepository";

// ADAPTER: Implements the port interface
export class MockPriceRepository implements PriceRepository {
  private productRepository = new MockProductRepository();

  async getProductPrices(productId: string): Promise<ProductPrice[]> {
    // Reuse the mock product repository implementation
    return this.productRepository.getProductPrices(productId);
  }
}
