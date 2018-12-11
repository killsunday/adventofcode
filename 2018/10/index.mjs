import { inputData } from './input.mjs';

const maxViewSize = process.argv[2];
const getMaxCoordinates = coords => {
  return [
    Math.max(...coords.map(val => val['x'])),
    Math.max(...coords.map(val => val['y'])),
    Math.min(...coords.map(val => val['x'])),
    Math.min(...coords.map(val => val['y'])),
  ];
};

const moveCoords = points => {
  return points.map(({ x, y, velX, velY }) => {
    x += velX;
    y += velY;
    return {
      x,
      y,
      velX,
      velY,
    };
  });
};

const createPoint = val => {
  const match = val.match(/position\=<(.+),(.+)> velocity=<(.+),(.+)>/);
  return {
    x: +match[1],
    y: +match[2],
    velX: +match[3],
    velY: +match[4],
  }
};

const findMessage = data => {
  let points = data.map(createPoint);
  let string = '';
  for (let i = 0; i <= 3000000; i++) {
    points = moveCoords(points);
    const [ maxX, maxY, minX, minY ] = getMaxCoordinates(points);
    if (maxX - minX < maxViewSize &&  maxY - minY < maxViewSize) {
      const coordinateMap = points.reduce((acc, val) => {
        return Object.assign(acc, {
          [ `${val['x']}-${val['y']}` ]: '#', 
        }, {});
      }, {});
      for(let j = minY; j <= maxY; j++) {
        for (let i = minX; i <= maxX; i++) {
          string += coordinateMap[`${i}-${j}`] || '.';
        }
        string += '\n';
      }
      console.log(i+1);
      break;
    }
  }
  return string;
};
console.log(findMessage(inputData));

