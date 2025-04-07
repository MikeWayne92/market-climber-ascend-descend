
import React from "react";
import MarketTicker from "../components/MarketTicker";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-market-dark flex flex-col">
      <header className="py-4 px-6 bg-gray-900 border-b border-market-grid">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-market-up to-blue-500 bg-clip-text text-transparent">
              Market Climber
            </h1>
            <div className="text-market-neutral">
              <span className="text-xs md:text-sm">Powered by Alpha Vantage</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <MarketTicker />
      </main>
      
      <footer className="py-3 px-6 bg-gray-900 border-t border-market-grid">
        <div className="container mx-auto">
          <div className="text-center text-market-neutral text-sm">
            <p>
              Data provided for demonstration purposes. 
              Replace with your Alpha Vantage API key for live data.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
