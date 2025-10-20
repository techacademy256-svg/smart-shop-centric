// CORE LAYER - AGGREGATE ENTITY
// Combines Product, Store, and Price information

import { Product } from "./Product";
import { Store } from "./Store";
import { Price } from "./Price";

export interface ProductPrice {
  product: Product;
  store: Store;
  price: Price;
}

export interface BestDeal {
  productPrice: ProductPrice;
  savingsAmount: number;
  savingsPercentage: number;
}
