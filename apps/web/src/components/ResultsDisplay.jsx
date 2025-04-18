import React from 'react';

export const ResultsDisplay = ({ results }) => {
  const { 
    pair, 
    lotSize, 
    entryPoint, 
    exitPoint, 
    direction, 
    profitLoss, 
    takeProfitPrice, 
    stopLossPrice, 
    accountCurrency,
    pipDifference,
    pipValue,
    timestamp,
    tpPips,
    slPips
  } = results;
  
  const isProfitable = parseFloat(profitLoss) > 0;
  const formattedDate = new Date(timestamp).toLocaleString();
  
  // Function to get currency symbols
  const getCurrencySymbol = (currency) => {
    switch(currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      default: return '$';
    }
  };
  
  // Format pair for display
  const formatPair = (pair) => {
    if (pair === 'XAUUSD') return 'XAU/USD (Gold)';
    return `${pair.slice(0, 3)}/${pair.slice(3)}`;
  };
  
  // Calculate correct risk-reward ratio (risk : reward, or SL : TP)
  // If SL is 5 pips and TP is 10 pips, R:R should be 1:2
  const riskValue = slPips; // Risk is the SL pips
  const rewardValue = tpPips; // Reward is the TP pips
  const riskRewardRatio = (rewardValue / riskValue).toFixed(2);
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${direction === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} mr-3`}>
              {direction === 'buy' ? '↗' : '↘'}
            </div>
            <div>
              <div className="font-semibold text-lg">{formatPair(pair)}</div>
              <div className="text-sm text-gray-500">{formattedDate}</div>
            </div>
          </div>
          <div className={`text-xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
            {isProfitable ? '+' : ''}{getCurrencySymbol(accountCurrency)}{Math.abs(parseFloat(profitLoss)).toFixed(2)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div className="text-gray-600">Direction:</div>
          <div className={`font-medium ${direction === 'buy' ? 'text-green-600' : 'text-red-600'} capitalize`}>
            {direction === 'buy' ? 'Buy (Long)' : 'Sell (Short)'}
          </div>
          
          <div className="text-gray-600">Lot Size:</div>
          <div className="font-medium">{lotSize}</div>
          
          <div className="text-gray-600">Entry Price:</div>
          <div className="font-medium">{entryPoint}</div>
          
          <div className="text-gray-600">Exit Price:</div>
          <div className="font-medium">{exitPoint}</div>
          
          <div className="text-gray-600">Pip Difference:</div>
          <div className="font-medium">{Math.round(pipDifference)} pips</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-green-800 font-medium mb-2">Take Profit</div>
          <div className="text-2xl font-bold text-green-700">{takeProfitPrice}</div>
          <div className="text-sm text-green-600 mt-1">
            {direction === 'buy' ? `+${tpPips}` : `-${tpPips}`} pips from entry
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-red-800 font-medium mb-2">Stop Loss</div>
          <div className="text-2xl font-bold text-red-700">{stopLossPrice}</div>
          <div className="text-sm text-red-600 mt-1">
            {direction === 'buy' ? `-${slPips}` : `+${slPips}`} pips from entry
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
        <div className="flex justify-between mb-4">
          <div className="text-indigo-800 font-medium">Risk/Reward Ratio</div>
          <div className="text-lg font-bold text-indigo-700">1:{riskRewardRatio}</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${Math.min(100, parseFloat(riskRewardRatio) * 33)}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center">
          {parseFloat(riskRewardRatio) >= 2 ? 'Good risk-reward ratio' : 'Consider improving your risk-reward ratio'}
        </div>
      </div>
    </div>
  );
};