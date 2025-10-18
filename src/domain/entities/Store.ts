// DOMAIN LAYER - ENTITY
// Core business model representing a store in the system

export interface Store {
  id: string;
  name: string;
  location: string;
  distance?: number; // in km or miles
  rating?: number;
  logo?: string;
}

export class StoreEntity implements Store {
  constructor(
    public id: string,
    public name: string,
    public location: string,
    public distance?: number,
    public rating?: number,
    public logo?: string
  ) {}

  // Business logic: Format distance for display
  getFormattedDistance(): string {
    if (!this.distance) return "N/A";
    return `${this.distance.toFixed(1)} km`;
  }

  // Business logic: Check if store is nearby (within 5km)
  isNearby(): boolean {
    return this.distance !== undefined && this.distance <= 5;
  }
}
