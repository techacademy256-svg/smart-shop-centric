// ADAPTER LAYER - CONTROLLER (React Hook)
// Connects UI components to use cases
// Manages state and orchestrates business logic

import { useState, useCallback } from "react";
import { SearchProducts } from "../../domain/usecases/SearchProducts";
import { GetBestPrice, BestPriceFilters } from "../../domain/usecases/GetBestPrice";
import { MockProductRepository } from "../../infrastructure/repositories/MockProductRepository";
import { MockPriceRepository } from "../../infrastructure/repositories/MockPriceRepository";
import { ProductPresenter, ProductViewModel, PriceComparisonViewModel } from "../presenters/ProductPresenter";
import { Product } from "../../domain/entities/Product";
import { ProductPrice, BestDeal } from "../../domain/entities/ProductPrice";

// Dependency Injection: Create use case instances with repository adapters
const productRepository = new MockProductRepository();
const priceRepository = new MockPriceRepository();
const searchProductsUseCase = new SearchProducts(productRepository);
const getBestPriceUseCase = new GetBestPrice(priceRepository);

interface UseProductSearchResult {
  products: ProductViewModel[];
  selectedProduct: Product | null;
  priceComparison: PriceComparisonViewModel | null;
  isSearching: boolean;
  isLoadingPrices: boolean;
  error: string | null;
  searchProducts: (query: string) => Promise<void>;
  selectProduct: (productId: string) => Promise<void>;
  clearSelection: () => void;
}

// CONTROLLER: React Hook that uses domain use cases
export function useProductSearch(): UseProductSearchResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceComparison, setPriceComparison] = useState<PriceComparisonViewModel | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Execute use case
      const results = await searchProductsUseCase.execute(query);
      setProducts(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setProducts([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const selectProduct = useCallback(async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setSelectedProduct(product);
    setIsLoadingPrices(true);
    setError(null);

    try {
      // Execute use cases
      const filters: BestPriceFilters = {
        onlyAvailable: true,
        maxDistance: 10
      };

      const [allPrices, bestDeal] = await Promise.all([
        getBestPriceUseCase.getAllPricesSorted(productId, filters),
        getBestPriceUseCase.execute(productId, filters)
      ]);

      // Transform to view model using presenter
      const viewModel = ProductPresenter.toPriceComparisonViewModel(allPrices, bestDeal);
      setPriceComparison(viewModel);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load prices");
      setPriceComparison(null);
    } finally {
      setIsLoadingPrices(false);
    }
  }, [products]);

  const clearSelection = useCallback(() => {
    setSelectedProduct(null);
    setPriceComparison(null);
  }, []);

  return {
    products: ProductPresenter.toViewModels(products),
    selectedProduct,
    priceComparison,
    isSearching,
    isLoadingPrices,
    error,
    searchProducts,
    selectProduct,
    clearSelection
  };
}
