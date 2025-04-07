
import React, { useState, useEffect } from "react";
import { fetchMarketMovers, MarketData, MarketSymbol } from "../services/alphaVantageService";
import LosersElevator from "./LosersElevator";
import GainersStairs from "./GainersStairs";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, TrendingDown, TrendingUp, BarChart3 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketTickerProps {
  onSymbolSelect: (symbol: MarketSymbol) => void;
}

const MarketTicker: React.FC<MarketTickerProps> = ({ onSymbolSelect }) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();

  // Fetch market data on component mount and periodically
  useEffect(() => {
    console.log("MarketTicker component mounted");
    getMarketData();
    
    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      getMarketData(false);
    }, 60000); // Refresh every minute
    
    return () => clearInterval(refreshInterval);
  }, []);

  const getMarketData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching market data...");
      const data = await fetchMarketMovers();
      console.log("Market data received:", data);
      
      if (!data.gainers.length && !data.losers.length) {
        throw new Error("No market data available");
      }
      
      setMarketData(data);
      
      if (!showLoading && !refreshing) {
        toast({
          title: "Market data updated",
          description: `Latest data as of ${new Date().toLocaleTimeString()}`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error in getMarketData:", error);
      setError("Failed to fetch market data. Please try again later.");
      
      toast({
        title: "Failed to update market data",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getMarketData(false);
  };

  // Format timestamp for display
  const formattedTime = marketData
    ? new Date(marketData.timestamp).toLocaleTimeString()
    : "";

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 bg-market-dark border-b border-market-grid">
        <h1 className="text-2xl font-bold">Market Movers</h1>
        <div className="flex items-center gap-4">
          <span className="text-market-neutral text-sm">
            Last updated: {formattedTime || "Loading..."}
          </span>
          <Button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={refreshing || loading ? "animate-spin" : ""} size={16} />
            {refreshing ? "Updating..." : "Refresh"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <RefreshCw className="animate-spin mb-2" size={36} />
            <p className="text-market-neutral">Loading live market data...</p>
            <p className="text-sm text-market-neutral mt-2">
              Connecting to Alpha Vantage API...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center text-market-down">
            <AlertCircle className="mb-2" size={36} />
            <p className="font-bold">{error}</p>
            <Button
              onClick={() => getMarketData()}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 p-1 bg-gray-800 w-80 mx-auto my-2">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <BarChart3 size={14} />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger value="down" className="flex items-center gap-1 text-market-down">
                <TrendingDown size={14} />
                <span>Losers</span>
              </TabsTrigger>
              <TabsTrigger value="up" className="flex items-center gap-1 text-market-up">
                <TrendingUp size={14} />
                <span>Gainers</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-[calc(100vh-300px)] overflow-hidden">
                {marketData && (
                  <>
                    <div className="h-full">
                      <LosersElevator 
                        losers={marketData.losers} 
                        onSymbolClick={onSymbolSelect} 
                      />
                    </div>
                    <div className="h-full">
                      <GainersStairs 
                        gainers={marketData.gainers} 
                        onSymbolClick={onSymbolSelect}
                      />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="down" className="mt-0">
              <div className="p-4 h-[calc(100vh-300px)] overflow-hidden">
                {marketData && (
                  <div className="h-full">
                    <LosersElevator 
                      losers={marketData.losers} 
                      onSymbolClick={onSymbolSelect} 
                      fullWidth={true}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="up" className="mt-0">
              <div className="p-4 h-[calc(100vh-300px)] overflow-hidden">
                {marketData && (
                  <div className="h-full">
                    <GainersStairs 
                      gainers={marketData.gainers} 
                      onSymbolClick={onSymbolSelect}
                      fullWidth={true}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default MarketTicker;
