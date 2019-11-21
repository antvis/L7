import { inflate } from 'pako/lib/inflate';
import BaseDecoder from './basedecoder';


export default class DeflateDecoder extends BaseDecoder {
  decodeBlock(buffer) {
    return inflate(new Uint8Array(buffer)).buffer;
  }
}
