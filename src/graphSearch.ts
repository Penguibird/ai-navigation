import { Node } from "./types/Node";
import distanceBetweenTwoPoints from "./utils/distanceBetweenTwoPoints";
import { startState, goalState, roads, mapTable } from ".";
import { closestMapNodeToLocation } from "./closestMapNodeToLocation";
import waterfall from 'async/waterfall';
import { notEmpty } from "./utils/notEmpty";

export async function graphSearch(
  display: (coords: [number, number], color: string) => Promise<any>,
  drawLine: (lineString: [number, number][]) => Promise<void>
): Promise<any | "Failure"> {
  let frontier: Node[] = [closestMapNodeToLocation(startState)];
  const explored: Node[] = []; //Explored node IDs


  while (frontier.length > 0) {
    // Choose node
    const chosenNode = choosingAlgorithm(frontier);
    // Remove from frontier
    frontier = frontier.filter(node => node.id !== chosenNode.id);

    if (isGoalState(chosenNode)) {
      console.log("victory")
      // console.log(expl)
      await display(closestMapNodeToLocation(startState).coordinates, 'blue');
      await display(chosenNode.coordinates, 'red');
      await drawLine(
        [...chosenNode.parents, chosenNode.id]
          .map(id => [explored.find(_ => _.id == id)?.roadThatLeadHereIndex])
          .flat()
          .filter(notEmpty)
          .map(roadI => roads[roadI])
          .filter(notEmpty)
          .map(road => road.lineString)
          .flat()
      );
      for (const point of chosenNode.parents) {
        await display(point.split(",").map(n => parseFloat(n)) as [number, number], 'hotpink');
      }
      return Promise.resolve(explored);
    }

    await display(chosenNode.coordinates, 'yellow');

    explored.push(chosenNode);
    // console.log(chosenNode.parents.length)

    const newFrontier = expandNode(chosenNode)
      .filter(node => explored.every(_n => _n.id !== node.id) && frontier.every(_node => _node.id !== node.id));
    // console.log(newFrontier)
    if (newFrontier.length == 0)
      console.log("AAA")
    frontier = [
      ...newFrontier,
      ...frontier
    ];

  }

  console.log("Failure")
  return Promise.resolve("Failure");
}

const choosingAlgorithm = (nodes: Node[]) => ({ ...(nodes[nodes.length - 1]) });

const threshold = 500;

const isGoalState = (node: Node): boolean => distanceBetweenTwoPoints(node.coordinates, goalState) < threshold;

const expandNode = (node: Node): Node[] => {
  const stringNodeCoordinates = node.coordinates.join(",");
  const nodes = [] as Node[];
  const ids = mapTable[stringNodeCoordinates] as number[];

  const finalNodes = [] as Node[];
  for (const index of ids) {
    const roadContainingNode = roads[index];

    const points = roadContainingNode.points;
    finalNodes.push(...points.map(coordinates => ({
      coordinates,
      id: coordinates.join(","),
      parents: [...node.parents, node.id],
      roadThatLeadHereIndex: index,
    })));
  }
  // console.log(ids, finalNodes)

  return finalNodes;
};
