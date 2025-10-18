// DOMAIN LAYER - ENTITY
// Core business model representing a product in the system
// This is framework-agnostic and contains only business logic

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  imageUrl?: string;
  unit: string; // e.g., "kg", "lb", "unit"
  description?: string;
}

export class ProductEntity implements Product {
  constructor(
    public id: string,
    public name: string,
    public category: string,
    public brand: string,
    public unit: string,
    public imageUrl?: string,
    public description?: string
  ) {}

  // Business logic: Get display name
  getDisplayName(): string {
    return `${this.brand} ${this.name}`;
  }

  // Business logic: Check if product matches search query
  matchesSearch(query: string): boolean {
    const searchLower = query.toLowerCase();
    return (
      this.name.toLowerCase().includes(searchLower) ||
      this.brand.toLowerCase().includes(searchLower) ||
      this.category.toLowerCase().includes(searchLower)
    );
  }
}
