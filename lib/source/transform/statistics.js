"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sum = sum;
exports.max = max;
exports.min = min;
exports.mean = mean;

function max(x) {
  if (x.length === 0) {
    throw new Error('max requires at least one data point');
  }

  var value = x[0];

  for (var i = 1; i < x.length; i++) {
    // On the first iteration of this loop, max is
    // undefined and is thus made the maximum element in the array
    if (x[i] > value) {
      value = x[i];
    }
  }

  return value;
}

function min(x) {
  if (x.length === 0) {
    throw new Error('min requires at least one data point');
  }

  var value = x[0];

  for (var i = 1; i < x.length; i++) {
    // On the first iteration of this loop, min is
    // undefined and is thus made the minimum element in the array
    if (x[i] < value) {
      value = x[i];
    }
  }

  return value;
}

function sum(x) {
  // If the array is empty, we needn't bother computing its sum
  if (x.length === 0) {
    return 0;
  } // Initializing the sum as the first number in the array


  var sum = x[0]; // Keeping track of the floating-point error correction

  var correction = 0;
  var transition;

  for (var i = 1; i < x.length; i++) {
    transition = sum + x[i]; // Here we need to update the correction in a different fashion
    // if the new absolute value is greater than the absolute sum

    if (Math.abs(sum) >= Math.abs(x[i])) {
      correction += sum - transition + x[i];
    } else {
      correction += x[i] - transition + sum;
    }

    sum = transition;
  } // Returning the corrected sum


  return sum + correction;
}

function mean(x) {
  if (x.length === 0) {
    throw new Error('mean requires at least one data point');
  }

  return sum(x) / x.length;
}