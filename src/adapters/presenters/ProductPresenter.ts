// ADAPTER LAYER - PRESENTER
// Transforms domain entities into view models for the UI
// Separates presentation logic from business logic

import { Product } from "../../domain/entities/Product";
import { ProductPrice, BestDeal } from "../../domain/entities/ProductPrice";

export interface ProductViewModel {
  id: string;
  displayName: string;
  category: string;
  unit: string;
  imageUrl?: string;
}

export interface PriceComparisonViewModel {
  productName: string;
  prices: {
    storeName: string;
    storeLocation: string;
    distance: string;
    price: string;
    available: boolean;
    isBestPrice: boolean;
    savingsFromBest?: string;
  }[];
  bestDeal?: {
    storeName: string;
    price: string;
    savings: string;
  };
}

export class ProductPresenter {
  // Transform Product entity to view model
  static toViewModel(product: Product): ProductViewModel {
    return {
      id: product.id,
      displayName: `${product.brand} ${product.name}`,
      category: product.category,
      unit: product.unit,
      imageUrl: product.imageUrl
    };
  }

  // Transform array of products to view models
  static toViewModels(products: Product[]): ProductViewModel[] {
    return products.map(p => this.toViewModel(p));
  }

  // Transform price comparison data to view model
  static toPriceComparisonViewModel(
    productPrices: ProductPrice[],
    bestDeal: BestDeal | null
  ): PriceComparisonViewModel | null {
    if (productPrices.length === 0) return null;

    const product = productPrices[0].product;
    const bestPrice = bestDeal?.productPrice.price.amount ?? Math.min(...productPrices.map(pp => pp.price.amount));

    return {
      productName: `${product.brand} ${product.name}`,
      prices: productPrices.map(pp => ({
        storeName: pp.store.name,
        storeLocation: pp.store.location,
        distance: pp.store.distance ? `${pp.store.distance.toFixed(1)} km` : "N/A",
        price: `$${pp.price.amount.toFixed(2)}`,
        available: pp.price.available,
        isBestPrice: pp.price.amount === bestPrice,
        savingsFromBest: pp.price.amount !== bestPrice 
          ? `+$${(pp.price.amount - bestPrice).toFixed(2)}`
          : undefined
      })),
      bestDeal: bestDeal ? {
        storeName: bestDeal.productPrice.store.name,
        price: `$${bestDeal.productPrice.price.amount.toFixed(2)}`,
        savings: `Save $${bestDeal.savingsAmount.toFixed(2)} (${bestDeal.savingsPercentage.toFixed(0)}%)`
      } : undefined
    };
  }
}
