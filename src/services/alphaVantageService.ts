
// Alpha Vantage API service
const API_KEY = 'GTYY5A5STDWMB49X'; // User's Alpha Vantage API key

export type MarketSymbol = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
};

export type MarketData = {
  gainers: MarketSymbol[];
  losers: MarketSymbol[];
  timestamp: string;
};

// Function to fetch top gainers and losers
export const fetchMarketMovers = async (): Promise<MarketData> => {
  try {
    // Use the real Alpha Vantage API with the provided key
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we have valid data
    if (data.error) {
      console.error("Alpha Vantage API error:", data.error);
      // Fall back to mock data if there's an API error
      return getMockMarketData();
    }
    
    return processAlphaVantageData(data);
  } catch (error) {
    console.error("Error fetching market data:", error);
    // Fall back to mock data if there's an error
    return getMockMarketData();
  }
};

// Process Alpha Vantage response data
const processAlphaVantageData = (data: any): MarketData => {
  // If there's no valid data structure, fall back to mock data
  if (!data.top_gainers || !data.top_losers) {
    console.warn("Unexpected API response structure, using mock data");
    return getMockMarketData();
  }

  const gainers = data.top_gainers?.map((gainer: any) => ({
    symbol: gainer.ticker,
    price: parseFloat(gainer.price),
    change: parseFloat(gainer.change_amount),
    changePercent: parseFloat(gainer.change_percentage.replace('%', '')),
  })) || [];

  const losers = data.top_losers?.map((loser: any) => ({
    symbol: loser.ticker,
    price: parseFloat(loser.price),
    change: parseFloat(loser.change_amount),
    changePercent: parseFloat(loser.change_percentage.replace('%', '')),
  })) || [];

  return {
    gainers,
    losers,
    timestamp: data.last_updated || new Date().toISOString(),
  };
};

// Mock data function as fallback
const getMockMarketData = (): MarketData => {
  const gainers = [
    { symbol: "AAPL", price: 182.63, change: 5.28, changePercent: 2.98 },
    { symbol: "TSLA", price: 247.92, change: 12.35, changePercent: 5.24 },
    { symbol: "NVDA", price: 434.58, change: 23.45, changePercent: 5.71 },
    { symbol: "MSFT", price: 334.27, change: 7.89, changePercent: 2.42 },
    { symbol: "AMZN", price: 178.15, change: 6.72, changePercent: 3.92 },
    { symbol: "GOOG", price: 138.45, change: 4.28, changePercent: 3.19 },
    { symbol: "META", price: 465.73, change: 18.93, changePercent: 4.24 },
  ];

  const losers = [
    { symbol: "GME", price: 13.24, change: -2.37, changePercent: -15.18 },
    { symbol: "AMC", price: 4.85, change: -0.75, changePercent: -13.40 },
    { symbol: "BBBY", price: 0.05, change: -0.01, changePercent: -16.67 },
    { symbol: "PLTR", price: 19.87, change: -2.13, changePercent: -9.68 },
    { symbol: "RIVN", price: 10.54, change: -0.86, changePercent: -7.54 },
    { symbol: "COIN", price: 217.65, change: -12.35, changePercent: -5.37 },
    { symbol: "HOOD", price: 14.78, change: -0.92, changePercent: -5.86 },
  ];

  return {
    gainers,
    losers,
    timestamp: new Date().toISOString(),
  };
};

// Function to refresh data periodically (can be called from components)
export const refreshMarketData = async (
  callback: (data: MarketData) => void
): Promise<void> => {
  const data = await fetchMarketMovers();
  callback(data);
};
