// UI COMPONENT - FRAMEWORK LAYER
// Displays price comparison using view models from presenter

import { Store, MapPin, TrendingDown, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceComparisonViewModel } from "@/adapters/presenters/ProductPresenter";

interface PriceComparisonProps {
  data: PriceComparisonViewModel;
  onBack: () => void;
}

export function PriceComparison({ data, onBack }: PriceComparisonProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">{data.productName}</h2>
          <p className="text-muted-foreground">Comparing prices across {data.prices.length} stores</p>
        </div>
        <Button onClick={onBack} variant="outline">
          Back to Search
        </Button>
      </div>

      {data.bestDeal && (
        <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <TrendingDown className="w-6 h-6" />
              Best Deal Found!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold mb-1">{data.bestDeal.storeName}</p>
                <p className="text-lg text-muted-foreground">{data.bestDeal.price}</p>
              </div>
              <Badge className="text-lg px-4 py-2 bg-accent hover:bg-accent">
                {data.bestDeal.savings}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {data.prices.map((price, index) => (
          <Card 
            key={index}
            className={`transition-all ${
              price.isBestPrice 
                ? "border-primary shadow-md ring-2 ring-primary/20" 
                : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Store className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-xl">{price.storeName}</h3>
                      {price.isBestPrice && (
                        <Badge className="bg-primary">Best Price</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {price.storeLocation}
                      </span>
                      <span>•</span>
                      <span>{price.distance}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {price.available ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-primary" />
                            In Stock
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-destructive" />
                            Out of Stock
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-bold">{price.price}</p>
                  {price.savingsFromBest && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {price.savingsFromBest} more
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
