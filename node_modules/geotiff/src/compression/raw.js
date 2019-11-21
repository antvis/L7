import BaseDecoder from './basedecoder';


export default class RawDecoder extends BaseDecoder {
  decodeBlock(buffer) {
    return buffer;
  }
}
