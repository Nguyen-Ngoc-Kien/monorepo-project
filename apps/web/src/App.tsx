import React, { useState } from 'react';
import { ForexCalculator } from './components/ForexCalculator';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Card } from '@forex-calculator/ui';

interface CalculationResult {
  pair: string;
  lotSize: number;
  entryPoint: number;
  exitPoint: number;
  direction: 'buy' | 'sell';
  profitLoss: number;
  takeProfitPrice: number;
  stopLossPrice: number;
  accountCurrency: string;
  pipDifference: number;
  pipValue: number;
  timestamp: string;
  tpPips: number;
  slPips: number;
} 

function App() {
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [calculationHistory, setCalculationHistory] = useState<CalculationResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleCalculationResults = (calculationResults: CalculationResult) => {
    setResults(calculationResults);
    setCalculationHistory(prev => [calculationResults, ...prev].slice(0, 10));
  };

  const loadFromHistory = (historicalResult: CalculationResult) => {
    setResults(historicalResult);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-700">Forex TP/SL Calculator</h1>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors"
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>
          <p className="text-gray-600 mt-2">Calculate profit/loss and set take profit/stop loss levels for your forex trades</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ForexCalculator onCalculate={handleCalculationResults} />
            
            {showHistory && calculationHistory.length > 0 && (
              <Card title="Calculation History" className="mt-6">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {calculationHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className="p-3 bg-white rounded border flex justify-between items-center cursor-pointer hover:bg-gray-50"
                      onClick={() => loadFromHistory(item)}
                    >
                      <div>
                        <div className="font-medium">{item.pair} ({item.direction.toUpperCase()})</div>
                        <div className="text-sm text-gray-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className={parseFloat(String(item.profitLoss)) >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {parseFloat(String(item.profitLoss)) >= 0 ? '+' : ''}{item.profitLoss.toFixed(2)} {item.accountCurrency}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
          
          {results ? (
            <Card title="Trade Analysis" className="h-fit">
              <ResultsDisplay results={results} />
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No calculation yet</h3>
                <p className="mt-1 text-sm text-gray-500">Fill out the form and click calculate to see results</p>
              </div>
            </div>
          )}
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Forex Trading Calculator | Disclaimer: This calculator is for informational purposes only. Trading involves risk.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;