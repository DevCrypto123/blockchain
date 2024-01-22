//import axios from 'axios'
const WebSocket = require('websocket');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var crypto = require("crypto");
var axios = require("axios");
const websocket = require("websocket");


const API_BASE_FUTURE_URL = 'https://fapi.binance.com'; // Base URL for Binance Futures API
const API_TESTNET_FUTURE_URL = 'https://testnet.binancefuture.com';

const API_KEY = 'Kd1sSCJGB1JLtdBvtsnskwuawa2VMIjhEqNrQxkEXSXDPM4KfB6V2tNk3sPs5cRT'; // Replace with your Binance API Key
const API_SECRET = '94PsjkTmJn8ZAHBDNzVTDlkFlrJsEPXtgj58aVpUhXL3Gr9KcPe4l0hsrVV3ygyL'; // Replace with your Binance API Secret

const API_KEY_TESTNET = '3a7017740da1940ba604d1e44ec13b28f03f1cad1483f78ad4fc7fe56ae0bc1c'; // Replace with your Binance API Key
const API_SECRET_TESTNET = '481555d62b1461f73772cd4aeb30f64c47a34d30238af69f526a2598ca5622e5'; // Replace with your Binance API Secret

const TICKER_END_POINT = 'https://fapi.binance.com/fapi/v1/ticker/price?symbol='
const SYMBOL = 'ETHUSDT'; // Trading pair
const PRICE=0;
getSymbolTickerPrice(SYMBOL);
const TICKER_END_POINT_URL = TICKER_END_POINT + SYMBOL
//getCurrentPriceForSymbol(SYMBOL);
console.log(PRICE)
function getCurrentPriceForSymbol(SYMBOL) {
    const ws = new WebSocket.w3cwebsocket('wss://stream.binance.com:9443/ws/ethusdt@trade');
    console.log("WebSocket Connection Oppened for: ",SYMBOL)
    ws.onmessage = (event) => {
        //const data = JSON.parse(event.data);
        //console.log(JSON.parse(event.data).p)
        PRICE= JSON.parse(event.data).p;
    };
}


const dataQueryString = "symbol="+SYMBOL+"&side=BUY&type=LIMIT&timeInForce=GTC&quantity=100&price="+PRICE+"&recvWindow=20000&timestamp="+Date.now();
const end_point= "/fapi/v1/order/test"
const signature = crypto.createHmac('sha256',API_SECRET_TESTNET).update(dataQueryString).digest('hex');
const REQUEST_URL= API_TESTNET_FUTURE_URL + end_point + '?' + dataQueryString + '&signature=' + signature;

var request = new XMLHttpRequest();

request.open('POST',REQUEST_URL);
request.setRequestHeader('X-MBX-APIKEY',API_KEY_TESTNET);

request.onload = function(){
    console.log(request.responseText);
}

request.send();

async function placeTestOrder() {
    try {
        const orderParams = {
            symbol: SYMBOL,
            side: 'BUY',
            type: 'LIMIT',
            timeInForce: 'GTC', // Good Till Cancelled
            quantity: 0.001, // Amount of BTC to buy
            price: 1990.53, // Price at which to buy
            recvWindow: 20000,
            timeStamp: Date.now()
        };

        const response = await axios.post(`${API_TESTNET_FUTURE_URL}`+'/fapi/v1/order/test', orderParams, {
            headers: {
                "Content-Type": "application/json",
                "X-MBX-APIKEY": API_KEY_TESTNET, // Set the header without brackets
            },
        });

        console.log('Test order response:', response.data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

placeTestOrder();

/*console.info(`Price of BNB: ${ticker.BNBUSDT}`);

// Periods: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
binance.websockets.depth(['BNBBTC'], (depth) => {
    let {e:eventType, E:eventTime, s:symbol, u:updateId, b:bidDepth, a:askDepth} = depth;
    console.clear();
    console.info(symbol+" market depth update");
    console.info(bidDepth, askDepth);
});*/

let BINANCE_TRADING_PAIRS = [];
async function retrieveTradingPairs() {
    try {
        const response = await axios.get(`${API_BASE_FUTURE_URL}/fapi/v1/exchangeInfo`);

        if (response.data && response.data.symbols) {
            BINANCE_TRADING_PAIRS = response.data.symbols.map((symbol) => symbol.symbol);
            console.log('Available trading pairs on Binance Futures:');
            tradingPairs.forEach((pair) => console.log(pair));
        } else {
            console.error('Failed to retrieve trading pairs.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}
async function retrieveTradingPairs() {
    try {
        const response = await axios.get(`${API_BASE_FUTURE_URL}/fapi/v1/exchangeInfo`);

        if (response.data && response.data.symbols) {
            BINANCE_TRADING_PAIRS = response.data.symbols.map((symbol) => symbol.symbol);
            console.log('Available trading pairs on Binance Futures:');
            tradingPairs.forEach((pair) => console.log(pair));
        } else {
            console.error('Failed to retrieve trading pairs.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

retrieveTradingPairs();

async function getSymbolTickerPrice(symbol) {
    try {
        const response = await axios.get(`${TICKER_END_POINT}`+`${symbol}`);

        if (response.status === 200) {
            const { symbol, price } = response.data;
            console.log(`Symbol: ${symbol}, Ticker Price: ${price}`);
            return Number.parseFloat(price);
        } else {
            console.error(`Failed to fetch ticker price for symbol ${symbol}`);
        }
    } catch (error) {
        console.error(`Error fetching ticker price: ${error.message}`);
    }
}
