import { readFileSync } from "fs";
import type { Road } from "./types/Node";
import flip from "./utils/flip";
import { notEmpty } from "./utils/notEmpty";
import puppeteer from 'puppeteer'
import { graphSearch } from "./graphSearch";
import { OutputRoad } from "./OutputRoad";


var contentHtml = readFileSync('./index.html', 'utf8');

export const roads: OutputRoad[] = JSON.parse(readFileSync('./data/unifiedRoadsScotland.json', { encoding: 'utf-8' }));
export const inRoads: OutputRoad[] = JSON.parse(readFileSync('./data/roadsScotland.json', { encoding: 'utf-8' }));
console.log(roads.length, inRoads.length, inRoads.length - roads.length)
export const mapTable: OutputRoad[] = JSON.parse(readFileSync('./data/mapTableScotland.json', { encoding: 'utf-8' }));


export const startState = flip([55.94918862272607, -3.1979392542783516])
export const goalState: [number, number] = flip([55.86523859081438, -4.262954920580278]);

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();
  await page.setContent(contentHtml)
  const windowHandle = await page.evaluateHandle(() => window);

  const draw = async ([x1, x2]: [number, number], color:string) => {
    // console.log(x1, x2)
    // windowHandle.draw(x2,x1)
    await page.evaluate(([x1, x2],  color) => {
      //@ts-ignore
      // const map = (window.myMap as google.maps.Map);
      // alert("Drawing", x2, x1)
      var marker = new google.maps.Marker({
        position: { lat: x2, lng: x1 },
        icon: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(`
        <svg width="10" fill="${color}" height="10" xmlns="http://www.w3.org/2000/svg">
          <circle cx="5" cy="5" r="5"/>
        </svg>`),
        //@ts-ignore
        map: window.myMap
      });
    }, [x1, x2],  color);

  }
  const drawLine = async (lineString: [number, number][]) => {
    // console.log(lineString)
    // windowHandle.draw(x2,x1)
    await page.evaluate((lineString) => {
      // const map = (window.myMap as google.maps.Map);
      // alert("Drawing", x2, x1)
      //@ts-ignore
      // if (window.line)
      //@ts-ignore
      // (window.line as google.maps.Polyline).setVisible(false);
      //@ts-ignore
      window.line = new google.maps.Polyline({
        path: lineString.map(([x1, x2]) => ({lat: x2, lng: x1})),
        geodesic: true,
        strokeColor: "hotpink",
        strokeOpacity: 1.0,
        strokeWeight: 2,        
        //@ts-ignore
        map: window.myMap
      });
    }, lineString);

  }
  await graphSearch(draw, drawLine)

  // for (const road of roads) {
  //   await drawLine(road.lineString)
  // }

  // await browser.close();
})();