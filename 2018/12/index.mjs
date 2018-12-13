import { inputData } from './input.mjs';

const calculateGeneration = (notes, state) => {
  let generatedState = state.replace(/#/g, '.');
  for ( let idx = 0; idx < notes.length; idx++) {
    let note = notes[idx].split(' => ');
    for (let i = 0; i < state.length - 4; i++) {
      if (state.substr(i, 5) === note[0]) {
        generatedState = generatedState.substr(0, i + 2) + note[1] + generatedState.substr(i + 3); 
      }
    }
  }
  return generatedState;
};

const calculateGrid = ({ initialState, notes }, generations) => {
  let state = initialState;
  let pot = 0;
  let repeatedCounter = 0;
  let sum = 0;
  let prevSum = 0;
  let prevDiff = 0;
  for (let i = 1; i <= generations; i++) {
    state = `....${state}....`;
    pot += 4;
    state = calculateGeneration(notes, state);
    sum = Array.from(state.split('').entries()).reduce((sum, [i, plant]) => {
      const potNum = i - pot;

      if (plant === '#') {
        sum += potNum
      }

      return sum
    }, 0);
    if (sum - prevSum === prevDiff) {
      repeatedCounter++;
      if (repeatedCounter === 3) {
        sum = (generations - i) * prevDiff + sum;
        break;
      }
    }  else {
        prevDiff = sum - prevSum;
        repeatedCounter = 0;
    }
    prevSum = sum;
  }

  return sum;
};

console.log(calculateGrid(inputData, 20));
console.log(calculateGrid(inputData, 50000000000));

