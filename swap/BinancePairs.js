import axios from 'axios'
import fs from 'fs'

const binancePairsFile = 'binancePairs.json';

// Function to fetch Binance trading pairs
async function getBinancePairs() {
    try {
        const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
        const pairs = response.data.symbols.map(pair => pair.symbol);
        return pairs;
    } catch (error) {
        console.error('Error fetching Binance pairs:', error.message);
        return [];
    }
}

// Main function to fetch pairs and save them to a file
async function main() {
    const binancePairs = await getBinancePairs();

    fs.writeFile(binancePairsFile, JSON.stringify(binancePairs), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log(`Binance trading pairs saved to ${binancePairsFile}`);
        }
    });
}

main();
