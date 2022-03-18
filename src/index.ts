import { Node, Path } from "./types/Node";

const nodes: Node[] = [
  {
    gpsLat: 56.49782162266081,
    gpsLong: -2.9634000225910326,
    name: 'Dundee',
    id: 1
  },
  {
    gpsLat: 56.5307808839753,
    gpsLong: -2.9870892917129077,
    id: 2,
    name: 'Next to Dundee'
  },
  {
    gpsLat: 56.392951527110114, 
    gpsLong: -3.2105186179313545,
    id: 3,
    name: 'Errol',
  }
]

const paths: Path[] = [
  {
    cost: 5,
    nodes: [1, 2],
  },
  { 
    cost: 10,
    nodes: [2,3]
  },
  {
    cost: 15,
    nodes: [2, 3]
  },
  {
    cost: 10,
    nodes: [1, 3]
  },
]

console.log("Hello World");