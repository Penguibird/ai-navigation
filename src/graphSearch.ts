import { Node } from "./types/Node";
import distanceBetweenTwoPoints from "./utils/distanceBetweenTwoPoints";
import { startState, goalState, roads, mapTable } from ".";
import { closestMapNodeToLocation } from "./closestMapNodeToLocation";

export async function graphSearch(display: (coords: [number, number]) => Promise<any>): Promise<any | "Failure"> {
  let frontier: Node[] = [closestMapNodeToLocation(startState)];
  const explored: string[] = []; //Explored node IDs

  while (frontier.length > 0) {
    // Choose node
    const chosenNode = choosingAlgorithm(frontier);
    // Remove from frontier
    frontier = frontier.filter(node => node.id !== chosenNode.id);
    if (isGoalState(chosenNode)) {
      console.log("victory")
      // console.log(expl)
      return Promise.resolve(explored);
    }

    await display(chosenNode.coordinates);
    explored.push(chosenNode.id);

    frontier = [
      ...expandNode(chosenNode).filter(node => !explored.includes(node.id) && !frontier.some(_node => _node.id == node.id)),
      ...frontier
    ];

  }

  return Promise.resolve("Failure");
}

const choosingAlgorithm = (nodes: Node[]) => nodes[0];

const threshold = 500;

const isGoalState = (node: Node): boolean => distanceBetweenTwoPoints(node.coordinates, goalState) < threshold;

const expandNode = (node: Node): Node[] => {
  const stringNodeCoordinates = node.coordinates.join(",");
  const nodes = [] as Node[];
  const ids = mapTable[stringNodeCoordinates] as number[];
  const roadsContainingNode = ids.map(i => roads[i])
  return roadsContainingNode
    .map(road => road.points)
    .flat()
    .map(coordinates => ({
      coordinates,
      id: coordinates.join(",")
    }));
};
