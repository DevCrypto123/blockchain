import axios from 'axios'
// Set the minimum profit margin required to send a notification
const MIN_PROFIT_MARGIN = 0.001;

// Get all spot trading pairs with USDT
const getSpotTradingPairsWithUsdt = async () => {
    const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
    const exchangeInfo = response.data;
    const symbols = exchangeInfo.symbols;
    return symbols.filter(symbol => symbol.quoteAsset === 'USDT');
};

// Calculate the profit margin for a triangular arbitrage opportunity
const calculateProfitMargin = async (symbol1, symbol2, symbol3) => {
    // Get the bid and ask prices for each symbol
    const [bid1, ask1] = await getBidAskPrice(symbol1);
    const [bid2, ask2] = await getBidAskPrice(symbol2);
    const [bid3, ask3] = await getBidAskPrice(symbol3);

    // Calculate the profit margin
    let profitMargin = (bid1 * ask2 * bid3) / (ask1 * bid2 * ask3) - 1;

    // Subtract the fees
    profitMargin -= 0.001; // Binance trading fee

    return profitMargin;
};

// Get the bid and ask prices for a symbol
const getBidAskPrice = async (symbol) => {
    const response = await axios.get('https://api.binance.com/api/v3/depth?symbol='+symbol["symbol"]);
    const depth = response.data;
    //console.log(response.data)
    if (depth.bids.length>0 && depth.asks.length>0){
        const bidPrice = depth.bids[0][0];
        const askPrice = depth.asks[0][0];
        return [bidPrice, askPrice];
    }
    return [0,0];
};

// Scan all spot trading pairs with USDT for triangular arbitrage trading opportunities
const scanForTriangularArbitrageOpportunities = async () => {
    const spotTradingPairsWithUsdt = await getSpotTradingPairsWithUsdt();

    // Iterate over all possible triangular arbitrage opportunities
    for (const symbol1 of spotTradingPairsWithUsdt) {
        for (const symbol2 of spotTradingPairsWithUsdt) {
            for (const symbol3 of spotTradingPairsWithUsdt) {
                // Calculate the profit margin for the triangular arbitrage opportunity
                const profitMargin = await calculateProfitMargin(symbol1, symbol2, symbol3);

                // If the profit margin is greater than the minimum required, send a notification
                if (profitMargin > MIN_PROFIT_MARGIN) {
                    // Send a notification to the user
                    console.log(`Triangular arbitrage opportunity found: ${symbol1} -> ${symbol2} -> ${symbol3} with a profit margin of ${profitMargin}`);
                }
            }
        }
    }
};

// Start scanning for triangular arbitrage opportunities every second
setInterval(scanForTriangularArbitrageOpportunities, 2000);
