
// Alpha Vantage API service
const API_KEY = 'demo'; // Replace with your actual Alpha Vantage API key in production

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
    // In a real implementation, you would fetch from Alpha Vantage API using your API key
    // This is a mock implementation to avoid rate limits during development
    
    // For demo purposes, we'll create mock data
    // In production, you'd replace this with actual API calls
    
    // Example API call (commented out to avoid rate limiting):
    // const response = await fetch(
    //   `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`
    // );
    // const data = await response.json();
    // return processAlphaVantageData(data);
    
    return getMockMarketData();
  } catch (error) {
    console.error("Error fetching market data:", error);
    return {
      gainers: [],
      losers: [],
      timestamp: new Date().toISOString(),
    };
  }
};

// Process Alpha Vantage response data
const processAlphaVantageData = (data: any): MarketData => {
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

// Mock data function for development
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
