
import React, { useState, useEffect } from "react";
import { MarketSymbol } from "@/services/alphaVantageService";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, BarChart3, TrendingUp, TrendingDown, Settings, RefreshCw, Info, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StockPanelProps {
  symbol: MarketSymbol | null;
  isOpen: boolean;
  onClose: () => void;
}

const StockPanel: React.FC<StockPanelProps> = ({ symbol, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [moreInfo, setMoreInfo] = useState<any>(null);

  useEffect(() => {
    if (symbol && isOpen) {
      setLoading(true);
      // Simulate loading additional data
      setTimeout(() => {
        setMoreInfo({
          volume: Math.floor(Math.random() * 10000000) + 100000,
          marketCap: Math.floor(Math.random() * 1000000000) + 10000000,
          pe: (Math.random() * 30 + 5).toFixed(2),
          high: (symbol.price + Math.random() * 2).toFixed(2),
          low: (symbol.price - Math.random() * 2).toFixed(2),
        });
        setLoading(false);
      }, 1500);
    }
  }, [symbol, isOpen]);

  const handleAddWatchlist = () => {
    if (symbol) {
      toast({
        title: "Added to Watchlist",
        description: `${symbol.symbol} has been added to your watchlist`,
        duration: 3000,
      });
    }
  };

  if (!symbol) return null;

  const isGainer = symbol.change > 0;
  const changeColor = isGainer ? "text-market-up" : "text-market-down";
  const changeIcon = isGainer ? <ArrowUp size={16} /> : <ArrowDown size={16} />;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90%] sm:w-[450px] bg-market-dark border-market-grid overflow-y-auto p-0">
        <SheetHeader className="p-6 border-b border-market-grid">
          <div className="flex justify-between items-center">
            <div>
              <SheetTitle className="text-2xl flex items-center gap-2">
                {symbol.symbol}
                <Badge
                  variant={isGainer ? "default" : "destructive"}
                  className={`ml-2 ${isGainer ? "bg-market-up" : "bg-market-down"}`}
                >
                  {isGainer ? "Gainer" : "Loser"}
                </Badge>
              </SheetTitle>
              <SheetDescription className="text-xl font-mono">
                ${symbol.price.toFixed(2)}
              </SheetDescription>
            </div>
            <Button size="icon" variant="ghost" onClick={onClose} className="absolute right-4 top-4">
              <X size={18} />
            </Button>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className={`${changeColor} flex items-center text-lg`}>
              {changeIcon}
              <span className="font-mono ml-1">
                {isGainer ? "+" : ""}{symbol.change.toFixed(2)} ({isGainer ? "+" : ""}{symbol.changePercent.toFixed(2)}%)
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline">
                <TrendingUp size={18} />
              </Button>
              <Button size="icon" variant="outline" onClick={handleAddWatchlist}>
                <Settings size={18} />
              </Button>
            </div>
          </div>
        </SheetHeader>
        
        <div className="p-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview" className="flex gap-1 items-center">
                <Info size={14} />
                Overview
              </TabsTrigger>
              <TabsTrigger value="chart" className="flex gap-1 items-center">
                <BarChart3 size={14} />
                Chart
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-market-neutral">Key Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-market-neutral">Volume</p>
                        {loading ? (
                          <Skeleton className="h-4 w-20" />
                        ) : (
                          <p className="font-medium">{moreInfo?.volume?.toLocaleString()}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-market-neutral">Market Cap</p>
                        {loading ? (
                          <Skeleton className="h-4 w-20" />
                        ) : (
                          <p className="font-medium">${(moreInfo?.marketCap / 1000000).toFixed(2)}M</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-market-neutral">P/E Ratio</p>
                        {loading ? (
                          <Skeleton className="h-4 w-20" />
                        ) : (
                          <p className="font-medium">{moreInfo?.pe}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-market-neutral">52wk Range</p>
                        {loading ? (
                          <Skeleton className="h-4 w-20" />
                        ) : (
                          <p className="font-medium">${(symbol.price * 0.7).toFixed(2)} - ${(symbol.price * 1.3).toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-market-neutral">Today's Trading</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-market-neutral">Today's Open</p>
                        {loading ? (
                          <Skeleton className="h-4 w-20" />
                        ) : (
                          <p className="font-medium">${(symbol.price - symbol.change).toFixed(2)}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-market-neutral">Previous Close</p>
                        {loading ? (
                          <Skeleton className="h-4 w-20" />
                        ) : (
                          <p className="font-medium">${(symbol.price - symbol.change * 1.05).toFixed(2)}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-market-neutral">Day High</p>
                        {loading ? (
                          <Skeleton className="h-4 w-20" />
                        ) : (
                          <p className="font-medium">${moreInfo?.high}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-market-neutral">Day Low</p>
                        {loading ? (
                          <Skeleton className="h-4 w-20" />
                        ) : (
                          <p className="font-medium">${moreInfo?.low}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-10">
                      <RefreshCw className="animate-spin" size={24} />
                    </div>
                  ) : (
                    <div className={`h-10 rounded-full overflow-hidden ${isGainer ? "bg-market-up/20" : "bg-market-down/20"}`}>
                      <div 
                        className={`h-full ${isGainer ? "bg-market-up" : "bg-market-down"}`}
                        style={{ width: `${Math.min(Math.abs(symbol.changePercent * 2), 100)}%` }}
                      ></div>
                    </div>
                  )}
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-market-neutral">0%</span>
                    <span className="text-market-neutral">Market Volatility</span>
                    <span className="text-market-neutral">100%</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="chart" className="pt-4">
              <Card>
                <CardContent className="p-5 min-h-[300px] flex items-center justify-center">
                  <div className="text-center text-market-neutral">
                    <BarChart3 size={48} className="mx-auto mb-3 opacity-40" />
                    <p>Detailed chart data available with premium API subscription.</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Upgrade to Premium
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center text-market-neutral text-xs">
            <p>Data provided by Alpha Vantage API.</p>
            <p className="mt-1">Note: Some data may be simulated for demonstration purposes.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StockPanel;
