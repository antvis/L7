"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BKDRHash = BKDRHash;
exports.djb2hash = djb2hash;

function BKDRHash(str) {
  var seed = 131;
  var seed2 = 137;
  var hash = 0; // make hash more sensitive for short string like 'a', 'b', 'c'

  str += 'x'; // Note: Number.MAX_SAFE_INTEGER equals 9007199254740991

  var MAX_SAFE_INTEGER = parseInt(9007199254740991 / seed2);

  for (var i = 0; i < str.length; i++) {
    if (hash > MAX_SAFE_INTEGER) {
      hash = parseInt(hash / seed2);
    }

    hash = hash * seed + str.charCodeAt(i);
  }

  return hash;
}

function djb2hash(str) {
  var hash = 5381,
      i = str.length;

  while (i) {
    hash = hash * 33 ^ str.charCodeAt(--i);
  }
  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */


  return hash >>> 0;
}