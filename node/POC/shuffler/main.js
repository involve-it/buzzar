/**
 * Created by Ashot on 9/9/15.
 */

/**
 * Shuffle an array
 * @param array
 * @returns {Array} An efficiently and fairly shuffled array.
 */
const MAXINT = 100, MAXSIZE = 4;
var shuffle = function(array) {
  // Implementation here

  for(var j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);

  return array;
};

/**
 * Check if a given shuffle function is a fair.
 * @param shuffleFunction {Function} A function that takes an array as an argument. It shuffles arrays.
 * @returns {boolean} Whether or not this shuffle function fairly shuffles arrays.
 */

isShuffleFair = function (shuffleFunction, array) {
  // Do something with the shuffle function
  const DISTANCEACCEPTED = 1;
  var isFair = false, validityObj, i,
      shuffledDeck = shuffleFunction(array), validityRes = [], length, isOdd, num,
      sortedSD, isEqual;
  console.log('Generated array: ', array);
  console.log('Shuffled array: ', shuffledDeck);

  for(i = 0; i < shuffledDeck.length; i++){
    validityObj = {
      isSame: false,
      isClose: false
    };
    if(array[i] === shuffledDeck[i]) {
      validityObj.isSame = true;
    } else {
      // check if there is element is within DISTANCEACCEPTED (todo: make loop for work for >1):
      if (array[i] === shuffledDeck[i + 1] || array[i] === shuffledDeck[i - 1]) {  // delibirately dublicating isClose for exchanged element.
        validityObj.isClose = true;
      }
    }
    // TODO: we did not consider case when two adjusting elems are the same: [0,0]. This should give isFair = true!!
    validityRes.push(validityObj);
  }
  console.log('validityRes array: ', validityRes);
  var sames =  _.filter(validityRes, function(el){ return el.isSame === true; }).length;
  var closes =  _.filter(validityRes, function(el){ return el.isClose === true; }).length;
  console.log('sames: ' + sames + ', closes: ' + closes);

  // note : isFair is very subjective, it will take into account position of the same elements and closeness to the original element.
  //        Ideally it should be configurable too.
  // note: num is  2 for odds and 1 for evens
  length = array.length;
  isOdd = (length % 2) == 1;
  console.log('isOdd: '+ isOdd);

  isOdd ? num = 1 : num = 2;
  if(length - sames === 0) {
    isFair = false;
  } else if(length - sames === 1) {
    if(isOdd){
      isFair = true;
    } else {
      isFair = true;
    }
  } else if(length - sames === 2) {
    if(isOdd){
      isFair = true;
    } else if(closes === 0){
      isFair = true;
    }
  } else if(length - sames > num) {
  //} else if(length - sames > num && !isOdd && closes === 0) {
    isFair = true;
  }
                             debugger;
  // check if array is sorted:
  sortedSD = _.sortBy(array, function(item){ return item});
  if(isFair){
    isEqual = true;
    _.each(shuffledDeck, function(item, i){
      if (item !== sortedSD[i]){
        isEqual = false;
      }
    })
    if(isEqual){
      isFair = false;
    }
  }
  // todo: check inversed sorting too

  console.log('isFair: '+ isFair);
  console.log('--------------------');

  return isFair;
};
randomArrayGenerator = function() {
  var ret = [], i,
      l = _.random(1, MAXSIZE);
      //l = MAXSIZE;         // testing only!
  for(i = 0; i < l; i++){
    ret.push(_.random(-MAXINT, MAXINT));
  }
  ret = _.shuffle(ret);
  return ret;
}

// thoughts:
// for 1
// el:
// [0]->[0],
// for 2 elems:
// isSame =1, [0,1]-> [0,1], isSame = 2, isClose = 0 (notFair); [0,1]-> [1,0], isSame = 0, isClose = 2 (isFair)  => for 2 elems is same  enough be not 2 (2-1)
// For 3 elems:
//Generated array:  [-2, 39, -20]
//main.js:32 Shuffled array:  [-20, 39, -2]
//main.js:49 validityRes array:  [Object, Object, Object]
//main.js:52 sames: 1, closes: 0
// IsFair
//main.js:53 --------------------
//main.js:31 Generated array:  [90, 22, 44]
//main.js:32 Shuffled array:  [90, 22, 44]
//main.js:49 validityRes array:  [Object, Object, Object]
//main.js:52 sames: 3, closes: 0
// notFair
//main.js:53 --------------------
//main.js:31 Generated array:  [-43, 45, -96]
//main.js:32 Shuffled array:  [-96, -43, 45]
//main.js:49 validityRes array:  [Object, Object, Object]
//main.js:52 sames: 0, closes: 2
// isFair
//main.js:53 --------------------
//main.js:31 Generated array:  [-43, 45, -96]
//main.js:32 Shuffled array:  [-43, -96, 45]
//main.js:49 validityRes array:  [Object, Object, Object]
//main.js:52 sames: 1, closes: 2
// isFair
//main.js:53 --------------------

// for 4 elems:
//main.js:30 Generated array:  [80, 26, -13, 79]
//main.js:31 Shuffled array:  [79, 26, -13, 80]
//main.js:49 validityRes array:  [Object, Object, Object, Object]
//main.js:52 sames: 2, closes: 0
//isFair
//main.js:53 --------------------
//main.js:30 Generated array:  [26, -13, 80, 79]
//main.js:31 Shuffled array:  [26, -13, 79, 80]
//main.js:49 validityRes array:  [Object, Object, Object, Object]
//main.js:52 sames: 2, closes: 2
//notFair
//main.js:53 --------------------
//main.js:30 Generated array:  [-75, -78, -53, 24]
//main.js:31 Shuffled array:  [-75, -78, -53, 24]
//main.js:49 validityRes array:  [Object, Object, Object, Object]
//main.js:52 sames: 4, closes: 0
// notFair
//main.js:53 --------------------
//main.js:30 Generated array:  [-77, -43, -14, -49]
//main.js:31 Shuffled array:  [-77, -49, -43, -14]
//main.js:49 validityRes array:  [Object, Object, Object, Object]
//main.js:52 sames: 1, closes: 2
// isFair
//main.js:53 --------------------