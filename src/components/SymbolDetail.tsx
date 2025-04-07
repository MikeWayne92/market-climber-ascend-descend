
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MarketSymbol } from "../services/alphaVantageService";
import { ArrowDown, ArrowUp } from "lucide-react";

interface SymbolDetailProps {
  symbol: MarketSymbol | null;
  isOpen: boolean;
  onClose: () => void;
}

const SymbolDetail: React.FC<SymbolDetailProps> = ({
  symbol,
  isOpen,
  onClose,
}) => {
  if (!symbol) return null;

  const isGainer = symbol.change > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-market-dark border-market-grid">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {symbol.symbol}
            {isGainer ? (
              <ArrowUp className="text-market-up" />
            ) : (
              <ArrowDown className="text-market-down" />
            )}
          </DialogTitle>
          <DialogDescription>
            Current Price: ${symbol.price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md bg-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-market-neutral">Change</span>
              <span className={isGainer ? "text-market-up" : "text-market-down"}>
                {isGainer ? "+" : ""}{symbol.change.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-market-neutral">Percent Change</span>
              <span className={isGainer ? "text-market-up" : "text-market-down"}>
                {isGainer ? "+" : ""}{symbol.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="text-center text-market-neutral text-sm">
            <p>
              This is demo data. For real-time data,
              <br />
              replace with your Alpha Vantage API key.
            </p>
          </div>
          
          <div className={`h-2 rounded-full ${
            isGainer ? "bg-market-up" : "bg-market-down"
          } w-full opacity-20`}>
            <div
              className={`h-2 rounded-full ${
                isGainer ? "bg-market-up" : "bg-market-down"
              }`}
              style={{
                width: `${Math.min(Math.abs(symbol.changePercent) * 5, 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SymbolDetail;
