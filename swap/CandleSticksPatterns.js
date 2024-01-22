import fetch from 'node-fetch'
import crypto from 'crypto'

const API_KEY = 'Kd1sSCJGB1JLtdBvtsnskwuawa2VMIjhEqNrQxkEXSXDPM4KfB6V2tNk3sPs5cRT';
const API_SECRET = '94PsjkTmJn8ZAHBDNzVTDlkFlrJsEPXtgj58aVpUhXL3Gr9KcPe4l0hsrVV3ygyL';

const binanceBaseURL = 'https://fapi.binance.com';

console.log("Program Started... Checking for pairs.. Plase wait...")
const fetchAllSymbols = async () => {
    const response = await fetch(`${binanceBaseURL}/fapi/v1/exchangeInfo`);

    if (response.status !== 200) {
        throw new Error(`Failed to fetch symbols: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract symbols from the response
    const symbols = data.symbols.map(symbol => symbol.symbol);

    return symbols;
};

const checkStableLinesForSymbol = async (symbol) => {
    const now = Date.now();
    const startTime = now - 30 * 24 * 60 * 60 * 1000; // 30 days ago
    const endTime = now; // Now
    //console.log(startTime , endTime)
    const interval = '4h';
    const limit = 100;

    const signature = crypto
        .createHmac('sha256', API_SECRET)
        .update(`symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=${limit}`)
        .digest('hex');

    const url = `${binanceBaseURL}/fapi/v1/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=${limit}&signature=${signature}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-MBX-APIKEY': API_KEY,
        },
    });

    if (response.status !== 200) {
        throw new Error(`Failed to fetch candlestick data for ${symbol}: ${response.statusText}`);
    }

    const candlestickData = await response.json();

    // Compare the last 10 candlesticks with the last one
    const lastTenCandles = candlestickData.slice(-11, -1);
    const lastCandle = candlestickData[candlestickData.length - 1];

    for (let i = 0; i < lastTenCandles.length; i++) {
        const closePrice = parseFloat(lastTenCandles[i][4]);
        const percentageChange = calculatePercentageChange(closePrice, parseFloat(lastCandle[4]));

        if (Math.abs(percentageChange) > 1) {
            //console.log('\x1b[31m',`Unstable line found for ${symbol}. Last 10 candles have more than 1% change.`);
            return;
        }
    }

    console.log('\x1b[32m',`Stable line found for ${symbol}. Last 10 candles have less than 1% change.`);
};

// Example usage
(async () => {
    try {
        const allSymbols = await fetchAllSymbols();

        for (const symbol of allSymbols) {
            await checkStableLinesForSymbol(symbol);
        }
    } catch (error) {
        console.error(error.message);
    }
})();

const calculatePercentageChange = (previous, current) => {
    return ((current - previous) / previous) * 100;
};
