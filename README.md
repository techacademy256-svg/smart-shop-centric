# SmartShop - Clean Architecture + Hexagonal Architecture Demo

## 🎯 Overview
SmartShop is a full-stack web application that helps users find the best prices for food products across local stores. Built with **Clean Architecture** and **Hexagonal Architecture (Ports and Adapters)** principles.

## 🏗️ Architecture

This project demonstrates a hybrid approach combining:
- **Clean Architecture**: Separation into distinct layers with dependency rules
- **Hexagonal Architecture**: Ports and adapters for external dependencies

### Layer Structure

```
src/
├── domain/                    # DOMAIN LAYER (Core Business Logic)
│   ├── entities/             # Business entities
│   │   ├── Product.ts        # Product entity with business logic
│   │   ├── Store.ts          # Store entity
│   │   ├── Price.ts          # Price entity with comparison logic
│   │   └── ProductPrice.ts   # Aggregate entity
│   └── usecases/             # Use cases (application business rules)
│       ├── SearchProducts.ts # Product search logic
│       └── GetBestPrice.ts   # Price comparison logic
│
├── adapters/                  # ADAPTER LAYER
│   ├── controllers/          # Input adapters (React hooks as controllers)
│   │   └── useProductSearch.ts
│   └── presenters/           # Output adapters (view model transformers)
│       └── ProductPresenter.ts
│
├── infrastructure/           # INFRASTRUCTURE LAYER (Frameworks & Drivers)
│   └── repositories/        # Repository implementations (adapters)
│       ├── MockProductRepository.ts  # Mock data adapter
│       └── MockPriceRepository.ts    # Mock price adapter
│
└── components/              # UI COMPONENTS (Framework layer)
    ├── SearchBar.tsx
    ├── ProductCard.tsx
    └── PriceComparison.tsx
```

### Key Architectural Principles

#### 1. Dependency Rule
Dependencies point inward. Domain layer has zero dependencies on outer layers.

```typescript
// ✅ CORRECT: Use case depends on interface (port)
export class SearchProducts {
  constructor(private productRepository: ProductRepository) {} // Port
}

// ✅ CORRECT: Infrastructure implements the port
export class MockProductRepository implements ProductRepository {} // Adapter
```

#### 2. Ports and Adapters

**Ports** (Interfaces in domain layer):
- `ProductRepository` - Port for product data access
- `PriceRepository` - Port for price data access

**Adapters** (Implementations in infrastructure):
- `MockProductRepository` - Adapter using mock data
- Could be replaced with `ApiProductRepository`, `SupabaseProductRepository`, etc.

#### 3. Dependency Inversion

Business logic doesn't depend on frameworks:

```typescript
// Domain layer (independent)
export interface ProductRepository {
  searchProducts(query: string): Promise<Product[]>;
}

// Infrastructure layer (depends on domain)
export class MockProductRepository implements ProductRepository {
  async searchProducts(query: string): Promise<Product[]> {
    // Implementation details
  }
}
```

## 🧪 Testing Benefits

Each layer can be tested independently:

```typescript
// Test use case with mock repository
const mockRepo = new MockProductRepository();
const useCase = new SearchProducts(mockRepo);
const results = await useCase.execute("milk");
```

## 🔄 Easy to Extend

Want to replace mock data with a real API? Just create a new adapter:

```typescript
// New adapter - no changes needed to domain logic!
export class ApiProductRepository implements ProductRepository {
  async searchProducts(query: string): Promise<Product[]> {
    const response = await fetch(`/api/products?q=${query}`);
    return response.json();
  }
}
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📦 Technologies

- **Frontend**: React, TypeScript, Tailwind CSS
- **Architecture**: Clean Architecture + Hexagonal Architecture
- **Build Tool**: Vite
- **UI Components**: shadcn/ui

## 🎓 Learning Resources

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)

## 📝 Notes

This implementation uses:
- **Mock data** for demonstration (see `/infrastructure/repositories`)
- **React hooks as controllers** (adapter pattern for React)
- **Presenters** to transform domain models to view models
- **Clear separation** between business logic and framework code

The architecture makes it trivial to:
- Switch from mock to real APIs
- Add caching layers
- Implement different UIs (mobile, CLI, etc.)
- Test business logic without UI
