// CORE LAYER - ENTITY
// Core business model representing a price for a product at a store

export interface Price {
  id: string;
  productId: string;
  storeId: string;
  amount: number;
  currency: string;
  available: boolean;
  lastUpdated: Date;
}

export class PriceEntity implements Price {
  constructor(
    public id: string,
    public productId: string,
    public storeId: string,
    public amount: number,
    public currency: string,
    public available: boolean,
    public lastUpdated: Date
  ) {}

  // Business logic: Format price for display
  getFormattedPrice(): string {
    return `${this.currency}${this.amount.toFixed(2)}`;
  }

  // Business logic: Check if price is stale (older than 24 hours)
  isStale(): boolean {
    const hoursSinceUpdate = (Date.now() - this.lastUpdated.getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate > 24;
  }

  // Business logic: Compare with another price
  isCheaperThan(otherPrice: PriceEntity): boolean {
    return this.amount < otherPrice.amount;
  }

  // Business logic: Calculate percentage difference
  getPercentageDifference(comparePrice: PriceEntity): number {
    return ((this.amount - comparePrice.amount) / comparePrice.amount) * 100;
  }
}
