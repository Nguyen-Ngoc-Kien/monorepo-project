import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button, Input, Card } from '@forex-calculator/ui';
import { calculateForex, calculateTPSL } from '@forex-calculator/calc-logic';

interface ForexCalculatorProps {
  onCalculate: (result: ResultData) => void;
}

export const ForexCalculator: React.FC<ForexCalculatorProps> = ({ onCalculate }) => {
  const [formData, setFormData] = useState<FormData>({
    pair: 'XAUUSD',
    lotSize: 0.01,
    entryPoint: 2000.0,
    exitPoint: 2010.0,
    direction: 'buy',
    tpPips: 100,
    slPips: 50,
    accountCurrency: 'USD'
  });

  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDecimalPlaces = (pair: string): number => {
    if (pair.includes('JPY')) return 3;
    if (pair === 'XAUUSD') return 2;
    return 5;
  };

  useEffect(() => {
    if (formData.entryPoint && formData.tpPips) {
      const pipSize =
        formData.pair === 'XAUUSD' ? 0.1 : formData.pair.includes('JPY') ? 0.01 : 0.0001;

      const newExitPoint =
        formData.direction === 'buy'
          ? formData.entryPoint + formData.tpPips * pipSize
          : formData.entryPoint - formData.tpPips * pipSize;

      setFormData((prev) => ({
        ...prev,
        exitPoint: parseFloat(newExitPoint.toFixed(getDecimalPlaces(formData.pair)))
      }));
    }
  }, [formData.entryPoint, formData.tpPips, formData.direction, formData.pair]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: ['lotSize', 'entryPoint', 'exitPoint', 'tpPips', 'slPips'].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleCalculate = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const { pair, lotSize, entryPoint, exitPoint, direction, tpPips, slPips, accountCurrency } =
        formData;

      const forexResults = calculateForex(pair, lotSize, entryPoint, exitPoint, direction);
      const tpslResults = calculateTPSL(pair, entryPoint, tpPips, slPips, direction);

      const resultData: ResultData = {
        ...forexResults,
        ...tpslResults,
        accountCurrency,
        timestamp: new Date().toISOString()
      };

      onCalculate(resultData);
      setResult(resultData);
      setIsLoading(false);
    }, 300);
  };

  const currencyPairs = [
    { value: 'XAUUSD', label: 'XAU/USD (Gold)' },
    { value: 'EURUSD', label: 'EUR/USD' },
    { value: 'GBPUSD', label: 'GBP/USD' },
    { value: 'USDJPY', label: 'USD/JPY' },
    { value: 'AUDUSD', label: 'AUD/USD' },
    { value: 'USDCAD', label: 'USD/CAD' },
    { value: 'NZDUSD', label: 'NZD/USD' },
    { value: 'USDCHF', label: 'USD/CHF' }
  ];

  return (
    <Card title="Forex Calculator">
      <form onSubmit={handleCalculate} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency Pair</label>
            <select
              name="pair"
              value={formData.pair}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {currencyPairs.map(pair => (
                <option key={pair.value} value={pair.value}>{pair.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <Input 
              label="Lot Size" 
              id="lotSize" 
              name="lotSize" 
              type="number" 
              step="0.01"
              min="0.01" 
              value={formData.lotSize} 
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Currency</label>
            <select
              name="accountCurrency"
              value={formData.accountCurrency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
          
          <div>
            <Input 
              label="Entry Point" 
              id="entryPoint" 
              name="entryPoint" 
              type="number" 
              step="0.00001" 
              value={formData.entryPoint} 
              onChange={handleInputChange}
            />
          </div>
            
          <div>
            <Input 
              label="Exit Point" 
              id="exitPoint" 
              name="exitPoint" 
              type="number" 
              step="0.00001"
              value={formData.exitPoint} 
              onChange={handleInputChange}
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
            <div className="flex space-x-4 mt-1">
              <label className="flex items-center p-2 border rounded-md cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-50" style={{
                backgroundColor: formData.direction === 'buy' ? '#dcfce7' : 'transparent',
                borderColor: formData.direction === 'buy' ? '#22c55e' : '#d1d5db'
              }}>
                <input
                  type="radio"
                  name="direction"
                  value="buy"
                  checked={formData.direction === 'buy'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 font-medium">Buy/Long</span>
              </label>
              <label className="flex items-center p-2 border rounded-md cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-50" style={{
                backgroundColor: formData.direction === 'sell' ? '#fee2e2' : 'transparent',
                borderColor: formData.direction === 'sell' ? '#ef4444' : '#d1d5db'
              }}>
                <input
                  type="radio"
                  name="direction"
                  value="sell"
                  checked={formData.direction === 'sell'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 font-medium">Sell/Short</span>
              </label>
            </div>
          </div>
          
          <div>
            <Input 
              label="Take Profit (Pips)" 
              id="tpPips" 
              name="tpPips" 
              type="number"
              min="1"
              value={formData.tpPips} 
              onChange={handleInputChange}
            />
          </div>
            
          <div>
            <Input 
              label="Stop Loss (Pips)" 
              id="slPips" 
              name="slPips" 
              type="number"
              min="1"
              value={formData.slPips} 
              onChange={handleInputChange}
            />
          </div>
          
          <div className="col-span-2">
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-3 font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Calculating...' : 'Calculate'}
            </Button>
          </div>
        </div>
      </form>
      
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-3 text-sm border">
          <div className="flex justify-between items-center">
            <span className="font-medium">Take Profit Price:</span>
            <span className="text-green-600 font-bold">{result.takeProfitPrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Stop Loss Price:</span>
            <span className="text-red-600 font-bold">{result.stopLossPrice}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-medium">Potential Profit / Loss:</span>
            <span className={parseFloat(result.profitLoss) >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {parseFloat(result.profitLoss) >= 0 ? '+' : ''}{result.profitLoss} {result.accountCurrency}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};