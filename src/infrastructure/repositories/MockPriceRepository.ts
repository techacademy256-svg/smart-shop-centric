// INFRASTRUCTURE LAYER - ADAPTER
// Mock implementation of PriceRepository port

import { ProductPrice } from "../../core/entities/ProductPrice";
import { PriceRepository } from "../../core/usecases/GetBestPrice";
import { MockProductRepository } from "./MockProductRepository";

// ADAPTER: Implements the port interface
export class MockPriceRepository implements PriceRepository {
  private productRepository = new MockProductRepository();

  async getProductPrices(productId: string): Promise<ProductPrice[]> {
    // Reuse the mock product repository implementation
    return this.productRepository.getProductPrices(productId);
  }
}
