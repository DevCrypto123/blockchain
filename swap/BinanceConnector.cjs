const { Futures } = require('@binance/connector')

const apiKey = "3kxHGmQykN2Fea021I61pZH2of99FmM0JOMqckLBWP5K7y53kIhb5e8Zoj44iUeFI";
const apiSecret = "KIprhPFCYLyLm4m3dmljNf6jZ3BKWBKrim1FnIey4WTj27cHR52rf4M2doiyeWBy"; // has no effect when RSA private key is provided
//56TaIlmpJhdEn6tfK4PMXGSKDpI3S1rgZMF4N7oYtldUMtHgctt5ZWLnFB6MJ2au
// load private key
const privateKeyPassphrase = "Testnet";

const client = new Spot(apiKey, apiSecret)
const futurres = new Futures(apiKey,apiSecret)

client.account
// Get account information
client.account().then(response => client.logger.log(response.data))

// Place a new order
client.newOrder('BNBUSDT', 'BUY', 'LIMIT', {
    price: '350',
    quantity: 1,
    timeInForce: 'GTC'
}).then(response => client.logger.log(response.data))
    .catch(error => client.logger.error(error))
