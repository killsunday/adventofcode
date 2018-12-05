import { inputData } from './input.mjs';

const UNITS = [ 'aA', 'Aa', 'bB', 'Bb', 'cC', 'Cc',
                'dD', 'Dd', 'eE', 'Ee', 'fF', 'Ff',
                'gG', 'Gg', 'Hh', 'hH', 'iI', 'Ii',
                'jJ', 'Jj', 'kK', 'Kk', 'lL', 'Ll', 
                'mM', 'Mm', 'nN', 'Nn', 'oO', 'Oo', 
                'pP', 'Pp', 'qQ', 'Qq', 'rR', 'Rr',
                'sS', 'Ss', 'tT', 'Tt', 'uU', 'Uu', 
                'vV', 'Vv', 'wW', 'Ww', 'xX', 'Xx', 
                'yY', 'Yy', 'zZ', 'Zz' ];

const calculateReactions = (data) => {
  const matcher = new RegExp(UNITS.join('|'));
  let string = data;
  while (matcher.test(string)) {
    string = string.replace(matcher, '');
  }
  return string.length;
}

const getReactionChains = inputData => {
  return UNITS.reduce((acc, val) => {
    const matcher = new RegExp(val.slice(0, 1), 'ig');
    if (acc[val.toLowerCase()]) {
      return acc;
    }
    return Object.assign(acc, {
      [val.toLowerCase()]: inputData.replace(matcher, ''),
    }, {});
  });
}
console.log(calculateReactions(inputData));
const inputs = getReactionChains(inputData);
Object.keys(inputs).forEach(key => {
  console.log(key, calculateReactions(inputs[key]));
});
