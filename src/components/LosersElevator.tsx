
import React, { useState, useEffect } from "react";
import { MarketSymbol } from "../services/alphaVantageService";
import { TrendingDown } from "lucide-react";

interface LosersElevatorProps {
  losers: MarketSymbol[];
}

const LosersElevator: React.FC<LosersElevatorProps> = ({ losers }) => {
  const [doorsOpen, setDoorsOpen] = useState<boolean>(false);
  const [currentFloor, setCurrentFloor] = useState<number>(10);

  // Open and close elevator doors periodically
  useEffect(() => {
    const doorInterval = setInterval(() => {
      setDoorsOpen(true);
      setTimeout(() => {
        setDoorsOpen(false);
        // Update floor number when doors close
        setCurrentFloor((prev) => (prev > 1 ? prev - 1 : 10));
      }, 3000); // Keep doors open for 3 seconds
    }, 6000); // Open doors every 6 seconds

    return () => clearInterval(doorInterval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-market-dark p-4 text-center mb-2 border-b border-market-grid">
        <h2 className="text-xl font-bold text-market-down flex items-center justify-center">
          <TrendingDown className="mr-2" size={20} /> Down Movers
        </h2>
        <p className="text-market-neutral text-sm">Going down...</p>
      </div>

      <div className="flex-1 relative overflow-hidden elevator bg-gray-900 border border-market-grid rounded-md">
        {/* Elevator shaft and background */}
        <div className="absolute inset-0 market-grid">
          {/* Vertical lines to simulate elevator shaft */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-market-grid"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-market-grid"></div>
          
          {/* Floor indicator */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black px-4 py-2 rounded-full border border-market-down">
            <span className="text-market-down font-mono text-xl font-bold">{currentFloor}</span>
          </div>
        </div>

        {/* Elevator doors */}
        <div className="absolute inset-0 flex">
          <div
            className={`elevator-door bg-gray-800 w-1/2 h-full border-r border-gray-700 ${
              doorsOpen ? "open-left" : ""
            }`}
          ></div>
          <div
            className={`elevator-door bg-gray-800 w-1/2 h-full border-l border-gray-700 ${
              doorsOpen ? "open-right" : ""
            }`}
          ></div>
        </div>

        {/* Losers inside elevator */}
        {doorsOpen && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 p-4">
              {losers.slice(0, 6).map((loser, index) => (
                <div
                  key={loser.symbol}
                  className="loser-symbol bg-market-dark bg-opacity-80 p-3 rounded-lg border border-market-down animate-shift-down"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="font-bold text-lg">{loser.symbol}</div>
                  <div className="text-market-down font-mono">
                    {loser.change.toFixed(2)}
                  </div>
                  <div className="text-market-down text-xs">
                    {loser.changePercent.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LosersElevator;
