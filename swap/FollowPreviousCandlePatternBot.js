import Binance from 'node-binance-api';
import moment from 'moment';
import crypto from "crypto";
import {NewFuturesOrderParams, USDMClient} from 'binance';

import {XMLHttpRequest} from "xmlhttprequest";



const apiKey = 'Kd1sSCJGB1JLtdBvtsnskwuawa2VMIjhEqNrQxkEXSXDPM4KfB6V2tNk3sPs5cRT';
const apiSecret = '94PsjkTmJn8ZAHBDNzVTDlkFlrJsEPXtgj58aVpUhXL3Gr9KcPe4l0hsrVV3ygyL';

const binance = new Binance().options({
    APIKEY: 'Kd1sSCJGB1JLtdBvtsnskwuawa2VMIjhEqNrQxkEXSXDPM4KfB6V2tNk3sPs5cRT',
    APISECRET: '94PsjkTmJn8ZAHBDNzVTDlkFlrJsEPXtgj58aVpUhXL3Gr9KcPe4l0hsrVV3ygyL',
    useServerTime: true,
    recvWindow: 1000,
    verbose: true,
    test: false,
});

const symbol = 'AVAXUSDT';
const interval = '1m';
const stopLossPercent = 1; // Stop-loss percentage

const client = new USDMClient({
    api_key: apiKey,
    api_secret: apiSecret
})

client.getAccountTrades().then((result) => {
    console.log(result)
}).catch((err)=>{
    console.error(err);
});
client.getExchangeInfo();
var last_order_id = "";

let currentPosition = ''; // Possible values: 'long', 'short'
let entryPrice = 0;
const API_BASE_FUTURE_URL = 'https://fapi.binance.com'; // Base URL for Binance Futures API

async function placeOrder(side, quantity, price) {
    try {
        const orderType = side === 'BUY' ? 'MARKET_BUY' : 'MARKET_SELL';

        if (orderType === 'MARKET_BUY') {

            const dataQueryString = "symbol=" + symbol + "&side=" + side + "&type=LIMIT&timeInForce=GTC&quantity=1&price=" + price + "&recvWindow=20000&timestamp=" + Date.now();
            const end_point = "/fapi/v1/order"
            const signature = crypto.createHmac('sha256', apiSecret).update(dataQueryString).digest('hex');
            const REQUEST_URL = API_BASE_FUTURE_URL + end_point + '?' + dataQueryString + '&signature=' + signature;

            var request = new XMLHttpRequest();

            request.open('POST', REQUEST_URL);
            request.setRequestHeader('X-MBX-APIKEY', apiKey);

            request.onload = function () {
                console.log(request.responseText);
                const response_data = JSON.parse(request.responseText);
                console.log(response_data)
            }
            request.send();
            //const order = await binance.futuresBuy(symbol, quantity, price);
            const order : NewFuturesOrderParams<String> = {

            };
         //TODO: Calculate the
        }
        else if (orderType === 'MARKET_SELL'){
            const dataQueryString = "symbol="+symbol+"&side="+side+"&type=LIMIT&timeInForce=GTC&quantity=1&price="+price+"&recvWindow=20000&timestamp="+Date.now();
            const end_point= "/fapi/v1/order"
            const signature = crypto.createHmac('sha256',apiSecret).update(dataQueryString).digest('hex');
            const REQUEST_URL= API_BASE_FUTURE_URL + end_point + '?' + dataQueryString + '&signature=' + signature;

            var request = new XMLHttpRequest();

            request.open('POST',REQUEST_URL);
            request.setRequestHeader('X-MBX-APIKEY',apiKey);

            request.onload = function(){
                console.log(request.responseText);
            }
            request.send();

            //const order = await binance.futuresSell(symbol, quantity, price);
        }

        console.log(`Order placed: Side - ${side}, Quantity - ${quantity}, Order ID - ${order.orderId}`);
    } catch (error) {
        console.error('Error placing order:', error.body ? error.body.msg : error.message);
    }
}

async function calculateStopLossPrice(entryPrice, stopLossPercent) {
    // Calculate stop-loss price based on the entry price and percentage
    return entryPrice - (entryPrice * stopLossPercent / 100);
}

// Subscribe to the candlestick websocket
binance.websockets.candlesticks(symbol, interval, async (candlesticks) => {
    const { e: eventType, k: newCandle } = candlesticks;

    if (eventType === 'kline' && newCandle.x) {
        const timestamp = moment(newCandle.t).format('YYYY-MM-DD HH:mm:ss');
        console.log(`New Candle - Timestamp: ${timestamp}, Open: ${newCandle.o}, Close: ${newCandle.c}`);

        // Calculate the stop-loss price based on the entry price
        const stopLossPrice = await calculateStopLossPrice(entryPrice, stopLossPercent);
        console.log(`Stop-Loss Price: ${stopLossPrice}`);

        // For simplicity, place a market order on every new candle regardless of the previous condition
        const quantity = 1; // Adjust based on your strategy and capital

        // Place a market order based on the candle's opening
        if (newCandle.c > newCandle.o) {
            // Bullish candle, place a market buy order
            currentPosition = 'long';
            entryPrice = newCandle.o;
            await placeOrder('BUY', quantity, Number.parseFloat(newCandle.c));

            // Set a stop-loss order
            //await placeOrder('SELL', quantity);
        } else if (newCandle.c < newCandle.o) {
            // Bearish candle, place a market sell order (short)
            currentPosition = 'short';
            //entryPrice = newCandle.o;
            await placeOrder('SELL', quantity, Number.parseFloat(newCandle.c));

            // Set a stop-loss order
            //await placeOrder('BUY', quantity);
        }
    }
});
