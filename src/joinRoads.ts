import { readFileSync, writeFileSync, writeSync } from "fs";
import { OutputRoad } from "./OutputRoad";
import { Road } from "./types/Node";
import distanceBetweenTwoPoints from "./utils/distanceBetweenTwoPoints";

const roads: (Road | null)[] = JSON.parse(readFileSync('./data/roadsScotland.json', { encoding: 'utf-8' }))

// Tally points

const tally = {};

for (let i = 0; i < roads.length; i++) {
  const road = roads[i];
  for (let j = 0; j < (road?.geometry.coordinates?.length ?? 0); j++) {
    const point = road!.geometry.coordinates[j].join(",");
    if (!tally[point])
      tally[point] = 1;
    else
      tally[point]++;
  }
}

let i = 0


const mapTable = {} as Record<string, number[]>
const outputRoads = [] as OutputRoad[];


for (const road of roads) {
  console.log(i++);
  if (!road)
    continue;

  let splittingPoints = [] as number[]
  const roadCords = road.geometry.coordinates;
  for (let i = 1; i < roadCords.length - 1; i++) {
    const point = roadCords[i].join(',');
    if (tally[point] > 1) {
      splittingPoints.push(i);
    }
  }
  if (splittingPoints.length > 1) {

    for (let k = 1; k < splittingPoints.length; k++) {
      const startPoint = splittingPoints[k - 1];
      const endPoint = splittingPoints[k];
      const section = roadCords.slice(startPoint, endPoint + 1)
      let length = 0;
      for (let j = 1; j < section.length; j++) {
        const prevElement = section[j - 1];
        const element = section[j];
        length += distanceBetweenTwoPoints(prevElement, element);
      }

      outputRoads.push({
        points: [roadCords[startPoint], roadCords[endPoint]],
        length,
        lineString: section,
        properties: road.properties,
      });

      [roadCords[startPoint], roadCords[endPoint]].forEach(point => {
        if (!mapTable[point.join(",")])
          mapTable[point.join(",")] = [outputRoads.length]
        else
          mapTable[point.join(",")].push(outputRoads.length)
      })

    }
  } else {
    let length = 0;
    for (let j = 1; j < roadCords.length; j++) {
      const prevElement = roadCords[j - 1];
      const element = roadCords[j];
      length += distanceBetweenTwoPoints(prevElement, element);
    }
    outputRoads.push({
      points: [roadCords[0], roadCords[roadCords.length - 1]],
      length,
      lineString: roadCords,
      properties: road.properties,
    });
    [roadCords[0], roadCords[roadCords.length - 1]].forEach(point => {
      if (!mapTable[point.join(",")])
        mapTable[point.join(",")] = [outputRoads.length]
      else
        mapTable[point.join(",")].push(outputRoads.length)
    })
  }

  // if (outputRoads.length > 1)

}
// console.log(outputRoads[0], outputRoads.length)

// console.log(roads.filter(Boolean).length, roads.length)

writeFileSync("./data/unifiedRoadsScotland.json", JSON.stringify(outputRoads))
writeFileSync("./data/mapTableScotland.json", JSON.stringify(mapTable))