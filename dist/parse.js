"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const data = (0, fs_1.readFileSync)('./data/roads.geojson', { encoding: 'utf-8' });
const parsed = JSON.parse(data).map((collection) => collection.features).flat();
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
(0, fs_1.writeFileSync)('./data/roads.json', JSON.stringify(roads));
(0, fs_1.writeFileSync)('./data/nodes.json', JSON.stringify(nodes));
