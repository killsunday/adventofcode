import { inputData } from './input.mjs';

const parseData = data => {
  let nodeData = data.split(' ').map(x => parseInt(x, 10));
  return nodeData;
};

const calculateNodeSum = data => {
  let childrenCount = data.shift();
  let metaCount = data.shift();
  let sum = 0;
  for (let i = 0; i < childrenCount; i++) {
    sum += calculateNodeSum(data);
  }

  for (let i = 0; i < metaCount; i++) {
    sum += data.shift(); 
  }
  return sum;
}

const calculateChildrenSum = data =>  {
  const childrenCount = data.shift();
  const metaCount = data.shift();
  let sum = 0;
  if (childrenCount) {
    let childrenData = [];
    for (let i = 0; i < childrenCount; i++) {
      childrenData.push(calculateChildrenSum(data));
    }
    const metaData = [];
    for (let i = 0; i < metaCount; i++) {
      metaData.push(data.shift());
    }
    for (const index of metaData) {
      const useIndex = index - 1;
      if ( useIndex >= 0 && useIndex < childrenData.length) {
        sum += childrenData[useIndex];
      }
    }
    return sum;
  } else {
    for ( let i = 0; i < metaCount; i++) {
      sum += data.shift();
    }
    return sum;
  }
}
console.log(calculateNodeSum(parseData(inputData)));
console.log(calculateChildrenSum(parseData(inputData)));

