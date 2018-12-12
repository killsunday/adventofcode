const serialNumber = 5093;

const calculatePower = (x, y) => {
  const rackId = x + 10;
  let powerLevel = rackId * y;
  powerLevel += serialNumber;
  powerLevel *= rackId;
  if (powerLevel < 100) {
    powerLevel = 0;
  } else {
    powerLevel = parseInt(powerLevel.toString().slice(-3, -2), 10);
  }
  powerLevel -= 5;
  return powerLevel;
};

const makeGrid = () => {
  let powerGrid = {};
  for ( let i = 1; i <= 300; i++) {
    for (let j = 1; j <= 300; j++) {
      if (!powerGrid[i]) powerGrid[i] = [];
      powerGrid[i].push(calculatePower(j, i));
    }
  }
  let highestGridCoordinate = [ 0, 0 ];
  let highestGridPower = 0;
  for ( let i = 1; i <= 300; i++) {
    for ( let j = 1; j <= 300; j++) {
      let currentGridPower = 0; 
      let size = 10;
      let validGrid = true;
      while (validGrid) {
        if ( i + size > 300 || j + size > 300) {
          validGrid = false;
          break;
        }
        for (let k = i; k <= i + size; k++) {
          let gridRow = powerGrid[k].slice(j - 1, j + size - 1);
          currentGridPower += gridRow.reduce((acc, val) => acc + val);
        }
        if (currentGridPower > highestGridPower) {
          highestGridPower = currentGridPower;
          highestGridCoordinate = [ j, i, size ]; 
        }
        size++;
      }
    }
  }
  return [ highestGridCoordinate, highestGridPower ];
};

console.log(makeGrid());

