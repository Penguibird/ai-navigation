import { readFileSync, writeFileSync } from "fs";

const data = readFileSync('./data/scotlandData.json', { encoding: 'utf-8' });
const parsed = JSON.parse(data).map((collection: any) => collection.features).flat();
const [nodes, roads] = parsed.reduce((acc, feature) => {
  if (feature.geometry.type == 'Point')
    acc[0].push(feature);
  else if (feature.geometry.type == 'LineString' || feature.geometry.type == 'Polygon')
    acc[1].push(feature);

  else
    acc[1].push(feature);
  return acc;
}, [[], []]);
console.log(parsed.length, roads.length + nodes.length);

writeFileSync('./data/roadsScotland.json', JSON.stringify(roads));
writeFileSync('./data/nodesScotland.json', JSON.stringify(nodes));

