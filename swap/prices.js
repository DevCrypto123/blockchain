const vis = require('vis');
const puppeteer = require('puppeteer');
const crypto = require('crypto'); // To generate unique IDs
const cytoscape = require('cytoscape');
const { writeFile } = require('fs');

class TradingPair {
    constructor(base, quote) {
        this.base = base;
        this.quote = quote;
        this.additionalData = {};
        this.connections = [];
    }

    toString() {
        return `${this.base}/${this.quote}`;
    }
}

class Graph {
    constructor() {
        this.nodes = [];
    }

    addTradingPair(tradingPair) {
        this.nodes.push(tradingPair);
    }

    connectTradingPairs() {
        for (const pair1 of this.nodes) {
            for (const pair2 of this.nodes) {
                if (pair1 !== pair2 && pair1.quote === pair2.base) {
                    // Filter and remove duplicates from pair1.connections
                    pair1.connections = pair1.connections.filter((connection) => connection !== pair2);

                    // Add pair2 to pair1.connections
                    pair1.connections.push(pair2);
                }
            }
        }
    }

    visualizeGraph() {
        const cy = cytoscape();

        // Add nodes
        for (const pair of this.nodes) {
            cy.add({ data: { id: pair.toString() } });
        }

        // Add edges
        for (const pair of this.nodes) {
            for (const connection of pair.connections) {
                cy.add({ data: { id: `${pair.toString()}-${connection.toString()+Math.random()}`, source: pair.toString(), target: connection.toString() } });
            }
        }

        // Style the graph (optional)
        cy.style([
            {
                selector: 'node',
                style: {
                    'background-color': '#3498db',
                    label: 'data(id)',
                },
            },
            {
                selector: 'edge',
                style: {
                    'line-color': '#95a5a6',
                },
            },
        ]);

        // Generate a PNG image of the graph
        const pngData = cy.png();

        // Save the image to a file
        writeFile('trading_pairs_graph.png', pngData, 'base64', (err) => {
            if (err) throw err;
            console.log('Trading pairs graph visualization saved as trading_pairs_graph.png');
        });
    }

    /*async visualizeGraph() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const nodes = new vis.DataSet(this.nodes.map(pair => ({
            id: this.generateUniqueId(pair), // Generate a unique ID for each node
            label: `${pair.base}/${pair.quote}`,
        })));

        const edges = new vis.DataSet(this.getAllEdges());

        const data = { nodes, edges };
        const options = {};

        const html = `
      <html>
        <head>
          <script src="node_modules/vis/dist/vis.js"></script>
          <link rel="stylesheet" type="text/css" href="node_modules/vis/dist/vis.css">
        </head>
        <body>
          <div id="graph-container"></div>
        </body>
        <script>
          var nodes = new vis.DataSet(${JSON.stringify(nodes.get())});
          var edges = new vis.DataSet(${JSON.stringify(edges.get())});
          var container = document.getElementById("graph-container");
          var data = { nodes, edges };
          var options = ${JSON.stringify(options)};
          var network = new vis.Network(container, data, options);
        </script>
      </html>
    `;

        await page.setContent(html);
        await page.screenshot({ path: 'graph.png' });
        page.content();
        await browser.close();
    }*/

    generateUniqueId(pair) {
        const uniqueId = crypto.createHash('md5').update(pair.toString()).digest('hex');
        return uniqueId;
    }

    getAllEdges() {
        const edges = [];
        for (const pair of this.nodes) {
            for (const connection of pair.connections) {
                edges.push({ from: pair.toString(), to: connection.toString() });
            }
        }
        return edges;
    }

    getMinDistancePair(distances, visitedPairs) {
        let minDistance = Infinity;
        let minPair = null;

        for (const pair of this.nodes) {
            if (!visitedPairs.has(pair) && distances[pair] < minDistance) {
                minDistance = distances[pair];
                minPair = pair;
            }
        }

        return minPair;
    }


    findShortestPath(endPair, previousPairs) {
        const path = [];
        let currentPair = endPair;

        while (currentPair !== null) {
            path.unshift(currentPair);
            currentPair = previousPairs[currentPair];
        }

        return path;
    }
    visualizeNodesInConsole() {
        console.log('Graph Nodes:');
        for (const pair of this.nodes) {
            console.log(`${pair.toString()} is connected to:`);
            for (const connection of pair.connections) {
                console.log(`  ${connection.toString()}`);
            }
        }
    }
    toJSON() {
        return {
            nodes: this.nodes.map((pair) => ({
                name: pair.name,
                connections: pair.connections.map((connection) => connection.name),
            })),
        };
    }
}
function logConnections(graph) {
    for (const pair of graph.nodes) {
        console.log(`${pair.base}/${pair.quote} Connections:`);
        for (const connection of pair.connections) {
            console.log(`  ${connection.base}/${connection.quote}`);
        }
        console.log('---');
    }
}

const graph = new Graph();

const btcEth = new TradingPair('BTC', 'ETH');
const ethUsdt = new TradingPair('ETH', 'USDT');
const ethSol = new TradingPair('ETH', 'SOL');
const usdtBtc = new TradingPair('USDT', 'BTC');
const solBtc = new TradingPair('SOL', 'BTC');
const solEth = new TradingPair('SOL', 'ETH');

graph.addTradingPair(btcEth);
graph.addTradingPair(ethUsdt);
graph.addTradingPair(ethSol);
graph.addTradingPair(usdtBtc);
graph.addTradingPair(solBtc);
graph.addTradingPair(solEth);

graph.connectTradingPairs(btcEth, ethUsdt);
graph.connectTradingPairs(ethUsdt, ethSol);
graph.connectTradingPairs(ethUsdt, usdtBtc);
graph.connectTradingPairs(ethSol, solBtc);
graph.connectTradingPairs(solBtc, solEth);

console.log(btcEth.connections); // Should output [ethUsdt]
console.log(ethUsdt.connections); // Should output [btcEth, ethSol, usdtBtc]
//const shortestPath = graph.findShortestPath(btcEth, usdtBtc);
//console.log('Shortest Path:', shortestPath.map(pair => `${pair.base}/${pair.quote}`).join(' -> '));

// After connecting the trading pairs
/*graph.visualizeGraph().then(() => {
    console.log('Graph visualization complete.');
});*/

//graph.visualizeGraph();

const fs = require('fs');

// Read the JSON file
fs.readFile('_pairs.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }

    try {
        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Access the pairs array
        const pairs = jsonData.data.pairs;

        // Add each pair's name to the graph
        for (const pair of pairs) {
            let pairs=[];
            pairs=pair.name.split("/");
            // Assuming 'graph' is an instance of your existing Graph class
            const tradingPair = new TradingPair(pairs[0], pairs[1]);
            graph.addTradingPair(tradingPair);
        }
        graph.connectTradingPairs();
        logConnections(graph);
        // Visualize the updated graph (assuming you have a visualizeGraph() method)
        //graph.visualizeGraph();
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
    }
})
//graph.visualizeNodesInConsole()
//logConnections(graph);
// Create and configure your graph
const graph1 = new Graph();
// Add trading pairs and connect them here

// Connect trading pairs
graph.connectTradingPairs();

// Export the graph to JSON
const graphData = graph1.toJSON();

// Output the JSON data to console
console.log(JSON.stringify(graphData, null, 2));