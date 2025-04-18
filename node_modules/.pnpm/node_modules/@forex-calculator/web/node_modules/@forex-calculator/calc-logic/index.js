/**
 * Calculate Forex profit/loss and TP/SL values
 * @param {string} pair - The forex pair (e.g., "XAUUSD")
 * @param {number} lotSize - Size of the lot
 * @param {number} entryPoint - Entry point price
 * @param {number} exitPoint - Exit point price
 * @param {string} direction - "buy" or "sell"
 * @returns {Object} Calculation results
 */
export const calculateForex = (pair, lotSize, entryPoint, exitPoint, direction) => {
  let pipValue, pipDifference, pipSize;
  
  pair = pair.toUpperCase();
  
  // Determine pip size and calculate pip difference
  if (pair === "XAUUSD") {
    // For gold (XAU/USD), 1 pip is 0.1
    pipSize = 0.1;
    pipDifference = Math.abs(exitPoint - entryPoint) / pipSize;
    // Standard contract size for gold is 100 oz
    pipValue = lotSize * 10;
  } else if (pair.includes("JPY")) {
    // For JPY pairs, 1 pip is 0.01
    pipSize = 0.01;
    pipDifference = Math.abs(exitPoint - entryPoint) / pipSize;
    pipValue = lotSize * 10;
  } else {
    // For standard forex pairs, 1 pip is 0.0001
    pipSize = 0.0001;
    pipDifference = Math.abs(exitPoint - entryPoint) / pipSize;
    // Standard lot value calculation
    pipValue = lotSize * 10;
  }

  // Calculate profit/loss
  const rawProfitLoss = direction.toLowerCase() === "buy" 
    ? (exitPoint - entryPoint) * lotSize * getPipMultiplier(pair)
    : (entryPoint - exitPoint) * lotSize * getPipMultiplier(pair);

  return {
    pair,
    lotSize,
    entryPoint,
    exitPoint,
    direction,
    pipDifference,
    pipValue,
    pipSize,
    profitLoss: rawProfitLoss.toFixed(2),
    tpPips: direction.toLowerCase() === "buy" 
      ? Math.round((exitPoint - entryPoint) / pipSize)
      : Math.round((entryPoint - exitPoint) / pipSize)
  };
};

/**
* Get multiplier for pip value calculation based on pair
* @param {string} pair - The forex pair
* @returns {number} Multiplier value
*/
const getPipMultiplier = (pair) => {
if (pair === "XAUUSD") {
  return 100; // Gold has a different multiplier
} else if (pair.includes("JPY")) {
  return 1000; // JPY pairs have a different multiplier
} else {
  return 100000; // Standard forex pairs
}
};

/**
* Calculate TP and SL based on entry point and desired pip distances
* @param {string} pair - The forex pair
* @param {number} entryPoint - Entry point price
* @param {number} tpPips - Take profit in pips
* @param {number} slPips - Stop loss in pips
* @param {string} direction - "buy" or "sell"
* @returns {Object} TP and SL prices
*/
export const calculateTPSL = (pair, entryPoint, tpPips, slPips, direction) => {
pair = pair.toUpperCase();

let pipSize;
let decimalPlaces;

if (pair.includes("JPY")) {
  pipSize = 0.01;
  decimalPlaces = 3;
} else if (pair === "XAUUSD") {
  pipSize = 0.1;
  decimalPlaces = 2;
} else {
  pipSize = 0.0001;
  decimalPlaces = 5;
}

let takeProfit, stopLoss;

if (direction.toLowerCase() === "buy") {
  takeProfit = entryPoint + (tpPips * pipSize);
  stopLoss = entryPoint - (slPips * pipSize);
} else {
  takeProfit = entryPoint - (tpPips * pipSize);
  stopLoss = entryPoint + (slPips * pipSize);
}

return {
  takeProfitPrice: takeProfit.toFixed(decimalPlaces),
  stopLossPrice: stopLoss.toFixed(decimalPlaces),
  tpPips, 
  slPips
};
};