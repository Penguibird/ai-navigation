import { readFileSync } from "fs";
import type { Node, Road } from "./types/Node";

const roads: Road[] = JSON.parse(readFileSync('./data/roads.json', {encoding: 'utf-8'}));
const nodes: Node[] = JSON.parse(readFileSync('./data/nocdes.json', {encoding: 'utf-8'}));

function graphSearch(): any | "Failure" {
  const frontier: Node[] = []
  const explored: string[] = [] //Explored node IDs

  while(frontier.length > 0) {
    
  }

  return "Failure"
}

console.log("Hello World");