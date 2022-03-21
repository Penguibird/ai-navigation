import { readFileSync } from "fs";
import type { Node, Road } from "./types/Node";
import distanceBetweenTwoPoints from "./utils/distanceBetweenTwoPoints";

const roads: Road[] = JSON.parse(readFileSync('./data/roads.json', {encoding: 'utf-8'}));
const nodes: Node[] = JSON.parse(readFileSync('./data/nodes.json', {encoding: 'utf-8'}));
// 55.94376,-4.01455  51km distance in a straight line
// 55.94811,-3.19545
const constraint=(startNode:Node,endNode:Node)=>{

    let boundries=[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
    let direction = Direction(startNode,endNode);
    if (direction==1)
    {
        //first side
        boundries[0]=[startNode.coordinates[1],startNode.coordinates[0]-0.5];
        boundries[1]=[startNode.coordinates[1]-0.5,startNode.coordinates[0]];
        boundries[2]=[startNode.coordinates[1],startNode.coordinates[0]+0.5];

        //second side
        boundries[3]=[endNode.coordinates[1],endNode.coordinates[0]-0.5];
        boundries[4]=[endNode.coordinates[1]+0.5,endNode.coordinates[0]];
        boundries[5]=[endNode.coordinates[1],endNode.coordinates[0]+0.5];
    }
   


}

let Direction=(startNode:Node,endNode:Node)=>{
    //north
    if(startNode.coordinates[1]<endNode.coordinates[1]){
        //east
        if(startNode.coordinates[0]<endNode.coordinates[0])
        {
            return 1;
        }
        //west
        else if(startNode.coordinates[0]>endNode.coordinates[0])
        {
           return 2;
        }
    }
    //south
    else if(startNode.coordinates[1]>endNode.coordinates[1]){
        //east
        if(startNode.coordinates[0]<endNode.coordinates[0])
        {
           return 3;
        }
        //west
        else if(startNode.coordinates[0]>endNode.coordinates[0])
        {
            return 4;
        }
    }

    

}