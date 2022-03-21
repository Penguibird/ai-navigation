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
      const points = [...chosenNode.parents.map(id => explored.find(_ => _.id == id)).flat(), chosenNode]
      .filter(notEmpty)
      for (const point of points) {
        await drawLine(point.roadThatLeadHere?.lineString ?? [])
        await display(point.coordinates, 'hotpink')
      }
      

      return Promise.resolve(explored);
    }

    // await display(chosenNode.coordinates, 'yellow');

    explored.push(chosenNode);
    // console.log(chosenNode.parents.length)
    await (drawLine(chosenNode.roadThatLeadHere?.lineString ?? []))

    const newFrontier = expandNode(chosenNode)
      .filter(node => explored.every(_n => _n.id !== node.id) && frontier.every(_node => _node.id !== node.id));
    // console.log(newFrontier)

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
  // const ids = mapTable[stringNodeCoordinates] as number[];

  const roadsContainingNode = mapTable[stringNodeCoordinates].map(id => roads[id])
  // const roadsContainingNode = 
  // roads.filter(road => road.points.map(c => c.join(',')).includes(stringNodeCoordinates))

  const finalNodes = [] as Node[];
  for (const road of roadsContainingNode) {

    const points = road.points;
    finalNodes.push(...points.map(coordinates => ({
      coordinates,
      id: coordinates.join(","),
      parents: [...node.parents, node.id],
      roadThatLeadHere: road,
    })));
  }
  // console.log(node.coordinates, roadsContainingNode.map(r => r.points), finalNodes.map(n => n.coordinates))

  return finalNodes;
};
