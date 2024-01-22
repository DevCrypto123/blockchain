const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Change this to the desired port number

app.use(bodyParser.json());

function binanceCloseSellOrder(orderId) {

}

function binancePlaceBuyOrder() {

}

function binanceCloseBuyOrder(orderId) {

}

function binancePlaceSellNewOrder() {

}

// Define a route to handle incoming POST requests
app.post('/webhook', (req, res) => {
    // Log the received data to the console
    console.log('Received POST request from TradingView:');
    console.log(req.body); // Assuming TradingView sends data as JSON

    const TradeViewData = JSON.parse(req.body)
    const SIGNAL = TradeViewData.SIGNAL;

    if (SIGNAL === 'BUY'){
        binanceCloseSellOrder("order_id");
        binancePlaceBuyOrder();
    } else if (SIGNAL=== 'SELL'){
        binanceCloseBuyOrder("order_id");
        binancePlaceSellNewOrder();
    }

    // You can process the data further or trigger actions based on the alert data

    res.status(200).end(); // Send a response to TradingView
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running and listening on port ${port}`);
});