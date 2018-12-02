import { inputData } from './input.mjs';

let frequency = 0;
inputData.forEach(val => {
  frequency += val;
});
console.log(frequency);

