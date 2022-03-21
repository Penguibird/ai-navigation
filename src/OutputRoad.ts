import { RoadProperties } from "./types/Node";

//console.log(tally)
// console.log(roads)
export interface OutputRoad {
  points: [number, number][];
  length: number;
  properties: Partial<RoadProperties>;
  lineString: [number, number][];
}
