import { readFileSync, writeFileSync } from "fs";
import { OutputRoad } from "./OutputRoad";
export const roads: OutputRoad[] = JSON.parse(readFileSync('./data/unifiedRoadsScotland.json', { encoding: 'utf-8' }));

const lookupTable = {} as Record<string, number[]>

for (let i = 0; i < roads.length; i++) {
  console.log(i)
  const road = roads[i];
  for (const point of road.points) {
    if (!lookupTable[point.join(",")])
      lookupTable[point.join(",")] = [i]
    else if (!lookupTable[point.join(",")].includes(i))
      lookupTable[point.join(",")].push(i)
  }
}
console.log(Object.entries(lookupTable).length, roads.length)
writeFileSync("./data/mapTableScotland.json", JSON.stringify(lookupTable))