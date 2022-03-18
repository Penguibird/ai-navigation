"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const roads = JSON.parse((0, fs_1.readFileSync)('./data/roads.json', { encoding: 'utf-8' }));
console.log(roads);
let i = 0;
for (const road of roads) {
    console.log(i++);
    if (!road)
        continue;
    const roadCordsString = road.geometry.coordinates.map(c => c.join(","));
    const endPoint = roadCordsString[roadCordsString.length - 1];
    const roadsContainingEndPoint = roads.filter(r => r && r.geometry.coordinates.map(c => c.join(',')).includes(endPoint));
    // console.log(endPoint, roadsContainingEndPoint.length)
    if (roadsContainingEndPoint.length == 2) {
        const otherRoad = roadsContainingEndPoint.find(r => r != road);
        const meetingIndexOnOhterRoad = otherRoad.geometry.coordinates.map(c => c.join(",")).indexOf(endPoint);
        if (meetingIndexOnOhterRoad == 0 || meetingIndexOnOhterRoad == otherRoad.geometry.coordinates.length - 1) {
            roads[roads.indexOf(otherRoad)] = null;
            let coordinates;
            if (meetingIndexOnOhterRoad == 0)
                coordinates = road.geometry.coordinates.concat(otherRoad.geometry.coordinates.slice(1));
            else
                coordinates = road.geometry.coordinates.concat(otherRoad.geometry.coordinates.reverse().slice(1));
            // console.log(road.geometry.coordinates, otherRoad.geometry.coordinates, coordinates)
            roads[roads.indexOf(road)] = Object.assign(Object.assign({}, road), { properties: Object.assign(Object.assign({}, road.properties), { name: road.properties.name + ", " + otherRoad.properties.name }), geometry: Object.assign(Object.assign({}, road.geometry), { coordinates }) });
        }
    }
}
console.log(roads.filter(Boolean).length, roads.length);
(0, fs_1.writeFileSync)("./data/unifiedRoads.json", JSON.stringify(roads));
