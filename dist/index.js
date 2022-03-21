"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const roads = JSON.parse((0, fs_1.readFileSync)('./data/roads.json', { encoding: 'utf-8' }));
const nodes = JSON.parse((0, fs_1.readFileSync)('./data/nodes.json', { encoding: 'utf-8' }));
function graphSearch() {
    let frontier = [];
    const explored = []; //Explored node IDs
    while (frontier.length > 0) {
        // Choose node
        const chosenNode = choosingAlgorithm(frontier);
        // Remove from frontier
        frontier = frontier.filter(node => node.id !== chosenNode.id);
        if (isGoalState(chosenNode))
            return explored;
        else {
            frontier = [
                ...expandNode(chosenNode),
                ...frontier
            ];
        }
    }
    return "Failure";
}
const choosingAlgorithm = (nodes) => nodes[0];
const isGoalState = (node) => false;
const expandNode = (node) => {
    const stringNodeCoordinates = node.geometry.coordinates.join(",");
    const connectingRoads = roads.filter(road => road.geometry.coordinates.some(point => point.join(",") == stringNodeCoordinates));
    // Dirty list of all points in all the roads
    const n = nodes.filter(node => connectingRoads.find(road => road.geometry.coordinates.map(c => c.join(","))));
    return n;
};
console.log(nodes.length, expandNode(nodes[0]).length);
