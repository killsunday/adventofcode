import { inputData } from './input.mjs';

// #Part 1
let matchesTwice = 0;
let matchesThrice = 0;
const countLetters = val => {
  let counts = Array.from(val).reduce((countMap, letter) => {
    countMap[letter] = countMap[letter] ? ++countMap[letter] : 1;
    return countMap;
  }, {});

  const stringWithTwoLetters = Object.keys(counts)
    .filter(key => counts[key] === 2);
  if (stringWithTwoLetters.length) {
    matchesTwice += 1;
  }

  const stringWithThreeLetters = Object.keys(counts)
    .filter(key => counts[key] === 3);
  if (stringWithThreeLetters.length) {
    matchesThrice += 1;
  } 
};

inputData.forEach(countLetters);
console.log(matchesTwice * matchesThrice);

//Part 2
const levenshteinDistance = (a, b) => {
if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}

const diffBoxIds = (val) => {
  const boxes = inputData.filter(cur => levenshteinDistance(val, cur) === 1);
  if (boxes.length) {
    const matchesString = boxes[0].split('');
    let sharedLetters = Array.from(val).reduce((acc, cur, i) => {
      return matchesString[i] === cur ? acc + cur : acc + '';
    }, '');
    console.log(sharedLetters);
  }
};

inputData.forEach(diffBoxIds);

