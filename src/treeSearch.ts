import { readFileSync } from "fs";
import type { Node, Road } from "./types/Node";
import distanceBetweenTwoPoints from "./utils/distanceBetweenTwoPoints";
import flip from "./utils/flip";
import { notEmpty } from "./utils/notEmpty";

const roads: Road[] = JSON.parse(readFileSync('./data/roads.json', { encoding: 'utf-8' }));
const nodes: Node[] = JSON.parse(readFileSync('./data/nodes.json', { encoding: 'utf-8' }));

const startState = flip([56.39631373586291, -3.731760665035462])
const goalState: [number, number] = flip([56.46103099384841, -2.97033770290844])

const startNode = (coords: [number, number]) => {
  let d = Infinity;
  let closestNode: Node | null = null;
  for (const node of nodes) {
    const dist = distanceBetweenTwoPoints(node.geometry.coordinates, coords);
    if (dist < d) {
      d = dist;
      closestNode = node
    }
  }
  if (closestNode == null)
    throw new Error("No closest node found")
  return closestNode;
}

function graphSearch(): any | "Failure" {
  let frontier: Node[] = [startNode(startState)]
  const explored: string[] = [] //Explored node IDs

  while (frontier.length > 0) {
    // Choose node
    const chosenNode = choosingAlgorithm(frontier);
    // Remove from frontier
    frontier = frontier.filter(node => node.id !== chosenNode.id);
    if (isGoalState(chosenNode))
      return explored;

    console.log(chosenNode.geometry.coordinates)
    explored.push(chosenNode.id);

    frontier = [
      ...expandNode(chosenNode).filter(node => !explored.includes(node.id) && !frontier.some(_node => _node.id == node.id)),
      ...frontier
    ]

  }

  return "Failure"
}

const choosingAlgorithm = (nodes: Node[]) => nodes[0]

const threshold = 500;
const isGoalState = (node: Node): boolean => distanceBetweenTwoPoints(node.geometry.coordinates, goalState) < threshold;

const expandNode = (node: Node): Node[] => {
  const stringNodeCoordinates = node.geometry.coordinates.join(",");
  const connectingRoads = roads.filter(road => road.geometry.coordinates.some(point => point.join(",") == stringNodeCoordinates))
  console.log(connectingRoads.length, connectingRoads[0].geometry.coordinates)

  for ( const road of connectingRoads) {
    const startPoint = road.geometry.coordinates[0]
    const endPoint = road.geometry.coordinates[1]
    
  }

  return [node];
}

graphSearch()

// console.log(distanceBetweenTwoPoints(goalState,startState)/1000)