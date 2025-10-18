// FRAMEWORK LAYER - PAGE COMPONENT
// Main application page that orchestrates the UI
// Uses controller (hook) to interact with domain layer

import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { PriceComparison } from "@/components/PriceComparison";
import { useProductSearch } from "@/adapters/controllers/useProductSearch";
import { ShoppingCart, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const {
    products,
    selectedProduct,
    priceComparison,
    isSearching,
    isLoadingPrices,
    error,
    searchProducts,
    selectProduct,
    clearSelection
  } = useProductSearch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingCart className="w-12 h-12 text-primary-foreground" />
            <h1 className="text-5xl font-bold text-primary-foreground">SmartShop</h1>
          </div>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Find the best prices for your groceries across local stores. Save money, save time.
          </p>
          <SearchBar onSearch={searchProducts} isSearching={isSearching} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {error && (
          <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoadingPrices ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading price comparison...</p>
          </div>
        ) : priceComparison ? (
          <PriceComparison data={priceComparison} onBack={clearSelection} />
        ) : (
          <>
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-lg text-muted-foreground">Searching products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">
                  Found {products.length} product{products.length !== 1 ? 's' : ''}
                </h2>
                <div className="grid gap-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => selectProduct(product.id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <ShoppingCart className="w-20 h-20 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2 text-muted-foreground">
                  Start your search
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Search for any food product to compare prices across local stores and find the best deals.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Architecture Note Footer */}
      <div className="border-t bg-muted/30 py-8 px-4 mt-20">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p className="mb-2 font-semibold">
            🏗️ Built with Clean Architecture + Hexagonal Architecture
          </p>
          <p className="max-w-3xl mx-auto">
            This application demonstrates strong separation of concerns with independent domain logic, 
            ports and adapters pattern, and dependency inversion. Check the codebase to see the layered structure: 
            <span className="font-mono text-xs"> /domain/entities, /domain/usecases, /adapters, /infrastructure</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
