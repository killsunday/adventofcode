import { inputData } from './input.mjs';

const createDependencyMap = pairs => {
  let dependencyMap = new Map();
  let allSteps = [];
  pairs.forEach(pair => {
    let mapValue = dependencyMap.get(pair[1]);
    if (!dependencyMap.get(pair[0])) {
      dependencyMap.set(pair[0], { 
        dependencies: [],
        secondsToFinish: 60 + pair[0].charCodeAt(0) - 64
      });
    }
    if (mapValue) {
      mapValue.dependencies.push(pair[0]);
    } else {
      mapValue = {};
      mapValue.dependencies = [ pair[0] ]; 
    }
    dependencyMap.set(pair[1], {
      dependencies: mapValue.dependencies,
      secondsToFinish: 60 + pair[1].charCodeAt(0) - 64, 
    });
  });
  return dependencyMap;
};
  
const calculateSteps = data => {
  const dependencies = sortDependencies(createDependencyMap(data));
  return dependencies;
};


const sortDependencies = dep => {
  return new Map([ ...dep.entries()].sort((a, b) => {
    if (a[1].dependencies.length > b[1].dependencies.length) return 1;
    if (a[1].dependencies.length < b[1].dependencies.length) return -1;
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
  }));
};

const calculateResult = dependencies => {
  let result = '';
  let seconds = 0;
  let workers = [];
  dependencies = sortDependencies(dependencies);
  while (dependencies.size !== 0) {
    const entries = [...dependencies.entries()];
    const key = entries[0][0];
    const val = entries[0][1].dependencies;
    if (!val.length) {
      dependencies.delete(key);
      [...dependencies.entries()].forEach(entry => {
        entry[1].dependencies = entry[1].dependencies.filter(a => a !== key);
        dependencies.set(entry[0], entry[1]);
      });
      dependencies = sortDependencies(dependencies);
      result += key;
    }
  } 
  return result;
};

const calculateTime = dependencies => {
  let timeSpent = 0;
  let workers = Array(5).fill('');
  while (true) {
    let deps = [...dependencies.entries()].filter(task => !task[1].dependencies.length);
    if (!deps.length) break;
    let workingDeps = deps.filter(task => !workers.includes(task[0]));
    let i = -1;
    workers = workers.map(worker => worker || (workingDeps[++i] || [''])[0] || '');
    workers.forEach((workerOnTask, index) => {
      let task = dependencies.get(workerOnTask);
      if (!task) return;
      task.secondsToFinish -= 1;
      if (!task.secondsToFinish) {
        workers[index] = '';
        [...dependencies.entries()].forEach(entry => {
          entry[1].dependencies = entry[1].dependencies.filter(a => a !== workerOnTask);
          dependencies.set(entry[0], entry[1]);
        });
        dependencies.delete(workerOnTask);
        dependencies = sortDependencies(dependencies);
      }
    });
    timeSpent += 1;
  }
  return timeSpent;
};

console.log(calculateResult(calculateSteps(inputData)));
console.log(calculateTime(calculateSteps(inputData)));
