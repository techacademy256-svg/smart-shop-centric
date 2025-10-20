// INFRASTRUCTURE LAYER - ADAPTER
// Mock implementation of ProductRepository port
// This can be replaced with real API calls without changing core logic

import { Product, ProductEntity } from "../../core/entities/Product";
import { ProductPrice } from "../../core/entities/ProductPrice";
import { PriceEntity } from "../../core/entities/Price";
import { StoreEntity } from "../../core/entities/Store";
import { ProductRepository } from "../../core/usecases/SearchProducts";

// Mock data
const mockProducts: Product[] = [
  new ProductEntity("1", "Organic Bananas", "Fruits", "Fresh Valley", "kg", undefined, "Fresh organic bananas"),
  new ProductEntity("2", "Whole Milk", "Dairy", "DairyFresh", "L", undefined, "Full fat whole milk"),
  new ProductEntity("3", "Sourdough Bread", "Bakery", "Baker's Choice", "loaf", undefined, "Artisan sourdough bread"),
  new ProductEntity("4", "Free Range Eggs", "Dairy", "Happy Farms", "dozen", undefined, "12 free range eggs"),
  new ProductEntity("5", "Organic Apples", "Fruits", "Fresh Valley", "kg", undefined, "Crisp organic apples"),
  new ProductEntity("6", "Greek Yogurt", "Dairy", "DairyFresh", "500g", undefined, "Natural Greek yogurt"),
  new ProductEntity("7", "Brown Rice", "Grains", "Nature's Best", "kg", undefined, "Long grain brown rice"),
  new ProductEntity("8", "Chicken Breast", "Meat", "Fresh Meats Co", "kg", undefined, "Boneless chicken breast"),
  new ProductEntity("9", "Olive Oil", "Pantry", "Mediterranean Gold", "L", undefined, "Extra virgin olive oil"),
  new ProductEntity("10", "Organic Carrots", "Vegetables", "Fresh Valley", "kg", undefined, "Organic carrots"),
];

const mockStores = [
  new StoreEntity("store1", "FreshMart", "123 Main St", 1.2, 4.5),
  new StoreEntity("store2", "GroceryHub", "456 Oak Ave", 2.5, 4.2),
  new StoreEntity("store3", "ValueMarket", "789 Pine Rd", 3.8, 4.0),
  new StoreEntity("store4", "OrganicLife", "321 Elm St", 1.8, 4.7),
];

// Mock price data
const generateMockPrices = (productId: string): ProductPrice[] => {
  return mockStores.map((store, index) => {
    const basePrice = parseFloat(productId) * 2 + Math.random() * 5;
    const variation = (index * 0.5) + (Math.random() * 2);
    const finalPrice = basePrice + variation;
    
    return {
      product: mockProducts.find(p => p.id === productId)!,
      store,
      price: new PriceEntity(
        `price-${productId}-${store.id}`,
        productId,
        store.id,
        parseFloat(finalPrice.toFixed(2)),
        "$",
        Math.random() > 0.1, // 90% availability
        new Date()
      )
    };
  });
};

// ADAPTER: Implements the port interface
export class MockProductRepository implements ProductRepository {
  async searchProducts(query: string): Promise<Product[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const queryLower = query.toLowerCase();
    return mockProducts.filter(product => 
      product.name.toLowerCase().includes(queryLower) ||
      product.brand.toLowerCase().includes(queryLower) ||
      product.category.toLowerCase().includes(queryLower)
    );
  }

  async getProductPrices(productId: string): Promise<ProductPrice[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return generateMockPrices(productId);
  }
}
