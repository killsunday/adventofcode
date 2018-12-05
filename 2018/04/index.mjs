import { inputData } from './input.mjs';

const addMinutes = (shift, nextShift) => {
  let lastMinute = nextShift ? nextShift.state.minute : 60;
  let nappyMinutes = [];
  for (let i = shift.state.minute; i < nextShift.state.minute; i++) {
    nappyMinutes.push(i);
  }
  return nappyMinutes;
};

const createGrid = data => {
  let grid = 'ID\t\t\tDate\t\t\tMinutes\n';
  grid += '  \t\t\t     \t\t\t';
  for (let i = 0; i <=5; i++) {
    grid += ''.padStart(10, i);
  }
  grid += '\n  \t\t\t     \t\t\t';
  grid += ''.padStart(60, '0123456789');
  grid += '\n';

  data.forEach((shift, index) => {
    if(shift.state.newShift) {
      grid += `${shift.guardId}\t\t\t${shift.date.getMonth()+1}-${shift.date.getDate()}\t\t\t`;
    }

    if (data[index+1] && !data[index+1].state.newShift) {
      if (shift.state.newShift && shift.state.hour === 0) {
        grid += ''.padStart(shift.state.minute, shift.state.isAwake ? '.' : '#');
      } else if (shift.state.newShift) {
        grid += ''.padStart(data[index+1].state.minute, shift.state.isAwake ? '.' : '#');
      } else {
      }
      grid += ''.padStart(data[index+1].state.minute - shift.state.minute, shift.state.isAwake ? '.' : '#');
    } else if (data[index+1] && data[index+1].state.newShift) {
      if (shift.state.newShift) {  
        grid += ''.padStart(60, '.');
      } else {
        grid += ''.padStart(60 - shift.state.minute, shift.state.isAwake ? '.' : '#');
      }
    } else {
      grid += ''.padStart(60 - shift.state.minute, shift.state.isAwake ? '.' : '#');
    }
    if (data[index+1] && data[index+1].state.newShift) {
      grid += '\n';
    }
  }); 
  return grid;
}

const readData = data => {
  let guardId = 0;
  const cleanData = data.sort().map(val => {
    const parse = val.match(/\[(.*)\] (Guard \#(\d+) )?(begins shift|wakes up|falls asleep)/);
    if (!Number.isNaN(Number(parse[3]))) {
      guardId = Number(parse[3]);
    }
    let isAwake = 1;
    if (parse[4] === 'falls asleep') {
      isAwake = 0;
    }
    const row = {
      guardId: guardId,
      date: new Date(parse[1]),
      state: {
        hour: new Date(parse[1]).getHours(),
        minute: new Date(parse[1]).getMinutes(),
        newShift: parse[4] === 'begins shift',
        isAwake,
        asleepMinutes: [],
      },
    };
    return row;
  }); 
  return cleanData.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
};

const calculateNapTime = (acc, val, index, data) => {
  let minutesAwake = 0;
  let minutesAsleep = 0;
  if (!val.state.isAwake) {
    val.state.asleepMinutes = addMinutes(val, data[index+1]);
  }
  if (acc[val.guardId]) {
    minutesAwake = acc[val.guardId].minutesAwake;
    minutesAsleep = acc[val.guardId].minutesAsleep;
  }
  if (val.state.newShift) {
    minutesAwake += data[index+1].state.minute;
  } else if (data[index+1] && data[index+1].state.newShift) {
    if(val.state.isAwake) {
      minutesAwake += 59 - val.state.minute;
    } else {
      minutesAsleep += 59 - val.state.minute;
    }
  } else if (data[index+1] && !data[index+1].isAwake) {
    minutesAsleep += data[index+1].state.minute - val.state.minute;
  } else if (data[index+1] && data[index+1].isAwake) {
    minutesAsleep += data[index+1].state.minute - val.state.minute;
  }
  return [ minutesAsleep, minutesAwake, val.state.asleepMinutes ];
}

const calculateGuardDuty = data => {
  return data.reduce((acc, val, index)  => {
    let [ minutesAsleep, minutesAwake, asleepMinutes ] = calculateNapTime(acc, val, index, data);
    let countAsleepMinutes = {};
    if (acc[val.guardId] && asleepMinutes.length) {
      countAsleepMinutes = asleepMinutes.reduce((minAcc, minVal) => {
        let countObject = (acc[val.guardId] && acc[val.guardId].countAsleepMinutes) || {};
        return Object.assign(countObject, {
          [minVal]: (countObject[minVal] && countObject[minVal] + 1) || 1,
        }, {});
      }, {});
    }
    let currentMinutes = (acc[val.guardId] && acc[val.guardId] && acc[val.guardId].countAsleepMinutes) || {};
    return Object.assign(acc, {
      [`${val.guardId}`]: {
        minutesAwake,
        minutesAsleep,
        countAsleepMinutes: Object.assign(currentMinutes, countAsleepMinutes, {}), 
      }
    }, {});
  }, {});
};
console.log(createGrid(readData(inputData)));
console.log(calculateGuardDuty(readData(inputData)));
