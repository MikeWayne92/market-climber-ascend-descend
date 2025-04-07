
import React, { useState, useEffect } from "react";
import { fetchMarketMovers, MarketData } from "../services/alphaVantageService";
import LosersElevator from "./LosersElevator";
import GainersStairs from "./GainersStairs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const MarketTicker: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { toast } = useToast();

  // Fetch market data on component mount and periodically
  useEffect(() => {
    getMarketData();
    
    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      getMarketData(false);
    }, 60000); // Refresh every minute
    
    return () => clearInterval(refreshInterval);
  }, []);

  const getMarketData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await fetchMarketMovers();
      setMarketData(data);
      if (!showLoading) {
        toast({
          title: "Market data updated",
          description: `Latest data as of ${new Date().toLocaleTimeString()}`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
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
            Last updated: {formattedTime}
          </span>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={refreshing ? "animate-spin" : ""} size={16} />
            {refreshing ? "Updating..." : "Refresh"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <RefreshCw className="animate-spin mb-2" size={36} />
            <p className="text-market-neutral">Loading market data...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
          {marketData && (
            <>
              <div className="h-[600px] md:h-full">
                <LosersElevator losers={marketData.losers} />
              </div>
              <div className="h-[600px] md:h-full">
                <GainersStairs gainers={marketData.gainers} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketTicker;
