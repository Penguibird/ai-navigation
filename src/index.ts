import { readFileSync } from "fs";
import type { Road } from "./types/Node";
import flip from "./utils/flip";
import { notEmpty } from "./utils/notEmpty";
import puppeteer from 'puppeteer'
import { graphSearch } from "./graphSearch";
import { OutputRoad } from "./OutputRoad";


var contentHtml = readFileSync('./index.html', 'utf8');

export const roads: OutputRoad[] = JSON.parse(readFileSync('./data/unifiedRoadsScotland.json', { encoding: 'utf-8' }));
export const mapTable: OutputRoad[] = JSON.parse(readFileSync('./data/mapTableScotland.json', { encoding: 'utf-8' }));

const svg = `
<svg width="10" fill="hotpink" height="10" xmlns="http://www.w3.org/2000/svg">
  <circle cx="5" cy="5" r="5"/>
</svg>`;

export const startState = flip([56.39631373586291, -3.731760665035462])
export const goalState: [number, number] = flip([56.46103099384841, -2.97033770290844]);

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();
  await page.setContent(contentHtml)
  const windowHandle = await page.evaluateHandle(() => window);

  const draw = async ([x1, x2]: [number, number]) => {
    console.log(x1, x2)
    // windowHandle.draw(x2,x1)
    await page.evaluate(([x1, x2], svg) => {
      //@ts-ignore
      // const map = (window.myMap as google.maps.Map);
      // alert("Drawing", x2, x1)
      var marker = new google.maps.Marker({
        position: { lat: x2, lng: x1 },
        icon: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svg),
        //@ts-ignore
        map: window.myMap
      });
    }, [x1, x2], svg);

  }

  
  await graphSearch(draw)

  // await browser.close();
})();