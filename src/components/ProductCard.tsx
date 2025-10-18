// UI COMPONENT - FRAMEWORK LAYER
// Displays product information using view models from presenter

import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductViewModel } from "@/adapters/presenters/ProductPresenter";

interface ProductCardProps {
  product: ProductViewModel;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 truncate group-hover:text-primary transition-colors">
              {product.displayName}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Per {product.unit}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
