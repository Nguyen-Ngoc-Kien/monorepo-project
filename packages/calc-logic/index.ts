export interface ForexCalculationResult {
  pair: string;
  lotSize: number;
  entryPoint: number;
  exitPoint: number;
  direction: 'buy' | 'sell';
  pipDifference: number;
  pipValue: number;
  pipSize: number;
  profitLoss: string;
  tpPips: number;
}

export const calculateForex = (
  pair: string,
  lotSize: number,
  entryPoint: number,
  exitPoint: number,
  direction: 'buy' | 'sell'
): ForexCalculationResult => {
  let pipValue: number, pipDifference: number, pipSize: number;

  pair = pair.toUpperCase();

  if (pair === "XAUUSD") {
    pipSize = 0.1;
    pipDifference = Math.abs(exitPoint - entryPoint) / pipSize;
    pipValue = lotSize * 10;
  } else if (pair.includes("JPY")) {
    pipSize = 0.01;
    pipDifference = Math.abs(exitPoint - entryPoint) / pipSize;
    pipValue = lotSize * 10;
  } else {
    pipSize = 0.0001;
    pipDifference = Math.abs(exitPoint - entryPoint) / pipSize;
    pipValue = lotSize * 10;
  }

  const rawProfitLoss =
    direction.toLowerCase() === "buy"
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
    tpPips:
      direction.toLowerCase() === "buy"
        ? Math.round((exitPoint - entryPoint) / pipSize)
        : Math.round((entryPoint - exitPoint) / pipSize),
  };
};

const getPipMultiplier = (pair: string): number => {
  if (pair === "XAUUSD") {
    return 100;
  } else if (pair.includes("JPY")) {
    return 1000;
  } else {
    return 100000;
  }
};

export interface TPSLCalculationResult {
  takeProfitPrice: string;
  stopLossPrice: string;
  tpPips: number;
  slPips: number;
}

export const calculateTPSL = (
  pair: string,
  entryPoint: number,
  tpPips: number,
  slPips: number,
  direction: 'buy' | 'sell'
): TPSLCalculationResult => {
  pair = pair.toUpperCase();

  let pipSize: number;
  let decimalPlaces: number;

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

  let takeProfit: number, stopLoss: number;

  if (direction.toLowerCase() === "buy") {
    takeProfit = entryPoint + tpPips * pipSize;
    stopLoss = entryPoint - slPips * pipSize;
  } else {
    takeProfit = entryPoint - tpPips * pipSize;
    stopLoss = entryPoint + slPips * pipSize;
  }

  return {
    takeProfitPrice: takeProfit.toFixed(decimalPlaces),
    stopLossPrice: stopLoss.toFixed(decimalPlaces),
    tpPips,
    slPips,
  };
};
