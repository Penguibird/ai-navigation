import { readFileSync } from "fs";
import type { Node, Road } from "./types/Node";

const roads: Road[] = JSON.parse(readFileSync('./data/roads.json', {encoding: 'utf-8'}));
const nodes: Node[] = JSON.parse(readFileSync('./data/nodes.json', {encoding: 'utf-8'}));



function graphSearch(): any | "Failure" {
  let frontier: Node[] = []
  const explored: string[] = [] //Explored node IDs

  while(frontier.length > 0) {
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
      ]
    }
  }

  return "Failure"
}

const choosingAlgorithm = (nodes: Node[]) => nodes[0]

const isGoalState = (node: Node): boolean => false;

const expandNode = (node: Node): Node[] => {
  const stringNodeCoordinates = node.geometry.coordinates.join(",");
  const connectingRoads = roads.filter(road => road.geometry.coordinates.some(point => point.join(",") == stringNodeCoordinates)) 
  
  // Dirty list of all points in all the roads
  const n = nodes.filter(node => connectingRoads.find(road => road.geometry.coordinates.map(c => c.join(","))))
  return n;
} 



console.log(nodes.length, expandNode(nodes[0]).length);
