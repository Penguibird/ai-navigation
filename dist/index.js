"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const distanceBetweenTwoPoints_1 = __importDefault(require("./utils/distanceBetweenTwoPoints"));
const flip_1 = __importDefault(require("./utils/flip"));
const roads = JSON.parse((0, fs_1.readFileSync)('./data/roads.json', { encoding: 'utf-8' }));
const startState = (0, flip_1.default)([56.39631373586291, -3.731760665035462]);
const goalState = (0, flip_1.default)([56.46103099384841, -2.97033770290844]);
const closestMapNodeToLocation = (coords) => {
    let d = Infinity;
    let closestNode = null;
    for (const road of roads) {
        for (const point of road.geometry.coordinates) {
            const dist = (0, distanceBetweenTwoPoints_1.default)(point, point);
            if (dist < d) {
                d = dist;
                closestNode = {
                    coordinates: point,
                    id: point.join(","),
                };
            }
        }
    }
    if (closestNode == null)
        throw new Error("No closest node found");
    return closestNode;
};
function graphSearch() {
    let frontier = [closestMapNodeToLocation(startState)];
    const explored = []; //Explored node IDs
    while (frontier.length > 0) {
        // Choose node
        const chosenNode = choosingAlgorithm(frontier);
        // Remove from frontier
        frontier = frontier.filter(node => node.id !== chosenNode.id);
        if (isGoalState(chosenNode))
            return explored;
        console.log(chosenNode.coordinates);
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
const isGoalState = (node) => (0, distanceBetweenTwoPoints_1.default)(node.coordinates, goalState) < threshold;
const expandNode = (node) => {
    var _a, _b;
    const stringNodeCoordinates = node.coordinates.join(",");
    const connectingRoads = roads.filter(road => road.geometry.coordinates.some(point => point.join(",") == stringNodeCoordinates));
    console.log(connectingRoads.length, (_b = (_a = connectingRoads === null || connectingRoads === void 0 ? void 0 : connectingRoads[0]) === null || _a === void 0 ? void 0 : _a.geometry) === null || _b === void 0 ? void 0 : _b.coordinates);
    const nodes = [];
    for (const road of connectingRoads) {
        const pointIndex = road.geometry.coordinates.map(c => c.join(",")).indexOf(stringNodeCoordinates);
        const nodeIs = [pointIndex - 1, pointIndex + 1];
        nodeIs.forEach(i => {
            if (i >= 0 && i < road.geometry.coordinates.length) {
                const coordinates = road.geometry.coordinates[i];
                nodes.push({ coordinates, id: coordinates.join(",") });
            }
        });
    }
    console.log(nodes);
    return nodes;
};
graphSearch();
// console.log(distanceBetweenTwoPoints(goalState,startState)/1000)
