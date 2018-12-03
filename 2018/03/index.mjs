import { inputData } from './input.mjs';

const fillGrid = () => {
  let string = '';
  let squareClaimed = [];
  inputData.forEach((val, index) => {
    for ( let i = val['x']; i < val['x'] + val['width']; i++) {
      for ( let j = val['y']; j < val['y'] + val['height']; j++) {
        let coordinate = `${i}x${j}`;
        squareClaimed.push({
          claim: index + 1,
          coordinate: coordinate,
        });
      }
    }
  });

  // count all the squares that are claimed and by whom
  let squaresCounted = squareClaimed.reduce((acc, val) => {
    let currentArray = acc[val.coordinate] && acc[val.coordinate].claims; 
    if ( !currentArray ) {
      currentArray = [];
    }
    currentArray.push(val.claim);
    return Object.assign(acc, {
     [val.coordinate]: { 
        claims: currentArray,
        count: ((acc[val.coordinate] && acc[val.coordinate].count) || 0) + 1,
      }
    }, {})
  });

  // pull all the squares that have been overlapped
  let squareOverlapped = Object.keys(squaresCounted).filter(key => squaresCounted[key].count > 1);

  // find all the claims that have claimed squares, if claim has more than 1 count it.
  let claimsOverlap = Object.keys(squaresCounted).reduce((acc, key) => {
    if (squaresCounted[key].claims) {
      squaresCounted[key].claims.forEach(val => {
        if( !acc.includes(val) && squaresCounted[key].claims.length > 1) {
          acc.push(val);
        }
      });
    }
    return acc;
  }, []);

  // single claim will pull the only number not counted, this is dumb but works.
  let singleClaim =  claimsOverlap.sort((a, b) => a - b).filter((val, index) => {
    return index !== 0 && claimsOverlap[index-1] !== claimsOverlap[index] - 1;
  });

  console.log(squareOverlapped.length, singleClaim[0] - 1);
}
fillGrid();

