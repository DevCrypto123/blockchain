// Calculate the shortest path to each trading pair node in the graph using Dijkstra's algorithm.
function getShortestPath(graph, sourceTradingPair) {
    // Create a visited set to track which nodes have already been visited.
    const visited = new Set();

    // Create a distance map to store the distance to each node from the source node.
    const distanceMap = {};

    // Initialize the distance to the source node to 0.
    distanceMap[sourceTradingPair.baseToken + "/" + sourceTradingPair.quoteToken] = 0;

    // Create a priority queue to store the nodes that need to be visited.
    const priorityQueue = new PriorityQueue();

    priorityQueue.enqueue(sourceTradingPair, 0);

    while (!priorityQueue.isEmpty()) {
        // Get the node with the shortest distance from the priority queue.
        const currentTradingPair = priorityQueue.dequeue();

        // If the current node has already been visited, skip it.
        if (visited.has(currentTradingPair.baseToken + "/" + currentTradingPair.quoteToken)) {
            continue;
        }

        // Mark the current node as visited.
        visited.add(currentTradingPair.baseToken + "/" + currentTradingPair.quoteToken);

        // Iterate over the neighbors of the current node.
        currentTradingPair.quoteTokenPairs.forEach(quoteTokenPair => {
            // Calculate the distance to the neighbor node.
            const neighborDistance = distanceMap[currentTradingPair.baseToken + "/" + currentTradingPair.quoteToken] + 1;

            // If the neighbor node has not been visited or the distance to the neighbor node is greater than the calculated distance, update the distance map.
            if (!visited.has(quoteTokenPair.baseToken + "/" + quoteTokenPair.quoteToken) || neighborDistance < distanceMap[quoteTokenPair.baseToken + "/" + quoteTokenPair.quoteToken]) {
                distanceMap[quoteTokenPair.baseToken + "/" + quoteTokenPair.quoteToken] = neighborDistance;

                // Update the priority queue to include the neighbor node.
                priorityQueue.enqueue(quoteTokenPair, neighborDistance);
            }
        });
    }

    // Return the distance map.
    return distanceMap;
}