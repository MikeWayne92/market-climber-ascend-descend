
import React from "react";
import { MarketSymbol } from "../services/alphaVantageService";
import { TrendingUp, ArrowUp } from "lucide-react";

interface GainersStairsProps {
  gainers: MarketSymbol[];
  onSymbolClick: (symbol: MarketSymbol) => void;
  fullWidth?: boolean;
}

const GainersStairs: React.FC<GainersStairsProps> = ({ gainers, onSymbolClick, fullWidth = false }) => {
  // Create an array for our stairs
  const stairCount = 10;
  const stairs = Array.from({ length: stairCount }, (_, i) => i);

  // Assign gainers to specific stairs
  const assignedStairs = gainers.slice(0, stairCount).reduce((acc, gainer, index) => {
    acc[stairCount - index - 1] = gainer;
    return acc;
  }, {} as Record<number, MarketSymbol>);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-market-dark p-4 text-center mb-2 border-b border-market-grid">
        <h2 className="text-xl font-bold text-market-up flex items-center justify-center">
          <TrendingUp className="mr-2" size={20} /> Up Movers
        </h2>
        <p className="text-market-neutral text-sm">Climbing up...</p>
      </div>

      <div className="flex-1 relative market-grid bg-gray-900 border border-market-grid rounded-md overflow-hidden">
        {/* Vertical guide lines */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-market-grid"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-market-grid"></div>
        
        {/* Horizontal grid lines */}
        {stairs.map((stair) => (
          <div 
            key={`line-${stair}`} 
            className="absolute left-0 right-0 h-[1px] bg-market-grid opacity-20" 
            style={{ top: `${(stair + 1) * 100 / stairCount}%` }}
          ></div>
        ))}
        
        {/* Stairs container */}
        <div className="absolute inset-0 flex flex-col-reverse justify-between p-4">
          {stairs.map((stair) => (
            <div 
              key={stair} 
              className="stair flex items-center px-3"
              style={{
                height: `calc(100% / ${stairCount} - 5px)`,
                zIndex: stair
              }}
            >
              {/* Stair number */}
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-market-grid text-market-neutral">
                {stair + 1}
              </div>
              
              {/* Symbol on stair (if assigned) */}
              {assignedStairs[stair] && (
                <div 
                  className="gainer-symbol ml-4 bg-market-dark bg-opacity-80 p-3 rounded-lg border border-market-up hover:animate-bounce-up cursor-pointer hover:bg-gray-800 group relative"
                  onClick={() => onSymbolClick(assignedStairs[stair])}
                >
                  <div className="absolute -top-2 -right-2 bg-market-up text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUp size={12} />
                  </div>
                  <div className="font-bold text-lg">{assignedStairs[stair].symbol}</div>
                  <div className="text-market-up font-mono">
                    +{assignedStairs[stair].change.toFixed(2)}
                  </div>
                  <div className="text-market-up text-xs">
                    +{assignedStairs[stair].changePercent.toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GainersStairs;
