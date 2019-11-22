import { applyPredictor } from '../predictor';

export default class BaseDecoder {
  decode(fileDirectory, buffer) {
    const decoded = this.decodeBlock(buffer);
    const predictor = fileDirectory.Predictor || 1;
    if (predictor !== 1) {
      const isTiled = !fileDirectory.StripOffsets;
      const tileWidth = isTiled ? fileDirectory.TileWidth : fileDirectory.ImageWidth;
      const tileHeight = isTiled ? fileDirectory.TileLength : fileDirectory.RowsPerStrip;
      return applyPredictor(
        decoded, predictor, tileWidth, tileHeight, fileDirectory.BitsPerSample,
      );
    }
    return decoded;
  }
}
