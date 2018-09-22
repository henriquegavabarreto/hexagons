// Learned it from: https://www.redblobgames.com/grids/hexagons/

let grid = [];
let highlight;
// Set the hex and hexGrid properties here
let hexProp = {
  radius: 2,
  size: 40,
  xOrigin: 200,
  yOrigin: 200,
}

function setup() {
  createCanvas(400, 400);
  highlight = color(120,60,225);
  getGridInfo(hexProp.radius);
}

function draw() {
  background(0);
  drawHexGrid(hexProp.radius, hexProp.size, hexProp.xOrigin, hexProp.yOrigin);
  // get the coordinates from the mouse and tell me in top of which
  // hex it is on top of
  let coordinates = getCoordinatesOfAction(mouseX,mouseY);
  //Now that you know on top of which, get me the center of this hex
  drawIfInGrid(coordinates);
}

//Get the corners of the hexagon to draw it
//
function getHexCorner (center, size, i){
  var angleDeg = 60 * i + 30;
  var angleRad = Math.PI / 180 * angleDeg
  let x = center.x + size * Math.cos(angleRad);
  let y = center.y + size * Math.sin(angleRad);
  return {x: x, y: y};
}

// Create a hexagon
function hexagon(center,hexSize,color){
  if(color){
    fill(color);
  } else {
    noFill();
  }
  stroke(255);
  beginShape();
	for(let i = 0; i < 6; i++){
    let p1 = getHexCorner(center,hexSize,i);
    vertex(p1.x, p1.y);
  }
  endShape(CLOSE);
}

// draw the hexagonal grid with a radius considering [0,0]
// as the center hexagon. The radius defines the size of the grid
function drawHexGrid(radius, hexSize, hxOriginX, hxOriginY){
	for(let r = -radius; r <= radius; r++){
  	for(let q = -radius; q <= radius; q++){
      if(q + r > -(radius +1) && q + r < radius + 1){
      	let hexCenter = pointyHexToPixel({q:q, r:r}, hexSize, hxOriginX, hxOriginY);
      	hexagon(hexCenter,hexSize);
  		}
    }
  }
}

// get the centers of the hexagons based on the columns q
// and rows r, considering it's center hxOrigin
function pointyHexToPixel(hx, hexSize, hxOriginX, hxOriginY){
    let x = hexSize * (Math.sqrt(3) * hx.q + Math.sqrt(3)/2 * hx.r)+ hxOriginX;
    let y = hexSize * (3/2 * hx.r) + hxOriginY;
    return {x: x, y: y};
}

// Takes mouse coordinates or else and the grid origins and
// returns the equivalent cube coordinate position
// !! the sum of the coordinates q, r, s is zero !!
function pixelToPointyHex(pt, hexSize, hxOriginX, hxOriginY){
  let q = (Math.sqrt(3)/3 * (pt.x - hxOriginX)  -  1/3 * (pt.y - hxOriginY)) / hexSize;
  let r = (2/3 * (pt.y - hxOriginY)) / hexSize;
  return {q:q, r:r, s: -q-r};
}

// Round the cube coordinates
function cubeRound(cube){

  let rx = Math.round(cube.q);
  let ry = Math.round(cube.r);
  let rz = Math.round(cube.s);

  let xDiff = Math.abs(rx - cube.q);
  let yDiff = Math.abs(ry - cube.r);
  let zDiff = Math.abs(rz - cube.s);

  if (xDiff > yDiff && xDiff > zDiff){
    	rx = -ry-rz;
  } else if (yDiff > zDiff){
    	ry = -rx-rz;
  } else {
    	rz = -rx-ry;
  }

  return {rx:rx, ry:ry, rz:rz};
}

function getGridInfo(radius){
	for(let r = -radius; r <= radius; r++){
  	for(let q = -radius; q <= radius; q++){
      if(q + r > -(radius +1) && q + r < radius + 1){
        grid.push([q,r]);
  		}
    }
  }
}

// draw fill for hexagon if action occurs on grid
 function drawIfInGrid(coordinates){
   for(let i = 0; i < grid.length; i++){
     if(coordinates.rx == grid[i][0] && coordinates.ry == grid[i][1]){
       let pxCoordinates = pointyHexToPixel({q:coordinates.rx ,r:coordinates.ry},hexProp.size,hexProp.xOrigin, hexProp.yOrigin);
       hexagon(pxCoordinates, hexProp.size, highlight);
     }
   }
 }
//get cube coordinates of an action giving it's pixels coordinates
function getCoordinatesOfAction(positionX,positionY){
  return cubeRound(pixelToPointyHex({x:positionX, y:positionY}, hexProp.size, hexProp.xOrigin, hexProp.yOrigin));
}
