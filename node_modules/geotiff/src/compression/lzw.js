import BaseDecoder from './basedecoder';


const MIN_BITS = 9;
const CLEAR_CODE = 256; // clear code
const EOI_CODE = 257; // end of information

function getByte(array, position, length) {
  const d = position % 8;
  const a = Math.floor(position / 8);
  const de = 8 - d;
  const ef = (position + length) - ((a + 1) * 8);
  let fg = (8 * (a + 2)) - (position + length);
  const dg = ((a + 2) * 8) - position;
  fg = Math.max(0, fg);
  if (a >= array.length) {
    console.warn('ran off the end of the buffer before finding EOI_CODE (end on input code)');
    return EOI_CODE;
  }
  let chunk1 = array[a] & ((2 ** (8 - d)) - 1);
  chunk1 <<= (length - de);
  let chunks = chunk1;
  if (a + 1 < array.length) {
    let chunk2 = array[a + 1] >>> fg;
    chunk2 <<= Math.max(0, (length - dg));
    chunks += chunk2;
  }
  if (ef > 8 && a + 2 < array.length) {
    const hi = ((a + 3) * 8) - (position + length);
    const chunk3 = array[a + 2] >>> hi;
    chunks += chunk3;
  }
  return chunks;
}

function appendReversed(dest, source) {
  for (let i = source.length - 1; i >= 0; i--) {
    dest.push(source[i]);
  }
  return dest;
}

function decompress(input) {
  const dictionaryIndex = new Uint16Array(4093);
  const dictionaryChar = new Uint8Array(4093);
  for (let i = 0; i <= 257; i++) {
    dictionaryIndex[i] = 4096;
    dictionaryChar[i] = i;
  }
  let dictionaryLength = 258;
  let byteLength = MIN_BITS;
  let position = 0;

  function initDictionary() {
    dictionaryLength = 258;
    byteLength = MIN_BITS;
  }
  function getNext(array) {
    const byte = getByte(array, position, byteLength);
    position += byteLength;
    return byte;
  }
  function addToDictionary(i, c) {
    dictionaryChar[dictionaryLength] = c;
    dictionaryIndex[dictionaryLength] = i;
    dictionaryLength++;
    if (dictionaryLength >= (2 ** byteLength)) {
      byteLength++;
    }
    return dictionaryLength - 1;
  }
  function getDictionaryReversed(n) {
    const rev = [];
    for (let i = n; i !== 4096; i = dictionaryIndex[i]) {
      rev.push(dictionaryChar[i]);
    }
    return rev;
  }

  const result = [];
  initDictionary();
  const array = new Uint8Array(input);
  let code = getNext(array);
  let oldCode;
  while (code !== EOI_CODE) {
    if (code === CLEAR_CODE) {
      initDictionary();
      code = getNext(array);
      while (code === CLEAR_CODE) {
        code = getNext(array);
      }
      if (code > CLEAR_CODE) {
        throw new Error(`corrupted code at scanline ${code}`);
      }
      if (code === EOI_CODE) {
        break;
      } else {
        const val = getDictionaryReversed(code);
        appendReversed(result, val);
        oldCode = code;
      }
    } else if (code < dictionaryLength) {
      const val = getDictionaryReversed(code);
      appendReversed(result, val);
      addToDictionary(oldCode, val[val.length - 1]);
      oldCode = code;
    } else {
      const oldVal = getDictionaryReversed(oldCode);
      if (!oldVal) {
        throw new Error(`Bogus entry. Not in dictionary, ${oldCode} / ${dictionaryLength}, position: ${position}`);
      }
      appendReversed(result, oldVal);
      result.push(oldVal[oldVal.length - 1]);
      addToDictionary(oldCode, oldVal[oldVal.length - 1]);
      oldCode = code;
    }

    if (dictionaryLength >= (2 ** byteLength) - 1) {
      byteLength++;
    }
    code = getNext(array);
  }
  return new Uint8Array(result);
}

export default class LZWDecoder extends BaseDecoder {
  decodeBlock(buffer) {
    return decompress(buffer, false).buffer;
  }
}
