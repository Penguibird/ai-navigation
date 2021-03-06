import { OutputRoad } from "../OutputRoad"

export type nodeId = string 

export interface Node {
  coordinates: [number, number]
  id: string
  // parentNodeId?: string
  parents: Node[]
  roadThatLeadHereIndex?: number
  roadThatLeadHere?: OutputRoad
}

export interface RoadProperties  {
  '@id': string
  highway: string
  lit: string
  maxspeed: string
  name: string
  oneway: string
  ref: string
  surface: string
}
export interface Road {
  geometry: {
    coordinates: [number,number][]
  }
  properties: Partial<RoadProperties>
  cost: number
  id: string | `way/${number}`
}


