import fs from 'fs';
import websocket from 'websocket';
import axios from 'axios';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

// Utility function to create a WebSocket connection
function createWebSocketConnection(tradingPair) {
    const ws = new websocket.w3cwebsocket('wss://api.probit.com/api/exchange/v1/ws');

    ws.onopen = () => {
        const msg = {
            type: 'subscribe',
            channel: 'marketdata',
            interval: 100,
            market_id: tradingPair,
            filter: ['ticker', 'order_books'],
        };
        ws.send(JSON.stringify(msg));
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const sell_book = data.order_books.filter((item) => item.side === 'sell').sort((a, b) => b.price - a.price);
        const buy_book = data.order_books.filter((item) => item.side === 'buy').sort((a, b) => a.price - b.price);
        let last_price = 0;

        if (data.ticker !== undefined){
            last_price = data.ticker.last!==undefined?data.ticker.last:null;
            console.log(`Live data for ${tradingPair}: ${last_price}`);
        }


    };
}

if (isMainThread) {
    const filePath = 'probit_binance_pairs.json';
    const tradingPairs = {};

    axios
        .get('https://api.probit.com/api/exchange/v1/market', {
            headers: { accept: 'application/json' },
        })
        .then(function (response) {
            const mutalPairs = readPairsFromFile(filePath);
            const probitPairsData = response.data.data;
            const filteredPairs = probitPairsData.filter((pair) => mutalPairs.includes(pair.id));

            filteredPairs.forEach((pairData) => {
                const tradingPair = pairData.id;
                tradingPairs[tradingPair] = {
                    ticker: {},
                    order_books: {},
                };
                createWebSocketConnection(tradingPair); // Create WebSocket connection for each pair
            });
        })
        .catch(function (error) {
            console.error(error);
        });
}

function readPairsFromFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading pairs from ${filename}:`, error.message);
        return [];
    }
}
