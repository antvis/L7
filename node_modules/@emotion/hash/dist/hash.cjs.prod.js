"use strict";

function murmurhash2_32_gc(str) {
  for (var k, l = str.length, h = l ^ l, i = 0; l >= 4; ) k = 1540483477 * (65535 & (k = 255 & str.charCodeAt(i) | (255 & str.charCodeAt(++i)) << 8 | (255 & str.charCodeAt(++i)) << 16 | (255 & str.charCodeAt(++i)) << 24)) + ((1540483477 * (k >>> 16) & 65535) << 16), 
  h = 1540483477 * (65535 & h) + ((1540483477 * (h >>> 16) & 65535) << 16) ^ (k = 1540483477 * (65535 & (k ^= k >>> 24)) + ((1540483477 * (k >>> 16) & 65535) << 16)), 
  l -= 4, ++i;
  switch (l) {
   case 3:
    h ^= (255 & str.charCodeAt(i + 2)) << 16;

   case 2:
    h ^= (255 & str.charCodeAt(i + 1)) << 8;

   case 1:
    h = 1540483477 * (65535 & (h ^= 255 & str.charCodeAt(i))) + ((1540483477 * (h >>> 16) & 65535) << 16);
  }
  return h = 1540483477 * (65535 & (h ^= h >>> 13)) + ((1540483477 * (h >>> 16) & 65535) << 16), 
  ((h ^= h >>> 15) >>> 0).toString(36);
}

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = murmurhash2_32_gc;
