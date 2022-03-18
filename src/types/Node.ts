export type nodeId = string 

export interface Node {
  geometry: {
    type: "Point",
    coordinates: [
      number,
      number
    ]
  },
  name?: string
  id: string | `node/${number}`
}

interface RoadProperties  {
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
  gaometry: {
    coordinates: [number,number][]
  }
  properties: Partial<RoadProperties>
  cost: number
  id: string | `way/${number}`
}


