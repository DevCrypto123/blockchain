const express = require('express');
const axios = require('axios');
const crypto = require("crypto");
//const TelegramBot = require('node-telegram-bot-api');
const {XMLHttpRequest} = require("xmlhttprequest");


// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const TELEGRAM_TOKEN = 'AAGmzBLTPtIv7tI5mDnOOLEsu7P7If0FohU';

const API_BASE_FUTURE_URL = 'https://fapi.binance.com'; // Base URL for Binance Futures API
const API_TESTNET_FUTURE_URL = 'https://testnet.binancefuture.com';

const API_KEY = 'Kd1sSCJGB1JLtdBvtsnskwuawa2VMIjhEqNrQxkEXSXDPM4KfB6V2tNk3sPs5cRT'; // Replace with your Binance API Key
const API_SECRET = '94PsjkTmJn8ZAHBDNzVTDlkFlrJsEPXtgj58aVpUhXL3Gr9KcPe4l0hsrVV3ygyL'; // Replace with your Binance API Secret

const API_KEY_TESTNET = '3a7017740da1940ba604d1e44ec13b28f03f1cad1483f78ad4fc7fe56ae0bc1c'; // Replace with your Binance API Key
const API_SECRET_TESTNET = '481555d62b1461f73772cd4aeb30f64c47a34d30238af69f526a2598ca5622e5'; // Replace with your Binance API Secret

const TICKER_END_POINT = 'https://fapi.binance.com/fapi/v1/ticker/price?symbol='
const SYMBOL = 'ETHUSDT';
const end_point= "/fapi/v1/order/test"

const app = express();
const port = 80; // You can choose a different port
app.use(express.json());

const server = require('http').createServer((req,res)=>res.end()).listen(3000)
// Create a new instance of the Telegram bot
//const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Listen for POST requests
app.post('/processOrder', async (req, res) => {
    try {

        console.log(req.body);
        // Extract the necessary data from the POST request
        const { pair, orderDetails } = req.body;

        // 1. Make an Axios request to get the ticker price from Binance
        const tickerResponse = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`);

        const tickerPrice = Math.round(tickerResponse.data.price,1);
        const dataQueryString = "symbol="+pair+"&side=BUY&type=LIMIT&timeInForce=GTC&quantity=101&price="+tickerPrice+"&recvWindow=20000&timestamp="+Date.now();
        const signature = crypto.createHmac('sha256',API_SECRET_TESTNET).update(dataQueryString).digest('hex');
        const REQUEST_URL= API_TESTNET_FUTURE_URL + end_point + '?' + dataQueryString + '&signature=' + signature;

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
        var request = new XMLHttpRequest();

        request.open('POST',REQUEST_URL);
        request.setRequestHeader('X-MBX-APIKEY',API_KEY_TESTNET);

        request.onload = function(){
            console.log(request.responseText);
        }

        request.send();

        // If everything is okay, respond with a "200 OK" status
        res.status(200).send('Order processed successfully');

        // 2. Make another POST request to Binance to create an order
        /*const orderResponse = await axios.post(REQUEST_URL, orderParams, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-MBX-APIKEY': API_KEY_TESTNET,
            },
            data: dataQueryString, // Use dataQueryString as the request body
        });

        res.json(orderResponse.data);
        console.log(res.json(orderResponse.data));*/

        // Example: Send a message to a specific chat ID
        const chatId = '6943900453'; // Replace with your chat ID
        const messageToSend = 'Hello from your Node.js app!';

        // Call the function to send the message
        //sendTelegramMessage(chatId, messageToSend);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the order.' });
    }
});

app.listen(port, "::",() => {
    console.log(`Server is running on port ${port}`);
});


function sendTelegramMessage(chatId, message) {
    bot.sendMessage(chatId, message)
        .then(() => {
            console.log(`Message sent to chat ID ${chatId}: ${message}`);
        })
        .catch((error) => {
            console.error(`Error sending message: ${error.message}`);
        });
}
