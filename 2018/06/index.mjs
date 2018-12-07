import { inputData } from './input.mjs';

const manhattanDistance = (x1, y1, x2, y2) => {
	let x = x1 - x2
	let y = y1 - y2;
	if (x < 0) {
		x = x * -1;
	}
	if (y < 0) {
		y = y * -1;
	}
	return x + y;
};

const findConstraints = data => {
  return data.reduce((acc, val) => {
    let [a, b] = val;
    return [ 
      a > acc[0] ? a : acc[0],
      b > acc[1] ? b : acc[1],
    ];
  });
};

const getPoints = points => {
  return Object.keys(points).reduce((acc, val) => {
    acc.push([ val, points[val] ]);
    return acc;
  }, []).sort((a, b) => a[1] - b[1]);
};

const calculateArea = (points, constraint, pointIsInfinite) => {
  const [ x, y ] = constraint;
  let area = new Map();
  let point = '';
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      point = points.get(`${i}x${j}`);
      if (pointIsInfinite[point]) {
        continue;
      }
      let pointArea = area.get(point);
      area.set(point, pointArea ? pointArea++ : 1);
    }
  }
  return area;
};

const buildGrid = data => {
  const [ x, y ] = findConstraints(data);
  let pointIsInfinite = {};
  let grid = new Map();
  let regionSize = 0;
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      let pointDistance = {};
      let sumOfDistance = 0;
      data.forEach((val, index) => {
        const distance = manhattanDistance(i, j, val[0], val[1]);
        pointDistance[index] = distance;
        sumOfDistance += distance;
      });
      
      if (sumOfDistance < 10000) {
        regionSize = regionSize + 1;
      } 
      let point = 0;
      const points = getPoints(pointDistance);
      if ( pointDistance[points[0][0]] === pointDistance[points[1][0]]) {
        point = 'x';
      } else {
        point = points[0];
      }

      grid.set(`${i}x${j}`, point[0])
      if ( (i === 0 || j === 0) || ( i === x || j === y)) {
        pointIsInfinite[point[0]] = true;
      }
    }
  }
  let area = [];
  calculateArea(grid, [ x, y ], pointIsInfinite).forEach((value, key) => {
    area.push([ key, value ]);
  });
  console.log(regionSize);
  return area.sort((a, b) => a[1] - b[1]);
};

console.log(buildGrid(inputData));

