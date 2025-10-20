# Core Layer - Pure Business Logic

## Overview
The `/core` directory represents the **innermost layer** of Clean Architecture. It contains the pure business logic of the SmartShop application, completely independent of any frameworks, databases, UI libraries, or external dependencies.

## Purpose
This layer defines:
- **What the application does** (business rules)
- **What data structures are needed** (entities)
- **What operations are possible** (use cases)

It does **NOT** define:
- How data is stored (database implementation)
- How data is presented (UI components)
- How external services are called (API clients)

## Structure

### `/entities`
Core business models that represent the fundamental concepts of our domain:
- **Product**: Represents a food product with brand, category, and unit information
- **Store**: Represents a retail location with distance and rating
- **Price**: Represents the cost of a product at a specific store
- **ProductPrice**: Aggregate entity combining Product, Store, and Price

Each entity contains:
- Pure data structures (interfaces)
- Business logic methods that operate on that data
- No dependencies on frameworks or infrastructure

### `/usecases`
Business logic operations that orchestrate entities to fulfill specific user goals:
- **SearchProducts**: Handles product search with validation and sorting rules
- **GetBestPrice**: Compares prices across stores and recommends the best deal

Each use case:
- Defines **ports** (interfaces) that infrastructure must implement
- Contains business rules and validation logic
- Returns domain entities (not view models or DTOs)
- Is testable without any external dependencies

## Key Principles

### 1. **Framework Independence**
The core can be used in a React app, a CLI tool, or a mobile app without modification.

### 2. **Testability**
All business logic can be tested with simple unit tests, no mocking of frameworks required.

### 3. **Dependency Rule**
Dependencies point **inward**. The core depends on nothing external; everything else depends on the core.

### 4. **Ports and Adapters**
Use cases define **ports** (interfaces like `ProductRepository`, `PriceRepository`). Infrastructure provides **adapters** (implementations) that fulfill these contracts.

## Example
```typescript
// Use case defines what it needs (port)
interface ProductRepository {
  searchProducts(query: string): Promise<Product[]>;
}

// Infrastructure provides the implementation (adapter)
class MockProductRepository implements ProductRepository {
  async searchProducts(query: string): Promise<Product[]> {
    // Implementation details here
  }
}
```

## Benefits
- **Easy to test**: Mock the ports, test the use cases
- **Easy to change**: Swap MongoDB for PostgreSQL without touching business logic
- **Easy to understand**: Business rules are in one place, clearly separated from technical details
- **Long-lasting**: Core logic survives framework migrations and technology changes
