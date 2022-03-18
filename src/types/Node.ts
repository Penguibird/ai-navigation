type nodeId = string | number

export interface Node {
  gpsLat: number
  gpsLong: number
  name?: string
  id: nodeId
}

export interface Path {
  nodes: [nodeId, nodeId]
  cost: number
}