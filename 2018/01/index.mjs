import { inputData } from './input.mjs';

const args = process.argv.slice(2);
let frequency = 0;
let seen = {};
if ( args[0] ) {
  frequency = inputData.reduce((acc, val) => acc + val);
  console.log(frequency);
} else {
  let seen = {
    0: true,
  };
  let foundDupe = false;
  while (!foundDupe) {
    for (let i = 0; i < inputData.length; i++) {
      frequency += inputData[i];
      if (seen[frequency]) {
        foundDupe = true; 
        break;
      } else {
        seen[frequency] = true;
      }      
    }
  }
  console.log(frequency);
}

