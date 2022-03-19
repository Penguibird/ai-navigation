import { readFileSync } from "fs";
import type { Node, Road } from "./types/Node";
import distanceBetweenTwoPoints from "./utils/distanceBetweenTwoPoints";
import flip from "./utils/flip";
import { notEmpty } from "./utils/notEmpty";

const roads: Road[] = JSON.parse(readFileSync('./data/roads.json', { encoding: 'utf-8' }));

const startState = flip([56.39631373586291, -3.731760665035462])
const goalState: [number, number] = flip([56.46103099384841, -2.97033770290844])

const closestMapNodeToLocation = (coords: [number, number]) => {
  let d = Infinity;
  let closestNode: Node | null = null;
  for (const road of roads) {
    for (const point of road.geometry.coordinates) {
      const dist = distanceBetweenTwoPoints(point, point);
      if (dist < d) {
        d = dist;
        closestNode = {
          coordinates: point,
          id: point.join(","),
        }
      }
    }
  }
  if (closestNode == null)
    throw new Error("No closest node found")
  return closestNode;
}

function graphSearch(): any | "Failure" {
  let frontier: Node[] = [closestMapNodeToLocation(startState)]
  const explored: string[] = [] //Explored node IDs

  while (frontier.length > 0) {
    // Choose node
    const chosenNode = choosingAlgorithm(frontier);
    // Remove from frontier
    frontier = frontier.filter(node => node.id !== chosenNode.id);
    if (isGoalState(chosenNode))
      return explored;

    console.log(chosenNode.coordinates)
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
const isGoalState = (node: Node): boolean => distanceBetweenTwoPoints(node.coordinates, goalState) < threshold;

const expandNode = (node: Node): Node[] => {
  const stringNodeCoordinates = node.coordinates.join(",");
  const connectingRoads = roads.filter(road => road.geometry.coordinates.some(point => point.join(",") == stringNodeCoordinates))
  console.log(connectingRoads.length, connectingRoads?.[0]?.geometry?.coordinates)

  const nodes = [] as Node[];
  for (const road of connectingRoads) {
    const pointIndex = road.geometry.coordinates.map(c => c.join(",")).indexOf(stringNodeCoordinates);
    const nodeIs = [pointIndex - 1, pointIndex + 1];
    nodeIs.forEach(i => {
      if (i >= 0 && i < road.geometry.coordinates.length) {
        const coordinates = road.geometry.coordinates[i]
        nodes.push({ coordinates, id: coordinates.join(",") })
      }
    })
  }
  console.log(nodes)
  return nodes;
}

graphSearch()

// console.log(distanceBetweenTwoPoints(goalState,startState)/1000)