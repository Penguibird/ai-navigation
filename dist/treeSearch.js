"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const distanceBetweenTwoPoints_1 = __importDefault(require("./utils/distanceBetweenTwoPoints"));
const flip_1 = __importDefault(require("./utils/flip"));
const roads = JSON.parse((0, fs_1.readFileSync)('./data/roads.json', { encoding: 'utf-8' }));
const nodes = JSON.parse((0, fs_1.readFileSync)('./data/nodes.json', { encoding: 'utf-8' }));
const startState = (0, flip_1.default)([56.39631373586291, -3.731760665035462]);
const goalState = (0, flip_1.default)([56.46103099384841, -2.97033770290844]);
const startNode = (coords) => {
    let d = Infinity;
    let closestNode = null;
    for (const node of nodes) {
        const dist = (0, distanceBetweenTwoPoints_1.default)(node.geometry.coordinates, coords);
        if (dist < d) {
            d = dist;
            closestNode = node;
        }
    }
    if (closestNode == null)
        throw new Error("No closest node found");
    return closestNode;
};
function graphSearch() {
    let frontier = [startNode(startState)];
    const explored = []; //Explored node IDs
    while (frontier.length > 0) {
        // Choose node
        const chosenNode = choosingAlgorithm(frontier);
        // Remove from frontier
        frontier = frontier.filter(node => node.id !== chosenNode.id);
        if (isGoalState(chosenNode))
            return explored;
        console.log(chosenNode.geometry.coordinates);
        explored.push(chosenNode.id);
        frontier = [
            ...expandNode(chosenNode).filter(node => !explored.includes(node.id) && !frontier.some(_node => _node.id == node.id)),
            ...frontier
        ];
    }
    return "Failure";
}
const choosingAlgorithm = (nodes) => nodes[0];
const threshold = 500;
const isGoalState = (node) => (0, distanceBetweenTwoPoints_1.default)(node.geometry.coordinates, goalState) < threshold;
const expandNode = (node) => {
    const stringNodeCoordinates = node.geometry.coordinates.join(",");
    const connectingRoads = roads.filter(road => road.geometry.coordinates.some(point => point.join(",") == stringNodeCoordinates));
    console.log(connectingRoads.length, connectingRoads[0].geometry.coordinates);
    for (const road of connectingRoads) {
        const startPoint = road.geometry.coordinates[0];
        const endPoint = road.geometry.coordinates[1];
    }
    return [node];
};
graphSearch();
// console.log(distanceBetweenTwoPoints(goalState,startState)/1000)
