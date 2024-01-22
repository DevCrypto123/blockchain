import axios from 'axios'
import moment from 'moment'

const apiKey = 'Kd1sSCJGB1JLtdBvtsnskwuawa2VMIjhEqNrQxkEXSXDPM4KfB6V2tNk3sPs5cRT'; // Replace with your Binance API key
const apiSecret = '94PsjkTmJn8ZAHBDNzVTDlkFlrJsEPXtgj58aVpUhXL3Gr9KcPe4l0hsrVV3ygyL'; // Replace with your Binance API secret
const symbol = 'AVAXUSDT';
const timeframe ='3m';
const limit = 60*24 *1000;

const binanceBaseURL = 'https://api.binance.com/api/v3';
const takerFee = 0.0000; // 0.050%
const makerFee = 0.0000; // 0.020%

async function getCandlestickData(symbol, interval, limit) {
    try {
        const response = await axios.get(`${binanceBaseURL}/klines`, {
            params: {
                symbol,
                interval,
                limit,
            },
        });

        return response.data.map(candle => ({
            timestamp: candle[0],
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
            volume: parseFloat(candle[5]),
        }));
    } catch (error) {
        console.error('Error fetching candlestick data:', error);
        throw error;
    }
}

async function calculateProfit(candlestickData) {
    let totalProfit = 0;
    let totalFees = 0;
    let consecutiveBullishCount = 0;
    let consecutiveBearishCount = 0;
    let positiveTrade = 0;
    let negativeTrade = 0;
    let neutralTrade = 0;

    for (let i = 1; i < candlestickData.length; i++) {
        const previousCandle = candlestickData[i - 1];
        const currentCandle = candlestickData[i];
        const timestamp = moment(currentCandle.timestamp).format('YYYY-MM-DD HH:mm:ss');

        // Additional strategy: Reverse after 5 consecutive bullish candles or bearish candles
        /*if (consecutiveBullishCount === 5 || consecutiveBearishCount === 5) {
            consecutiveBullishCount = 0;
            consecutiveBearishCount = 0;
            continue; // Skip the analysis for this candle
        }*/

        // Simulate "follow last candle" strategy
        let analysis = 'Hold';
        if (previousCandle.close < previousCandle.open) {
            // Previous candle is bearish
            if (currentCandle.close < currentCandle.open) {
                // Current candle is also bearish, profit!
                const profit = currentCandle.open - currentCandle.close;

                const fee = profit * takerFee;
                totalProfit += profit - fee;
                totalFees += fee;
                analysis = 'Sell';
            } else {
                // Current candle is bullish, loss!
                const loss = currentCandle.close - currentCandle.open;
                const fee = currentCandle.open * takerFee;
                totalProfit -= loss + fee;
                totalFees += fee;
                analysis = 'Buy';
                consecutiveBullishCount++;
            }
        } else {
            // Previous candle is bullish
            if (currentCandle.close > currentCandle.open) {
                // Current candle is also bullish, profit!
                const profit = currentCandle.close - currentCandle.open;
                const fee = profit * takerFee;
                totalProfit += profit - fee;
                totalFees += fee;
                analysis = 'Sell';
                consecutiveBullishCount++;
            } else {
                // Current candle is bearish, loss!
                const loss = currentCandle.open - currentCandle.close;
                const fee = currentCandle.open * takerFee;
                totalProfit -= loss + fee;
                totalFees += fee;
                analysis = 'Buy';
                consecutiveBearishCount++;
            }
        }

        console.log(`${timestamp} - Analysis: ${analysis}, Profit: ${totalProfit.toFixed(2)} USDT, Fees: ${totalFees.toFixed(2)} USDT`);
    }
    console.log("Positive trades: " + positiveTrade);
    console.log("Negative trades: " + negativeTrade);
    console.log("Neutral trades: " + neutralTrade);
    return totalProfit;
}

async function main() {
    try {
        const candlestickData = await getCandlestickData(symbol, timeframe, limit);
        const profit = await calculateProfit(candlestickData);

        console.log(`Total profit based on modified strategy: ${profit.toFixed(2)} USDT`);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();