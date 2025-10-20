// CORE LAYER - USE CASE
// Business logic for finding the best price for a product
// Demonstrates core business rules independent of infrastructure

import { ProductPrice, BestDeal } from "../entities/ProductPrice";
import { PriceEntity } from "../entities/Price";

// PORT: Interface that infrastructure must implement
export interface PriceRepository {
  getProductPrices(productId: string): Promise<ProductPrice[]>;
}

export interface BestPriceFilters {
  maxDistance?: number; // in km
  onlyAvailable?: boolean;
  preferredStores?: string[];
}

// USE CASE: Core business logic for price comparison
export class GetBestPrice {
  constructor(private priceRepository: PriceRepository) {}

  async execute(productId: string, filters?: BestPriceFilters): Promise<BestDeal | null> {
    // Get all prices for this product
    let productPrices = await this.priceRepository.getProductPrices(productId);

    // Business rule: Filter by availability if requested
    if (filters?.onlyAvailable) {
      productPrices = productPrices.filter(pp => pp.price.available);
    }

    // Business rule: Filter by distance if specified
    if (filters?.maxDistance) {
      productPrices = productPrices.filter(
        pp => pp.store.distance !== undefined && pp.store.distance <= filters.maxDistance!
      );
    }

    // Business rule: No prices available
    if (productPrices.length === 0) {
      return null;
    }

    // Business rule: Find the cheapest price
    const sortedByPrice = [...productPrices].sort((a, b) => a.price.amount - b.price.amount);
    const cheapest = sortedByPrice[0];
    const mostExpensive = sortedByPrice[sortedByPrice.length - 1];

    // Calculate savings
    const savingsAmount = mostExpensive.price.amount - cheapest.price.amount;
    const savingsPercentage = (savingsAmount / mostExpensive.price.amount) * 100;

    // Business rule: Apply preference to preferred stores if available
    if (filters?.preferredStores && filters.preferredStores.length > 0) {
      const preferredDeal = sortedByPrice.find(pp => 
        filters.preferredStores!.includes(pp.store.id)
      );
      
      // If preferred store is within 10% of best price, recommend it
      if (preferredDeal) {
        const priceDiff = ((preferredDeal.price.amount - cheapest.price.amount) / cheapest.price.amount) * 100;
        if (priceDiff <= 10) {
          return {
            productPrice: preferredDeal,
            savingsAmount: mostExpensive.price.amount - preferredDeal.price.amount,
            savingsPercentage: ((mostExpensive.price.amount - preferredDeal.price.amount) / mostExpensive.price.amount) * 100
          };
        }
      }
    }

    return {
      productPrice: cheapest,
      savingsAmount,
      savingsPercentage
    };
  }

  // Additional business logic: Get all prices sorted
  async getAllPricesSorted(productId: string, filters?: BestPriceFilters): Promise<ProductPrice[]> {
    let productPrices = await this.priceRepository.getProductPrices(productId);

    if (filters?.onlyAvailable) {
      productPrices = productPrices.filter(pp => pp.price.available);
    }

    if (filters?.maxDistance) {
      productPrices = productPrices.filter(
        pp => pp.store.distance !== undefined && pp.store.distance <= filters.maxDistance!
      );
    }

    return productPrices.sort((a, b) => a.price.amount - b.price.amount);
  }
}
