'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _basedecoder = require('./basedecoder');

var _basedecoder2 = _interopRequireDefault(_basedecoder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* -*- tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/*
   Copyright 2011 notmasteryet
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// - The JPEG specification can be found in the ITU CCITT Recommendation T.81
//   (www.w3.org/Graphics/JPEG/itu-t81.pdf)
// - The JFIF specification can be found in the JPEG File Interchange Format
//   (www.w3.org/Graphics/JPEG/jfif3.pdf)
// - The Adobe Application-Specific JPEG markers in the Supporting the DCT Filters
//   in PostScript Level 2, Technical Note #5116
//   (partners.adobe.com/public/developer/en/ps/sdk/5116.DCT_Filter.pdf)


var dctZigZag = new Int32Array([0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]);

var dctCos1 = 4017; // cos(pi/16)
var dctSin1 = 799; // sin(pi/16)
var dctCos3 = 3406; // cos(3*pi/16)
var dctSin3 = 2276; // sin(3*pi/16)
var dctCos6 = 1567; // cos(6*pi/16)
var dctSin6 = 3784; // sin(6*pi/16)
var dctSqrt2 = 5793; // sqrt(2)
var dctSqrt1d2 = 2896; // sqrt(2) / 2

function buildHuffmanTable(codeLengths, values) {
  var k = 0;
  var code = [];
  var length = 16;
  while (length > 0 && !codeLengths[length - 1]) {
    --length;
  }
  code.push({ children: [], index: 0 });

  var p = code[0];
  var q = void 0;
  for (var i = 0; i < length; i++) {
    for (var j = 0; j < codeLengths[i]; j++) {
      p = code.pop();
      p.children[p.index] = values[k];
      while (p.index > 0) {
        p = code.pop();
      }
      p.index++;
      code.push(p);
      while (code.length <= i) {
        code.push(q = { children: [], index: 0 });
        p.children[p.index] = q.children;
        p = q;
      }
      k++;
    }
    if (i + 1 < length) {
      // p here points to last code
      code.push(q = { children: [], index: 0 });
      p.children[p.index] = q.children;
      p = q;
    }
  }
  return code[0].children;
}

function decodeScan(data, initialOffset, frame, components, resetInterval, spectralStart, spectralEnd, successivePrev, successive) {
  var mcusPerLine = frame.mcusPerLine,
      progressive = frame.progressive;


  var startOffset = initialOffset;
  var offset = initialOffset;
  var bitsData = 0;
  var bitsCount = 0;
  function readBit() {
    if (bitsCount > 0) {
      bitsCount--;
      return bitsData >> bitsCount & 1;
    }
    bitsData = data[offset++];
    if (bitsData === 0xFF) {
      var nextByte = data[offset++];
      if (nextByte) {
        throw new Error('unexpected marker: ' + (bitsData << 8 | nextByte).toString(16));
      }
      // unstuff 0
    }
    bitsCount = 7;
    return bitsData >>> 7;
  }
  function decodeHuffman(tree) {
    var node = tree;
    var bit = void 0;
    while ((bit = readBit()) !== null) {
      // eslint-disable-line no-cond-assign
      node = node[bit];
      if (typeof node === 'number') {
        return node;
      }
      if ((typeof node === 'undefined' ? 'undefined' : (0, _typeof3.default)(node)) !== 'object') {
        throw new Error('invalid huffman sequence');
      }
    }
    return null;
  }
  function receive(initialLength) {
    var length = initialLength;
    var n = 0;
    while (length > 0) {
      var bit = readBit();
      if (bit === null) {
        return undefined;
      }
      n = n << 1 | bit;
      --length;
    }
    return n;
  }
  function receiveAndExtend(length) {
    var n = receive(length);
    if (n >= 1 << length - 1) {
      return n;
    }
    return n + (-1 << length) + 1;
  }
  function decodeBaseline(component, zz) {
    var t = decodeHuffman(component.huffmanTableDC);
    var diff = t === 0 ? 0 : receiveAndExtend(t);
    component.pred += diff;
    zz[0] = component.pred;
    var k = 1;
    while (k < 64) {
      var rs = decodeHuffman(component.huffmanTableAC);
      var s = rs & 15;
      var r = rs >> 4;
      if (s === 0) {
        if (r < 15) {
          break;
        }
        k += 16;
      } else {
        k += r;
        var z = dctZigZag[k];
        zz[z] = receiveAndExtend(s);
        k++;
      }
    }
  }
  function decodeDCFirst(component, zz) {
    var t = decodeHuffman(component.huffmanTableDC);
    var diff = t === 0 ? 0 : receiveAndExtend(t) << successive;
    component.pred += diff;
    zz[0] = component.pred;
  }
  function decodeDCSuccessive(component, zz) {
    zz[0] |= readBit() << successive;
  }
  var eobrun = 0;
  function decodeACFirst(component, zz) {
    if (eobrun > 0) {
      eobrun--;
      return;
    }
    var k = spectralStart;
    var e = spectralEnd;
    while (k <= e) {
      var rs = decodeHuffman(component.huffmanTableAC);
      var s = rs & 15;
      var r = rs >> 4;
      if (s === 0) {
        if (r < 15) {
          eobrun = receive(r) + (1 << r) - 1;
          break;
        }
        k += 16;
      } else {
        k += r;
        var z = dctZigZag[k];
        zz[z] = receiveAndExtend(s) * (1 << successive);
        k++;
      }
    }
  }
  var successiveACState = 0;
  var successiveACNextValue = void 0;
  function decodeACSuccessive(component, zz) {
    var k = spectralStart;
    var e = spectralEnd;
    var r = 0;
    while (k <= e) {
      var z = dctZigZag[k];
      var direction = zz[z] < 0 ? -1 : 1;
      switch (successiveACState) {
        case 0:
          {
            // initial state
            var rs = decodeHuffman(component.huffmanTableAC);
            var s = rs & 15;
            r = rs >> 4;
            if (s === 0) {
              if (r < 15) {
                eobrun = receive(r) + (1 << r);
                successiveACState = 4;
              } else {
                r = 16;
                successiveACState = 1;
              }
            } else {
              if (s !== 1) {
                throw new Error('invalid ACn encoding');
              }
              successiveACNextValue = receiveAndExtend(s);
              successiveACState = r ? 2 : 3;
            }
            continue; // eslint-disable-line no-continue
          }
        case 1: // skipping r zero items
        case 2:
          if (zz[z]) {
            zz[z] += (readBit() << successive) * direction;
          } else {
            r--;
            if (r === 0) {
              successiveACState = successiveACState === 2 ? 3 : 0;
            }
          }
          break;
        case 3:
          // set value for a zero item
          if (zz[z]) {
            zz[z] += (readBit() << successive) * direction;
          } else {
            zz[z] = successiveACNextValue << successive;
            successiveACState = 0;
          }
          break;
        case 4:
          // eob
          if (zz[z]) {
            zz[z] += (readBit() << successive) * direction;
          }
          break;
        default:
          break;
      }
      k++;
    }
    if (successiveACState === 4) {
      eobrun--;
      if (eobrun === 0) {
        successiveACState = 0;
      }
    }
  }
  function decodeMcu(component, decodeFunction, mcu, row, col) {
    var mcuRow = mcu / mcusPerLine | 0;
    var mcuCol = mcu % mcusPerLine;
    var blockRow = mcuRow * component.v + row;
    var blockCol = mcuCol * component.h + col;
    decodeFunction(component, component.blocks[blockRow][blockCol]);
  }
  function decodeBlock(component, decodeFunction, mcu) {
    var blockRow = mcu / component.blocksPerLine | 0;
    var blockCol = mcu % component.blocksPerLine;
    decodeFunction(component, component.blocks[blockRow][blockCol]);
  }

  var componentsLength = components.length;
  var component = void 0;
  var i = void 0;
  var j = void 0;
  var k = void 0;
  var n = void 0;
  var decodeFn = void 0;
  if (progressive) {
    if (spectralStart === 0) {
      decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
    } else {
      decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
    }
  } else {
    decodeFn = decodeBaseline;
  }

  var mcu = 0;
  var marker = void 0;
  var mcuExpected = void 0;
  if (componentsLength === 1) {
    mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
  } else {
    mcuExpected = mcusPerLine * frame.mcusPerColumn;
  }

  var usedResetInterval = resetInterval || mcuExpected;

  while (mcu < mcuExpected) {
    // reset interval stuff
    for (i = 0; i < componentsLength; i++) {
      components[i].pred = 0;
    }
    eobrun = 0;

    if (componentsLength === 1) {
      component = components[0];
      for (n = 0; n < usedResetInterval; n++) {
        decodeBlock(component, decodeFn, mcu);
        mcu++;
      }
    } else {
      for (n = 0; n < usedResetInterval; n++) {
        for (i = 0; i < componentsLength; i++) {
          component = components[i];
          var _component = component,
              h = _component.h,
              v = _component.v;

          for (j = 0; j < v; j++) {
            for (k = 0; k < h; k++) {
              decodeMcu(component, decodeFn, mcu, j, k);
            }
          }
        }
        mcu++;

        // If we've reached our expected MCU's, stop decoding
        if (mcu === mcuExpected) break;
      }
    }

    // find marker
    bitsCount = 0;
    marker = data[offset] << 8 | data[offset + 1];
    if (marker < 0xFF00) {
      throw new Error('marker was not found');
    }

    if (marker >= 0xFFD0 && marker <= 0xFFD7) {
      // RSTx
      offset += 2;
    } else {
      break;
    }
  }

  return offset - startOffset;
}

function buildComponentData(frame, component) {
  var lines = [];
  var blocksPerLine = component.blocksPerLine,
      blocksPerColumn = component.blocksPerColumn;

  var samplesPerLine = blocksPerLine << 3;
  var R = new Int32Array(64);
  var r = new Uint8Array(64);

  // A port of poppler's IDCT method which in turn is taken from:
  //   Christoph Loeffler, Adriaan Ligtenberg, George S. Moschytz,
  //   "Practical Fast 1-D DCT Algorithms with 11 Multiplications",
  //   IEEE Intl. Conf. on Acoustics, Speech & Signal Processing, 1989,
  //   988-991.
  function quantizeAndInverse(zz, dataOut, dataIn) {
    var qt = component.quantizationTable;
    var v0 = void 0;
    var v1 = void 0;
    var v2 = void 0;
    var v3 = void 0;
    var v4 = void 0;
    var v5 = void 0;
    var v6 = void 0;
    var v7 = void 0;
    var t = void 0;
    var p = dataIn;
    var i = void 0;

    // dequant
    for (i = 0; i < 64; i++) {
      p[i] = zz[i] * qt[i];
    }

    // inverse DCT on rows
    for (i = 0; i < 8; ++i) {
      var row = 8 * i;

      // check for all-zero AC coefficients
      if (p[1 + row] === 0 && p[2 + row] === 0 && p[3 + row] === 0 && p[4 + row] === 0 && p[5 + row] === 0 && p[6 + row] === 0 && p[7 + row] === 0) {
        t = dctSqrt2 * p[0 + row] + 512 >> 10;
        p[0 + row] = t;
        p[1 + row] = t;
        p[2 + row] = t;
        p[3 + row] = t;
        p[4 + row] = t;
        p[5 + row] = t;
        p[6 + row] = t;
        p[7 + row] = t;
        continue; // eslint-disable-line no-continue
      }

      // stage 4
      v0 = dctSqrt2 * p[0 + row] + 128 >> 8;
      v1 = dctSqrt2 * p[4 + row] + 128 >> 8;
      v2 = p[2 + row];
      v3 = p[6 + row];
      v4 = dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128 >> 8;
      v7 = dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128 >> 8;
      v5 = p[3 + row] << 4;
      v6 = p[5 + row] << 4;

      // stage 3
      t = v0 - v1 + 1 >> 1;
      v0 = v0 + v1 + 1 >> 1;
      v1 = t;
      t = v2 * dctSin6 + v3 * dctCos6 + 128 >> 8;
      v2 = v2 * dctCos6 - v3 * dctSin6 + 128 >> 8;
      v3 = t;
      t = v4 - v6 + 1 >> 1;
      v4 = v4 + v6 + 1 >> 1;
      v6 = t;
      t = v7 + v5 + 1 >> 1;
      v5 = v7 - v5 + 1 >> 1;
      v7 = t;

      // stage 2
      t = v0 - v3 + 1 >> 1;
      v0 = v0 + v3 + 1 >> 1;
      v3 = t;
      t = v1 - v2 + 1 >> 1;
      v1 = v1 + v2 + 1 >> 1;
      v2 = t;
      t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
      v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
      v7 = t;
      t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
      v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
      v6 = t;

      // stage 1
      p[0 + row] = v0 + v7;
      p[7 + row] = v0 - v7;
      p[1 + row] = v1 + v6;
      p[6 + row] = v1 - v6;
      p[2 + row] = v2 + v5;
      p[5 + row] = v2 - v5;
      p[3 + row] = v3 + v4;
      p[4 + row] = v3 - v4;
    }

    // inverse DCT on columns
    for (i = 0; i < 8; ++i) {
      var col = i;

      // check for all-zero AC coefficients
      if (p[1 * 8 + col] === 0 && p[2 * 8 + col] === 0 && p[3 * 8 + col] === 0 && p[4 * 8 + col] === 0 && p[5 * 8 + col] === 0 && p[6 * 8 + col] === 0 && p[7 * 8 + col] === 0) {
        t = dctSqrt2 * dataIn[i + 0] + 8192 >> 14;
        p[0 * 8 + col] = t;
        p[1 * 8 + col] = t;
        p[2 * 8 + col] = t;
        p[3 * 8 + col] = t;
        p[4 * 8 + col] = t;
        p[5 * 8 + col] = t;
        p[6 * 8 + col] = t;
        p[7 * 8 + col] = t;
        continue; // eslint-disable-line no-continue
      }

      // stage 4
      v0 = dctSqrt2 * p[0 * 8 + col] + 2048 >> 12;
      v1 = dctSqrt2 * p[4 * 8 + col] + 2048 >> 12;
      v2 = p[2 * 8 + col];
      v3 = p[6 * 8 + col];
      v4 = dctSqrt1d2 * (p[1 * 8 + col] - p[7 * 8 + col]) + 2048 >> 12;
      v7 = dctSqrt1d2 * (p[1 * 8 + col] + p[7 * 8 + col]) + 2048 >> 12;
      v5 = p[3 * 8 + col];
      v6 = p[5 * 8 + col];

      // stage 3
      t = v0 - v1 + 1 >> 1;
      v0 = v0 + v1 + 1 >> 1;
      v1 = t;
      t = v2 * dctSin6 + v3 * dctCos6 + 2048 >> 12;
      v2 = v2 * dctCos6 - v3 * dctSin6 + 2048 >> 12;
      v3 = t;
      t = v4 - v6 + 1 >> 1;
      v4 = v4 + v6 + 1 >> 1;
      v6 = t;
      t = v7 + v5 + 1 >> 1;
      v5 = v7 - v5 + 1 >> 1;
      v7 = t;

      // stage 2
      t = v0 - v3 + 1 >> 1;
      v0 = v0 + v3 + 1 >> 1;
      v3 = t;
      t = v1 - v2 + 1 >> 1;
      v1 = v1 + v2 + 1 >> 1;
      v2 = t;
      t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
      v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
      v7 = t;
      t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
      v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
      v6 = t;

      // stage 1
      p[0 * 8 + col] = v0 + v7;
      p[7 * 8 + col] = v0 - v7;
      p[1 * 8 + col] = v1 + v6;
      p[6 * 8 + col] = v1 - v6;
      p[2 * 8 + col] = v2 + v5;
      p[5 * 8 + col] = v2 - v5;
      p[3 * 8 + col] = v3 + v4;
      p[4 * 8 + col] = v3 - v4;
    }

    // convert to 8-bit integers
    for (i = 0; i < 64; ++i) {
      var sample = 128 + (p[i] + 8 >> 4);
      if (sample < 0) {
        dataOut[i] = 0;
      } else if (sample > 0XFF) {
        dataOut[i] = 0xFF;
      } else {
        dataOut[i] = sample;
      }
    }
  }

  for (var blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
    var scanLine = blockRow << 3;
    for (var i = 0; i < 8; i++) {
      lines.push(new Uint8Array(samplesPerLine));
    }
    for (var blockCol = 0; blockCol < blocksPerLine; blockCol++) {
      quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);

      var offset = 0;
      var sample = blockCol << 3;
      for (var j = 0; j < 8; j++) {
        var line = lines[scanLine + j];
        for (var _i = 0; _i < 8; _i++) {
          line[sample + _i] = r[offset++];
        }
      }
    }
  }
  return lines;
}

var JpegStreamReader = function () {
  function JpegStreamReader() {
    (0, _classCallCheck3.default)(this, JpegStreamReader);

    this.jfif = null;
    this.adobe = null;

    this.quantizationTables = [];
    this.huffmanTablesAC = [];
    this.huffmanTablesDC = [];
    this.resetFrames();
  }

  (0, _createClass3.default)(JpegStreamReader, [{
    key: 'resetFrames',
    value: function resetFrames() {
      this.frames = [];
    }
  }, {
    key: 'parse',
    value: function parse(data) {
      var offset = 0;
      // const { length } = data;
      function readUint16() {
        var value = data[offset] << 8 | data[offset + 1];
        offset += 2;
        return value;
      }
      function readDataBlock() {
        var length = readUint16();
        var array = data.subarray(offset, offset + length - 2);
        offset += array.length;
        return array;
      }
      function prepareComponents(frame) {
        var maxH = 0;
        var maxV = 0;
        var component = void 0;
        var componentId = void 0;
        for (componentId in frame.components) {
          if (frame.components.hasOwnProperty(componentId)) {
            component = frame.components[componentId];
            if (maxH < component.h) maxH = component.h;
            if (maxV < component.v) maxV = component.v;
          }
        }
        var mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / maxH);
        var mcusPerColumn = Math.ceil(frame.scanLines / 8 / maxV);
        for (componentId in frame.components) {
          if (frame.components.hasOwnProperty(componentId)) {
            component = frame.components[componentId];
            var blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / maxH);
            var blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines / 8) * component.v / maxV);
            var blocksPerLineForMcu = mcusPerLine * component.h;
            var blocksPerColumnForMcu = mcusPerColumn * component.v;
            var blocks = [];
            for (var i = 0; i < blocksPerColumnForMcu; i++) {
              var row = [];
              for (var j = 0; j < blocksPerLineForMcu; j++) {
                row.push(new Int32Array(64));
              }
              blocks.push(row);
            }
            component.blocksPerLine = blocksPerLine;
            component.blocksPerColumn = blocksPerColumn;
            component.blocks = blocks;
          }
        }
        frame.maxH = maxH;
        frame.maxV = maxV;
        frame.mcusPerLine = mcusPerLine;
        frame.mcusPerColumn = mcusPerColumn;
      }

      var fileMarker = readUint16();
      if (fileMarker !== 0xFFD8) {
        // SOI (Start of Image)
        throw new Error('SOI not found');
      }

      fileMarker = readUint16();
      while (fileMarker !== 0xFFD9) {
        // EOI (End of image)
        switch (fileMarker) {
          case 0xFF00:
            break;
          case 0xFFE0: // APP0 (Application Specific)
          case 0xFFE1: // APP1
          case 0xFFE2: // APP2
          case 0xFFE3: // APP3
          case 0xFFE4: // APP4
          case 0xFFE5: // APP5
          case 0xFFE6: // APP6
          case 0xFFE7: // APP7
          case 0xFFE8: // APP8
          case 0xFFE9: // APP9
          case 0xFFEA: // APP10
          case 0xFFEB: // APP11
          case 0xFFEC: // APP12
          case 0xFFED: // APP13
          case 0xFFEE: // APP14
          case 0xFFEF: // APP15
          case 0xFFFE:
            {
              // COM (Comment)
              var appData = readDataBlock();

              if (fileMarker === 0xFFE0) {
                if (appData[0] === 0x4A && appData[1] === 0x46 && appData[2] === 0x49 && appData[3] === 0x46 && appData[4] === 0) {
                  // 'JFIF\x00'
                  this.jfif = {
                    version: { major: appData[5], minor: appData[6] },
                    densityUnits: appData[7],
                    xDensity: appData[8] << 8 | appData[9],
                    yDensity: appData[10] << 8 | appData[11],
                    thumbWidth: appData[12],
                    thumbHeight: appData[13],
                    thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                  };
                }
              }
              // TODO APP1 - Exif
              if (fileMarker === 0xFFEE) {
                if (appData[0] === 0x41 && appData[1] === 0x64 && appData[2] === 0x6F && appData[3] === 0x62 && appData[4] === 0x65 && appData[5] === 0) {
                  // 'Adobe\x00'
                  this.adobe = {
                    version: appData[6],
                    flags0: appData[7] << 8 | appData[8],
                    flags1: appData[9] << 8 | appData[10],
                    transformCode: appData[11]
                  };
                }
              }
              break;
            }

          case 0xFFDB:
            {
              // DQT (Define Quantization Tables)
              var quantizationTablesLength = readUint16();
              var quantizationTablesEnd = quantizationTablesLength + offset - 2;
              while (offset < quantizationTablesEnd) {
                var quantizationTableSpec = data[offset++];
                var tableData = new Int32Array(64);
                if (quantizationTableSpec >> 4 === 0) {
                  // 8 bit values
                  for (var j = 0; j < 64; j++) {
                    var z = dctZigZag[j];
                    tableData[z] = data[offset++];
                  }
                } else if (quantizationTableSpec >> 4 === 1) {
                  // 16 bit
                  for (var _j = 0; _j < 64; _j++) {
                    var _z = dctZigZag[_j];
                    tableData[_z] = readUint16();
                  }
                } else {
                  throw new Error('DQT: invalid table spec');
                }
                this.quantizationTables[quantizationTableSpec & 15] = tableData;
              }
              break;
            }

          case 0xFFC0: // SOF0 (Start of Frame, Baseline DCT)
          case 0xFFC1: // SOF1 (Start of Frame, Extended DCT)
          case 0xFFC2:
            {
              // SOF2 (Start of Frame, Progressive DCT)
              readUint16(); // skip data length
              var frame = {
                extended: fileMarker === 0xFFC1,
                progressive: fileMarker === 0xFFC2,
                precision: data[offset++],
                scanLines: readUint16(),
                samplesPerLine: readUint16(),
                components: {},
                componentsOrder: []
              };

              var componentsCount = data[offset++];
              var componentId = void 0;
              // let maxH = 0;
              // let maxV = 0;
              for (var i = 0; i < componentsCount; i++) {
                componentId = data[offset];
                var h = data[offset + 1] >> 4;
                var v = data[offset + 1] & 15;
                var qId = data[offset + 2];
                frame.componentsOrder.push(componentId);
                frame.components[componentId] = {
                  h: h,
                  v: v,
                  quantizationIdx: qId
                };
                offset += 3;
              }
              prepareComponents(frame);
              this.frames.push(frame);
              break;
            }

          case 0xFFC4:
            {
              // DHT (Define Huffman Tables)
              var huffmanLength = readUint16();
              for (var _i2 = 2; _i2 < huffmanLength;) {
                var huffmanTableSpec = data[offset++];
                var codeLengths = new Uint8Array(16);
                var codeLengthSum = 0;
                for (var _j2 = 0; _j2 < 16; _j2++, offset++) {
                  codeLengths[_j2] = data[offset];
                  codeLengthSum += codeLengths[_j2];
                }
                var huffmanValues = new Uint8Array(codeLengthSum);
                for (var _j3 = 0; _j3 < codeLengthSum; _j3++, offset++) {
                  huffmanValues[_j3] = data[offset];
                }
                _i2 += 17 + codeLengthSum;

                if (huffmanTableSpec >> 4 === 0) {
                  this.huffmanTablesDC[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
                } else {
                  this.huffmanTablesAC[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
                }
              }
              break;
            }

          case 0xFFDD:
            // DRI (Define Restart Interval)
            readUint16(); // skip data length
            this.resetInterval = readUint16();
            break;

          case 0xFFDA:
            {
              // SOS (Start of Scan)
              readUint16(); // skip length
              var selectorsCount = data[offset++];
              var components = [];
              var _frame = this.frames[0];
              for (var _i3 = 0; _i3 < selectorsCount; _i3++) {
                var component = _frame.components[data[offset++]];
                var tableSpec = data[offset++];
                component.huffmanTableDC = this.huffmanTablesDC[tableSpec >> 4];
                component.huffmanTableAC = this.huffmanTablesAC[tableSpec & 15];
                components.push(component);
              }
              var spectralStart = data[offset++];
              var spectralEnd = data[offset++];
              var successiveApproximation = data[offset++];
              var processed = decodeScan(data, offset, _frame, components, this.resetInterval, spectralStart, spectralEnd, successiveApproximation >> 4, successiveApproximation & 15);
              offset += processed;
              break;
            }

          case 0xFFFF:
            // Fill bytes
            if (data[offset] !== 0xFF) {
              // Avoid skipping a valid marker.
              offset--;
            }
            break;

          default:
            if (data[offset - 3] === 0xFF && data[offset - 2] >= 0xC0 && data[offset - 2] <= 0xFE) {
              // could be incorrect encoding -- last 0xFF byte of the previous
              // block was eaten by the encoder
              offset -= 3;
              break;
            }
            throw new Error('unknown JPEG marker ' + fileMarker.toString(16));
        }
        fileMarker = readUint16();
      }
    }
  }, {
    key: 'getResult',
    value: function getResult() {
      var frames = this.frames;

      if (this.frames.length === 0) {
        throw new Error('no frames were decoded');
      } else if (this.frames.length > 1) {
        console.warn('more than one frame is not supported');
      }

      // set each frame's components quantization table
      for (var i = 0; i < this.frames.length; i++) {
        var cp = this.frames[i].components;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(cp)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var j = _step.value;

            cp[j].quantizationTable = this.quantizationTables[cp[j].quantizationIdx];
            delete cp[j].quantizationIdx;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      var frame = frames[0];
      var components = frame.components,
          componentsOrder = frame.componentsOrder;

      var outComponents = [];
      var width = frame.samplesPerLine;
      var height = frame.scanLines;

      for (var _i4 = 0; _i4 < componentsOrder.length; _i4++) {
        var component = components[componentsOrder[_i4]];
        outComponents.push({
          lines: buildComponentData(frame, component),
          scaleX: component.h / frame.maxH,
          scaleY: component.v / frame.maxV
        });
      }

      var out = new Uint8Array(width * height * outComponents.length);
      var oi = 0;
      for (var y = 0; y < height; ++y) {
        for (var x = 0; x < width; ++x) {
          for (var _i5 = 0; _i5 < outComponents.length; ++_i5) {
            var _component2 = outComponents[_i5];
            out[oi] = _component2.lines[0 | y * _component2.scaleY][0 | x * _component2.scaleX];
            ++oi;
          }
        }
      }
      return out;
    }
  }]);
  return JpegStreamReader;
}();

var JpegDecoder = function (_BaseDecoder) {
  (0, _inherits3.default)(JpegDecoder, _BaseDecoder);

  function JpegDecoder(fileDirectory) {
    (0, _classCallCheck3.default)(this, JpegDecoder);

    var _this = (0, _possibleConstructorReturn3.default)(this, (JpegDecoder.__proto__ || Object.getPrototypeOf(JpegDecoder)).call(this));

    _this.reader = new JpegStreamReader();
    if (fileDirectory.JPEGTables) {
      _this.reader.parse(fileDirectory.JPEGTables);
    }
    return _this;
  }

  (0, _createClass3.default)(JpegDecoder, [{
    key: 'decodeBlock',
    value: function decodeBlock(buffer) {
      this.reader.resetFrames();
      this.reader.parse(new Uint8Array(buffer));
      return this.reader.getResult().buffer;
    }
  }]);
  return JpegDecoder;
}(_basedecoder2.default);

exports.default = JpegDecoder;