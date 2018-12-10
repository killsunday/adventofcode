const numPlayers = 432;
let highestPoints = 71019;

const addAfterMarble = (value, marble) => {
  const thisMarble = {
    value,
    prev: marble,
    next: marble.next,
  };

  marble.next.prev = thisMarble;
  marble.next = thisMarble;
  return thisMarble;
}

const calculateHighScore = (multiplier = 1) => {
  let currentPlayer = 1;
  let scores = { };
  let currentMarble = {
    value: 0,
  };
  currentMarble.next = currentMarble;
  currentMarble.prev = currentMarble;
  for (let i = 1; i <= highestPoints * multiplier; i++) {
    if (i % 23 === 0) {
      if (scores[currentPlayer]) {
        scores[currentPlayer] += i;
      } else {
        scores[currentPlayer] = i;
      }
      currentMarble = currentMarble.prev.prev.prev.prev.prev.prev;
      scores[currentPlayer] += currentMarble.prev.value;
      currentMarble.prev.prev.next = currentMarble;
      currentMarble.prev = currentMarble.prev.prev;
    } else {
      currentMarble = addAfterMarble(i, currentMarble.next);
    }
    currentPlayer = currentPlayer % numPlayers + 1;
  }
  return Math.max(...Object.values(scores));
};

console.log(calculateHighScore());
console.log(calculateHighScore(100));

