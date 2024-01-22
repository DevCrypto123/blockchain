import fs from 'fs';

const probitPairsFile = 'probit_pairs.json';
const binancePairsFile = 'binancePairs.json';
const outputPairsFile = 'probit_binance_pairs.json';

// Function to read pairs from a file
function readPairsFromFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading pairs from ${filename}:`, error.message);
        return [];
    }
}

// Function to compare pairs and find mutual pairs
function comparePairs(probitPairs, binancePairs) {
    const mutualPairs = [];

    probitPairs.forEach(probitPair => {
        if (binancePairs.includes(probitPair.split('-').join("")) || binancePairs.includes(probitPair.split("-").reverse().join(""))) {
            mutualPairs.push(probitPair);
        }
    });

    return mutualPairs;
}

// Main function to compare pairs and save mutual pairs to a file
function main() {
    const probitPairs = readPairsFromFile(probitPairsFile);
    const binancePairs = readPairsFromFile(binancePairsFile);

    const mutualPairs = comparePairs(probitPairs, binancePairs);

    fs.writeFile(outputPairsFile, JSON.stringify(mutualPairs), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log(`Mutual trading pairs saved to ${outputPairsFile}`);
        }
    });
}

main();
