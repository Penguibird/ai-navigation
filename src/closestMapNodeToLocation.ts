import { Node } from "./types/Node";
import distanceBetweenTwoPoints from "./utils/distanceBetweenTwoPoints";
import { roads } from ".";



export const closestMapNodeToLocation = (coords: [number, number]) => {
  let d = Infinity;
  let closestNode: Node | null = null;
  for (const road of roads) {
    for (const point of road.points) {
      const dist = distanceBetweenTwoPoints(point, point);
      if (dist < d) {
        d = dist;
        closestNode = {
          parents: [],
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
