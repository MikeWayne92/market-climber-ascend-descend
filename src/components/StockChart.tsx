
import React, { useState, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { MarketSymbol } from "@/services/alphaVantageService";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface StockChartProps {
  symbol: MarketSymbol;
  timeframe: "1D" | "1W" | "1M" | "3M" | "1Y";
}

// Generate mock data for chart
const generateChartData = (symbol: MarketSymbol, timeframe: string) => {
  const data = [];
  const now = new Date();
  let startDate: Date;
  let interval: number;
  let dataPoints: number;
  
  // Set timeframe parameters
  switch(timeframe) {
    case "1D":
      startDate = new Date(now);
      startDate.setHours(9, 30, 0, 0); // Market open
      interval = 30; // 30 min intervals
      dataPoints = 14; // 7 hours / 30 min = 14 points
      break;
    case "1W":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      interval = 24 * 60; // Daily
      dataPoints = 7;
      break;
    case "1M":
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      interval = 24 * 60; // Daily
      dataPoints = 30;
      break;
    case "3M":
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 3);
      interval = 24 * 60 * 3; // 3 days
      dataPoints = 30;
      break;
    case "1Y":
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      interval = 24 * 60 * 7; // Weekly
      dataPoints = 52;
      break;
    default:
      startDate = new Date(now);
      startDate.setHours(9, 30, 0, 0);
      interval = 30;
      dataPoints = 14;
  }

  // Base price on the current stock price
  const basePrice = symbol.price;
  const volatility = Math.abs(symbol.changePercent) / 100;
  
  // Generate data points
  for (let i = 0; i < dataPoints; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMinutes(startDate.getMinutes() + (interval * i));
    
    // More realistic price movement
    const randomChange = Math.random() * volatility * 2 - volatility;
    const directionBias = symbol.change > 0 ? 0.6 : 0.4; // Slight bias based on stock trend
    const directedChange = randomChange + (Math.random() > directionBias ? volatility/2 : -volatility/2);
    
    // Calculate cumulative price movement
    const price = basePrice * (1 + (directedChange * (i / dataPoints)));
    
    data.push({
      time: formatTimeLabel(currentDate, timeframe),
      price: price.toFixed(2),
      fullDate: currentDate.toISOString()
    });
  }
  
  return data;
};

// Format time labels based on timeframe
const formatTimeLabel = (date: Date, timeframe: string): string => {
  switch(timeframe) {
    case "1D":
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    case "1W":
      return date.toLocaleDateString([], { weekday: 'short' });
    case "1M":
    case "3M":
      return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
    case "1Y":
      return date.toLocaleDateString([], { month: 'short' });
    default:
      return date.toLocaleTimeString();
  }
};

const StockChart: React.FC<StockChartProps> = ({ symbol, timeframe }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      try {
        const data = generateChartData(symbol, timeframe);
        setChartData(data);
      } catch (error) {
        console.error("Error generating chart data:", error);
        toast({
          title: "Chart Error",
          description: "Could not load chart data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [symbol.symbol, timeframe, toast]);

  if (loading) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  const isPositive = symbol.change >= 0;
  const chartColor = isPositive ? "#22c55e" : "#ef4444";
  const chartConfig = {
    price: {
      label: "Price",
      theme: {
        light: chartColor,
        dark: chartColor,
      },
    },
  };

  return (
    <div className="w-full">
      <ChartContainer
        config={chartConfig}
        className="aspect-[4/3] h-[250px] w-full px-1"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartColor}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartColor}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              minTickGap={5}
            />
            <YAxis
              domain={["dataMin - 5", "dataMax + 5"]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              width={40}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="fullDate" 
                  formatter={(value: string, name: string) => [`$${value}`, "Price"]}
                  labelFormatter={(label: string) => 
                    new Date(label).toLocaleDateString([], { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })
                  }
                />
              }
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              fillOpacity={1}
              fill="url(#colorPrice)"
              isAnimationActive={true}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default StockChart;
