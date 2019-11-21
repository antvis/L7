import BaseDecoder from './basedecoder';

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


const dctZigZag = new Int32Array([
  0,
  1, 8,
  16, 9, 2,
  3, 10, 17, 24,
  32, 25, 18, 11, 4,
  5, 12, 19, 26, 33, 40,
  48, 41, 34, 27, 20, 13, 6,
  7, 14, 21, 28, 35, 42, 49, 56,
  57, 50, 43, 36, 29, 22, 15,
  23, 30, 37, 44, 51, 58,
  59, 52, 45, 38, 31,
  39, 46, 53, 60,
  61, 54, 47,
  55, 62,
  63,
]);

const dctCos1 = 4017; // cos(pi/16)
const dctSin1 = 799; // sin(pi/16)
const dctCos3 = 3406; // cos(3*pi/16)
const dctSin3 = 2276; // sin(3*pi/16)
const dctCos6 = 1567; // cos(6*pi/16)
const dctSin6 = 3784; // sin(6*pi/16)
const dctSqrt2 = 5793; // sqrt(2)
const dctSqrt1d2 = 2896;// sqrt(2) / 2

function buildHuffmanTable(codeLengths, values) {
  let k = 0;
  const code = [];
  let length = 16;
  while (length > 0 && !codeLengths[length - 1]) {
    --length;
  }
  code.push({ children: [], index: 0 });

  let p = code[0];
  let q;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < codeLengths[i]; j++) {
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

function decodeScan(data, initialOffset,
  frame, components, resetInterval,
  spectralStart, spectralEnd,
  successivePrev, successive) {
  const { mcusPerLine, progressive } = frame;

  const startOffset = initialOffset;
  let offset = initialOffset;
  let bitsData = 0;
  let bitsCount = 0;
  function readBit() {
    if (bitsCount > 0) {
      bitsCount--;
      return (bitsData >> bitsCount) & 1;
    }
    bitsData = data[offset++];
    if (bitsData === 0xFF) {
      const nextByte = data[offset++];
      if (nextByte) {
        throw new Error(`unexpected marker: ${((bitsData << 8) | nextByte).toString(16)}`);
      }
      // unstuff 0
    }
    bitsCount = 7;
    return bitsData >>> 7;
  }
  function decodeHuffman(tree) {
    let node = tree;
    let bit;
    while ((bit = readBit()) !== null) { // eslint-disable-line no-cond-assign
      node = node[bit];
      if (typeof node === 'number') {
        return node;
      }
      if (typeof node !== 'object') {
        throw new Error('invalid huffman sequence');
      }
    }
    return null;
  }
  function receive(initialLength) {
    let length = initialLength;
    let n = 0;
    while (length > 0) {
      const bit = readBit();
      if (bit === null) {
        return undefined;
      }
      n = (n << 1) | bit;
      --length;
    }
    return n;
  }
  function receiveAndExtend(length) {
    const n = receive(length);
    if (n >= 1 << (length - 1)) {
      return n;
    }
    return n + (-1 << length) + 1;
  }
  function decodeBaseline(component, zz) {
    const t = decodeHuffman(component.huffmanTableDC);
    const diff = t === 0 ? 0 : receiveAndExtend(t);
    component.pred += diff;
    zz[0] = component.pred;
    let k = 1;
    while (k < 64) {
      const rs = decodeHuffman(component.huffmanTableAC);
      const s = rs & 15;
      const r = rs >> 4;
      if (s === 0) {
        if (r < 15) {
          break;
        }
        k += 16;
      } else {
        k += r;
        const z = dctZigZag[k];
        zz[z] = receiveAndExtend(s);
        k++;
      }
    }
  }
  function decodeDCFirst(component, zz) {
    const t = decodeHuffman(component.huffmanTableDC);
    const diff = t === 0 ? 0 : (receiveAndExtend(t) << successive);
    component.pred += diff;
    zz[0] = component.pred;
  }
  function decodeDCSuccessive(component, zz) {
    zz[0] |= readBit() << successive;
  }
  let eobrun = 0;
  function decodeACFirst(component, zz) {
    if (eobrun > 0) {
      eobrun--;
      return;
    }
    let k = spectralStart;
    const e = spectralEnd;
    while (k <= e) {
      const rs = decodeHuffman(component.huffmanTableAC);
      const s = rs & 15;
      const r = rs >> 4;
      if (s === 0) {
        if (r < 15) {
          eobrun = receive(r) + (1 << r) - 1;
          break;
        }
        k += 16;
      } else {
        k += r;
        const z = dctZigZag[k];
        zz[z] = receiveAndExtend(s) * (1 << successive);
        k++;
      }
    }
  }
  let successiveACState = 0;
  let successiveACNextValue;
  function decodeACSuccessive(component, zz) {
    let k = spectralStart;
    const e = spectralEnd;
    let r = 0;
    while (k <= e) {
      const z = dctZigZag[k];
      const direction = zz[z] < 0 ? -1 : 1;
      switch (successiveACState) {
        case 0: { // initial state
          const rs = decodeHuffman(component.huffmanTableAC);
          const s = rs & 15;
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
        case 3: // set value for a zero item
          if (zz[z]) {
            zz[z] += (readBit() << successive) * direction;
          } else {
            zz[z] = successiveACNextValue << successive;
            successiveACState = 0;
          }
          break;
        case 4: // eob
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
    const mcuRow = (mcu / mcusPerLine) | 0;
    const mcuCol = mcu % mcusPerLine;
    const blockRow = (mcuRow * component.v) + row;
    const blockCol = (mcuCol * component.h) + col;
    decodeFunction(component, component.blocks[blockRow][blockCol]);
  }
  function decodeBlock(component, decodeFunction, mcu) {
    const blockRow = (mcu / component.blocksPerLine) | 0;
    const blockCol = mcu % component.blocksPerLine;
    decodeFunction(component, component.blocks[blockRow][blockCol]);
  }

  const componentsLength = components.length;
  let component;
  let i;
  let j;
  let k;
  let n;
  let decodeFn;
  if (progressive) {
    if (spectralStart === 0) {
      decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
    } else {
      decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
    }
  } else {
    decodeFn = decodeBaseline;
  }

  let mcu = 0;
  let marker;
  let mcuExpected;
  if (componentsLength === 1) {
    mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
  } else {
    mcuExpected = mcusPerLine * frame.mcusPerColumn;
  }

  const usedResetInterval = resetInterval || mcuExpected;

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
          const { h, v } = component;
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
    marker = (data[offset] << 8) | data[offset + 1];
    if (marker < 0xFF00) {
      throw new Error('marker was not found');
    }

    if (marker >= 0xFFD0 && marker <= 0xFFD7) { // RSTx
      offset += 2;
    } else {
      break;
    }
  }

  return offset - startOffset;
}

function buildComponentData(frame, component) {
  const lines = [];
  const { blocksPerLine, blocksPerColumn } = component;
  const samplesPerLine = blocksPerLine << 3;
  const R = new Int32Array(64);
  const r = new Uint8Array(64);

  // A port of poppler's IDCT method which in turn is taken from:
  //   Christoph Loeffler, Adriaan Ligtenberg, George S. Moschytz,
  //   "Practical Fast 1-D DCT Algorithms with 11 Multiplications",
  //   IEEE Intl. Conf. on Acoustics, Speech & Signal Processing, 1989,
  //   988-991.
  function quantizeAndInverse(zz, dataOut, dataIn) {
    const qt = component.quantizationTable;
    let v0;
    let v1;
    let v2;
    let v3;
    let v4;
    let v5;
    let v6;
    let v7;
    let t;
    const p = dataIn;
    let i;

    // dequant
    for (i = 0; i < 64; i++) {
      p[i] = zz[i] * qt[i];
    }

    // inverse DCT on rows
    for (i = 0; i < 8; ++i) {
      const row = 8 * i;

      // check for all-zero AC coefficients
      if (p[1 + row] === 0 && p[2 + row] === 0 && p[3 + row] === 0 &&
        p[4 + row] === 0 && p[5 + row] === 0 && p[6 + row] === 0 &&
        p[7 + row] === 0) {
        t = ((dctSqrt2 * p[0 + row]) + 512) >> 10;
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
      v0 = ((dctSqrt2 * p[0 + row]) + 128) >> 8;
      v1 = ((dctSqrt2 * p[4 + row]) + 128) >> 8;
      v2 = p[2 + row];
      v3 = p[6 + row];
      v4 = ((dctSqrt1d2 * (p[1 + row] - p[7 + row])) + 128) >> 8;
      v7 = ((dctSqrt1d2 * (p[1 + row] + p[7 + row])) + 128) >> 8;
      v5 = p[3 + row] << 4;
      v6 = p[5 + row] << 4;

      // stage 3
      t = (v0 - v1 + 1) >> 1;
      v0 = (v0 + v1 + 1) >> 1;
      v1 = t;
      t = ((v2 * dctSin6) + (v3 * dctCos6) + 128) >> 8;
      v2 = ((v2 * dctCos6) - (v3 * dctSin6) + 128) >> 8;
      v3 = t;
      t = (v4 - v6 + 1) >> 1;
      v4 = (v4 + v6 + 1) >> 1;
      v6 = t;
      t = (v7 + v5 + 1) >> 1;
      v5 = (v7 - v5 + 1) >> 1;
      v7 = t;

      // stage 2
      t = (v0 - v3 + 1) >> 1;
      v0 = (v0 + v3 + 1) >> 1;
      v3 = t;
      t = (v1 - v2 + 1) >> 1;
      v1 = (v1 + v2 + 1) >> 1;
      v2 = t;
      t = ((v4 * dctSin3) + (v7 * dctCos3) + 2048) >> 12;
      v4 = ((v4 * dctCos3) - (v7 * dctSin3) + 2048) >> 12;
      v7 = t;
      t = ((v5 * dctSin1) + (v6 * dctCos1) + 2048) >> 12;
      v5 = ((v5 * dctCos1) - (v6 * dctSin1) + 2048) >> 12;
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
      const col = i;

      // check for all-zero AC coefficients
      if (p[(1 * 8) + col] === 0 && p[(2 * 8) + col] === 0 && p[(3 * 8) + col] === 0 &&
        p[(4 * 8) + col] === 0 && p[(5 * 8) + col] === 0 && p[(6 * 8) + col] === 0 &&
        p[(7 * 8) + col] === 0) {
        t = ((dctSqrt2 * dataIn[i + 0]) + 8192) >> 14;
        p[(0 * 8) + col] = t;
        p[(1 * 8) + col] = t;
        p[(2 * 8) + col] = t;
        p[(3 * 8) + col] = t;
        p[(4 * 8) + col] = t;
        p[(5 * 8) + col] = t;
        p[(6 * 8) + col] = t;
        p[(7 * 8) + col] = t;
        continue; // eslint-disable-line no-continue
      }

      // stage 4
      v0 = ((dctSqrt2 * p[(0 * 8) + col]) + 2048) >> 12;
      v1 = ((dctSqrt2 * p[(4 * 8) + col]) + 2048) >> 12;
      v2 = p[(2 * 8) + col];
      v3 = p[(6 * 8) + col];
      v4 = ((dctSqrt1d2 * (p[(1 * 8) + col] - p[(7 * 8) + col])) + 2048) >> 12;
      v7 = ((dctSqrt1d2 * (p[(1 * 8) + col] + p[(7 * 8) + col])) + 2048) >> 12;
      v5 = p[(3 * 8) + col];
      v6 = p[(5 * 8) + col];

      // stage 3
      t = (v0 - v1 + 1) >> 1;
      v0 = (v0 + v1 + 1) >> 1;
      v1 = t;
      t = ((v2 * dctSin6) + (v3 * dctCos6) + 2048) >> 12;
      v2 = ((v2 * dctCos6) - (v3 * dctSin6) + 2048) >> 12;
      v3 = t;
      t = (v4 - v6 + 1) >> 1;
      v4 = (v4 + v6 + 1) >> 1;
      v6 = t;
      t = (v7 + v5 + 1) >> 1;
      v5 = (v7 - v5 + 1) >> 1;
      v7 = t;

      // stage 2
      t = (v0 - v3 + 1) >> 1;
      v0 = (v0 + v3 + 1) >> 1;
      v3 = t;
      t = (v1 - v2 + 1) >> 1;
      v1 = (v1 + v2 + 1) >> 1;
      v2 = t;
      t = ((v4 * dctSin3) + (v7 * dctCos3) + 2048) >> 12;
      v4 = ((v4 * dctCos3) - (v7 * dctSin3) + 2048) >> 12;
      v7 = t;
      t = ((v5 * dctSin1) + (v6 * dctCos1) + 2048) >> 12;
      v5 = ((v5 * dctCos1) - (v6 * dctSin1) + 2048) >> 12;
      v6 = t;

      // stage 1
      p[(0 * 8) + col] = v0 + v7;
      p[(7 * 8) + col] = v0 - v7;
      p[(1 * 8) + col] = v1 + v6;
      p[(6 * 8) + col] = v1 - v6;
      p[(2 * 8) + col] = v2 + v5;
      p[(5 * 8) + col] = v2 - v5;
      p[(3 * 8) + col] = v3 + v4;
      p[(4 * 8) + col] = v3 - v4;
    }

    // convert to 8-bit integers
    for (i = 0; i < 64; ++i) {
      const sample = 128 + ((p[i] + 8) >> 4);
      if (sample < 0) {
        dataOut[i] = 0;
      } else if (sample > 0XFF) {
        dataOut[i] = 0xFF;
      } else {
        dataOut[i] = sample;
      }
    }
  }

  for (let blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
    const scanLine = blockRow << 3;
    for (let i = 0; i < 8; i++) {
      lines.push(new Uint8Array(samplesPerLine));
    }
    for (let blockCol = 0; blockCol < blocksPerLine; blockCol++) {
      quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);

      let offset = 0;
      const sample = blockCol << 3;
      for (let j = 0; j < 8; j++) {
        const line = lines[scanLine + j];
        for (let i = 0; i < 8; i++) {
          line[sample + i] = r[offset++];
        }
      }
    }
  }
  return lines;
}

class JpegStreamReader {
  constructor() {
    this.jfif = null;
    this.adobe = null;

    this.quantizationTables = [];
    this.huffmanTablesAC = [];
    this.huffmanTablesDC = [];
    this.resetFrames();
  }

  resetFrames() {
    this.frames = [];
  }

  parse(data) {
    let offset = 0;
    // const { length } = data;
    function readUint16() {
      const value = (data[offset] << 8) | data[offset + 1];
      offset += 2;
      return value;
    }
    function readDataBlock() {
      const length = readUint16();
      const array = data.subarray(offset, offset + length - 2);
      offset += array.length;
      return array;
    }
    function prepareComponents(frame) {
      let maxH = 0;
      let maxV = 0;
      let component;
      let componentId;
      for (componentId in frame.components) {
        if (frame.components.hasOwnProperty(componentId)) {
          component = frame.components[componentId];
          if (maxH < component.h) maxH = component.h;
          if (maxV < component.v) maxV = component.v;
        }
      }
      const mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / maxH);
      const mcusPerColumn = Math.ceil(frame.scanLines / 8 / maxV);
      for (componentId in frame.components) {
        if (frame.components.hasOwnProperty(componentId)) {
          component = frame.components[componentId];
          const blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / maxH);
          const blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines / 8) * component.v / maxV);
          const blocksPerLineForMcu = mcusPerLine * component.h;
          const blocksPerColumnForMcu = mcusPerColumn * component.v;
          const blocks = [];
          for (let i = 0; i < blocksPerColumnForMcu; i++) {
            const row = [];
            for (let j = 0; j < blocksPerLineForMcu; j++) {
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

    let fileMarker = readUint16();
    if (fileMarker !== 0xFFD8) { // SOI (Start of Image)
      throw new Error('SOI not found');
    }

    fileMarker = readUint16();
    while (fileMarker !== 0xFFD9) { // EOI (End of image)
      switch (fileMarker) {
        case 0xFF00: break;
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
        case 0xFFFE: { // COM (Comment)
          const appData = readDataBlock();

          if (fileMarker === 0xFFE0) {
            if (appData[0] === 0x4A && appData[1] === 0x46 && appData[2] === 0x49 &&
              appData[3] === 0x46 && appData[4] === 0) { // 'JFIF\x00'
              this.jfif = {
                version: { major: appData[5], minor: appData[6] },
                densityUnits: appData[7],
                xDensity: (appData[8] << 8) | appData[9],
                yDensity: (appData[10] << 8) | appData[11],
                thumbWidth: appData[12],
                thumbHeight: appData[13],
                thumbData: appData.subarray(14, 14 + (3 * appData[12] * appData[13])),
              };
            }
          }
          // TODO APP1 - Exif
          if (fileMarker === 0xFFEE) {
            if (appData[0] === 0x41 && appData[1] === 0x64 && appData[2] === 0x6F &&
              appData[3] === 0x62 && appData[4] === 0x65 && appData[5] === 0) { // 'Adobe\x00'
              this.adobe = {
                version: appData[6],
                flags0: (appData[7] << 8) | appData[8],
                flags1: (appData[9] << 8) | appData[10],
                transformCode: appData[11],
              };
            }
          }
          break;
        }

        case 0xFFDB: { // DQT (Define Quantization Tables)
          const quantizationTablesLength = readUint16();
          const quantizationTablesEnd = quantizationTablesLength + offset - 2;
          while (offset < quantizationTablesEnd) {
            const quantizationTableSpec = data[offset++];
            const tableData = new Int32Array(64);
            if ((quantizationTableSpec >> 4) === 0) { // 8 bit values
              for (let j = 0; j < 64; j++) {
                const z = dctZigZag[j];
                tableData[z] = data[offset++];
              }
            } else if ((quantizationTableSpec >> 4) === 1) { // 16 bit
              for (let j = 0; j < 64; j++) {
                const z = dctZigZag[j];
                tableData[z] = readUint16();
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
        case 0xFFC2: { // SOF2 (Start of Frame, Progressive DCT)
          readUint16(); // skip data length
          const frame = {
            extended: (fileMarker === 0xFFC1),
            progressive: (fileMarker === 0xFFC2),
            precision: data[offset++],
            scanLines: readUint16(),
            samplesPerLine: readUint16(),
            components: {},
            componentsOrder: [],
          };

          const componentsCount = data[offset++];
          let componentId;
          // let maxH = 0;
          // let maxV = 0;
          for (let i = 0; i < componentsCount; i++) {
            componentId = data[offset];
            const h = data[offset + 1] >> 4;
            const v = data[offset + 1] & 15;
            const qId = data[offset + 2];
            frame.componentsOrder.push(componentId);
            frame.components[componentId] = {
              h,
              v,
              quantizationIdx: qId,
            };
            offset += 3;
          }
          prepareComponents(frame);
          this.frames.push(frame);
          break;
        }

        case 0xFFC4: { // DHT (Define Huffman Tables)
          const huffmanLength = readUint16();
          for (let i = 2; i < huffmanLength;) {
            const huffmanTableSpec = data[offset++];
            const codeLengths = new Uint8Array(16);
            let codeLengthSum = 0;
            for (let j = 0; j < 16; j++, offset++) {
              codeLengths[j] = data[offset];
              codeLengthSum += codeLengths[j];
            }
            const huffmanValues = new Uint8Array(codeLengthSum);
            for (let j = 0; j < codeLengthSum; j++, offset++) {
              huffmanValues[j] = data[offset];
            }
            i += 17 + codeLengthSum;

            if ((huffmanTableSpec >> 4) === 0) {
              this.huffmanTablesDC[huffmanTableSpec & 15] = buildHuffmanTable(
                codeLengths, huffmanValues,
              );
            } else {
              this.huffmanTablesAC[huffmanTableSpec & 15] = buildHuffmanTable(
                codeLengths, huffmanValues,
              );
            }
          }
          break;
        }

        case 0xFFDD: // DRI (Define Restart Interval)
          readUint16(); // skip data length
          this.resetInterval = readUint16();
          break;

        case 0xFFDA: { // SOS (Start of Scan)
          readUint16(); // skip length
          const selectorsCount = data[offset++];
          const components = [];
          const frame = this.frames[0];
          for (let i = 0; i < selectorsCount; i++) {
            const component = frame.components[data[offset++]];
            const tableSpec = data[offset++];
            component.huffmanTableDC = this.huffmanTablesDC[tableSpec >> 4];
            component.huffmanTableAC = this.huffmanTablesAC[tableSpec & 15];
            components.push(component);
          }
          const spectralStart = data[offset++];
          const spectralEnd = data[offset++];
          const successiveApproximation = data[offset++];
          const processed = decodeScan(data, offset,
            frame, components, this.resetInterval,
            spectralStart, spectralEnd,
            successiveApproximation >> 4, successiveApproximation & 15);
          offset += processed;
          break;
        }

        case 0xFFFF: // Fill bytes
          if (data[offset] !== 0xFF) { // Avoid skipping a valid marker.
            offset--;
          }
          break;

        default:
          if (data[offset - 3] === 0xFF &&
            data[offset - 2] >= 0xC0 && data[offset - 2] <= 0xFE) {
            // could be incorrect encoding -- last 0xFF byte of the previous
            // block was eaten by the encoder
            offset -= 3;
            break;
          }
          throw new Error(`unknown JPEG marker ${fileMarker.toString(16)}`);
      }
      fileMarker = readUint16();
    }
  }

  getResult() {
    const { frames } = this;
    if (this.frames.length === 0) {
      throw new Error('no frames were decoded');
    } else if (this.frames.length > 1) {
      console.warn('more than one frame is not supported');
    }

    // set each frame's components quantization table
    for (let i = 0; i < this.frames.length; i++) {
      const cp = this.frames[i].components;
      for (const j of Object.keys(cp)) {
        cp[j].quantizationTable = this.quantizationTables[cp[j].quantizationIdx];
        delete cp[j].quantizationIdx;
      }
    }

    const frame = frames[0];
    const { components, componentsOrder } = frame;
    const outComponents = [];
    const width = frame.samplesPerLine;
    const height = frame.scanLines;

    for (let i = 0; i < componentsOrder.length; i++) {
      const component = components[componentsOrder[i]];
      outComponents.push({
        lines: buildComponentData(frame, component),
        scaleX: component.h / frame.maxH,
        scaleY: component.v / frame.maxV,
      });
    }

    const out = new Uint8Array(width * height * outComponents.length);
    let oi = 0;
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        for (let i = 0; i < outComponents.length; ++i) {
          const component = outComponents[i];
          out[oi] = component.lines[0 | y * component.scaleY][0 | x * component.scaleX];
          ++oi;
        }
      }
    }
    return out;
  }
}

export default class JpegDecoder extends BaseDecoder {
  constructor(fileDirectory) {
    super();
    this.reader = new JpegStreamReader();
    if (fileDirectory.JPEGTables) {
      this.reader.parse(fileDirectory.JPEGTables);
    }
  }

  decodeBlock(buffer) {
    this.reader.resetFrames();
    this.reader.parse(new Uint8Array(buffer));
    return this.reader.getResult().buffer;
  }
}
