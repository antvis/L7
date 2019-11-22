/* eslint max-len: ["error", { "code": 120 }] */

import { photometricInterpretations, parseXml } from './globals';
import { fromWhiteIsZero, fromBlackIsZero, fromPalette, fromCMYK, fromYCbCr, fromCIELab } from './rgb';
import { getDecoder } from './compression';
import { resample, resampleInterleaved } from './resample';

function sum(array, start, end) {
  let s = 0;
  for (let i = start; i < end; ++i) {
    s += array[i];
  }
  return s;
}

function arrayForType(format, bitsPerSample, size) {
  switch (format) {
    case 1: // unsigned integer data
      switch (bitsPerSample) {
        case 8:
          return new Uint8Array(size);
        case 16:
          return new Uint16Array(size);
        case 32:
          return new Uint32Array(size);
        default:
          break;
      }
      break;
    case 2: // twos complement signed integer data
      switch (bitsPerSample) {
        case 8:
          return new Int8Array(size);
        case 16:
          return new Int16Array(size);
        case 32:
          return new Int32Array(size);
        default:
          break;
      }
      break;
    case 3: // floating point data
      switch (bitsPerSample) {
        case 32:
          return new Float32Array(size);
        case 64:
          return new Float64Array(size);
        default:
          break;
      }
      break;
    default:
      break;
  }
  throw Error('Unsupported data format/bitsPerSample');
}

/**
 * GeoTIFF sub-file image.
 */
class GeoTIFFImage {
  /**
   * @constructor
   * @param {Object} fileDirectory The parsed file directory
   * @param {Object} geoKeys The parsed geo-keys
   * @param {DataView} dataView The DataView for the underlying file.
   * @param {Boolean} littleEndian Whether the file is encoded in little or big endian
   * @param {Boolean} cache Whether or not decoded tiles shall be cached
   * @param {Source} source The datasource to read from
   */
  constructor(fileDirectory, geoKeys, dataView, littleEndian, cache, source) {
    this.fileDirectory = fileDirectory;
    this.geoKeys = geoKeys;
    this.dataView = dataView;
    this.littleEndian = littleEndian;
    this.tiles = cache ? {} : null;
    this.isTiled = !fileDirectory.StripOffsets;
    const planarConfiguration = fileDirectory.PlanarConfiguration;
    this.planarConfiguration = (typeof planarConfiguration === 'undefined') ? 1 : planarConfiguration;
    if (this.planarConfiguration !== 1 && this.planarConfiguration !== 2) {
      throw new Error('Invalid planar configuration.');
    }

    this.source = source;
  }

  /**
   * Returns the associated parsed file directory.
   * @returns {Object} the parsed file directory
   */
  getFileDirectory() {
    return this.fileDirectory;
  }
  /**
   * Returns the associated parsed geo keys.
   * @returns {Object} the parsed geo keys
   */
  getGeoKeys() {
    return this.geoKeys;
  }
  /**
   * Returns the width of the image.
   * @returns {Number} the width of the image
   */
  getWidth() {
    return this.fileDirectory.ImageWidth;
  }
  /**
   * Returns the height of the image.
   * @returns {Number} the height of the image
   */
  getHeight() {
    return this.fileDirectory.ImageLength;
  }
  /**
   * Returns the number of samples per pixel.
   * @returns {Number} the number of samples per pixel
   */
  getSamplesPerPixel() {
    return this.fileDirectory.SamplesPerPixel;
  }
  /**
   * Returns the width of each tile.
   * @returns {Number} the width of each tile
   */
  getTileWidth() {
    return this.isTiled ? this.fileDirectory.TileWidth : this.getWidth();
  }
  /**
   * Returns the height of each tile.
   * @returns {Number} the height of each tile
   */
  getTileHeight() {
    return this.isTiled ? this.fileDirectory.TileLength : this.fileDirectory.RowsPerStrip;
  }

  /**
   * Calculates the number of bytes for each pixel across all samples. Only full
   * bytes are supported, an exception is thrown when this is not the case.
   * @returns {Number} the bytes per pixel
   */
  getBytesPerPixel() {
    let bitsPerSample = 0;
    for (let i = 0; i < this.fileDirectory.BitsPerSample.length; ++i) {
      const bits = this.fileDirectory.BitsPerSample[i];
      if ((bits % 8) !== 0) {
        throw new Error(`Sample bit-width of ${bits} is not supported.`);
      } else if (bits !== this.fileDirectory.BitsPerSample[0]) {
        throw new Error('Differing size of samples in a pixel are not supported.');
      }
      bitsPerSample += bits;
    }
    return bitsPerSample / 8;
  }

  getSampleByteSize(i) {
    if (i >= this.fileDirectory.BitsPerSample.length) {
      throw new RangeError(`Sample index ${i} is out of range.`);
    }
    const bits = this.fileDirectory.BitsPerSample[i];
    if ((bits % 8) !== 0) {
      throw new Error(`Sample bit-width of ${bits} is not supported.`);
    }
    return (bits / 8);
  }

  getReaderForSample(sampleIndex) {
    const format = this.fileDirectory.SampleFormat ?
      this.fileDirectory.SampleFormat[sampleIndex] : 1;
    const bitsPerSample = this.fileDirectory.BitsPerSample[sampleIndex];
    switch (format) {
      case 1: // unsigned integer data
        switch (bitsPerSample) {
          case 8:
            return DataView.prototype.getUint8;
          case 16:
            return DataView.prototype.getUint16;
          case 32:
            return DataView.prototype.getUint32;
          default:
            break;
        }
        break;
      case 2: // twos complement signed integer data
        switch (bitsPerSample) {
          case 8:
            return DataView.prototype.getInt8;
          case 16:
            return DataView.prototype.getInt16;
          case 32:
            return DataView.prototype.getInt32;
          default:
            break;
        }
        break;
      case 3:
        switch (bitsPerSample) {
          case 32:
            return DataView.prototype.getFloat32;
          case 64:
            return DataView.prototype.getFloat64;
          default:
            break;
        }
        break;
      default:
        break;
    }
    throw Error('Unsupported data format/bitsPerSample');
  }

  getArrayForSample(sampleIndex, size) {
    const format = this.fileDirectory.SampleFormat ?
      this.fileDirectory.SampleFormat[sampleIndex] : 1;
    const bitsPerSample = this.fileDirectory.BitsPerSample[sampleIndex];
    return arrayForType(format, bitsPerSample, size);
  }

  /**
   * Returns the decoded strip or tile.
   * @param {Number} x the strip or tile x-offset
   * @param {Number} y the tile y-offset (0 for stripped images)
   * @param {Number} sample the sample to get for separated samples
   * @param {Pool|AbstractDecoder} poolOrDecoder the decoder or decoder pool
   * @returns {Promise.<ArrayBuffer>}
   */
  async getTileOrStrip(x, y, sample, poolOrDecoder) {
    const numTilesPerRow = Math.ceil(this.getWidth() / this.getTileWidth());
    const numTilesPerCol = Math.ceil(this.getHeight() / this.getTileHeight());
    let index;
    const { tiles } = this;
    if (this.planarConfiguration === 1) {
      index = (y * numTilesPerRow) + x;
    } else if (this.planarConfiguration === 2) {
      index = (sample * numTilesPerRow * numTilesPerCol) + (y * numTilesPerRow) + x;
    }

    let offset;
    let byteCount;
    if (this.isTiled) {
      offset = this.fileDirectory.TileOffsets[index];
      byteCount = this.fileDirectory.TileByteCounts[index];
    } else {
      offset = this.fileDirectory.StripOffsets[index];
      byteCount = this.fileDirectory.StripByteCounts[index];
    }
    const slice = await this.source.fetch(offset, byteCount);

    // either use the provided pool or decoder to decode the data
    let request;
    if (tiles === null) {
      request = poolOrDecoder.decode(this.fileDirectory, slice);
    } else if (!tiles[index]) {
      request = poolOrDecoder.decode(this.fileDirectory, slice);
      tiles[index] = request;
    }
    return { x, y, sample, data: await request };
  }

  /**
   * Internal read function.
   * @private
   * @param {Array} imageWindow The image window in pixel coordinates
   * @param {Array} samples The selected samples (0-based indices)
   * @param {TypedArray[]|TypedArray} valueArrays The array(s) to write into
   * @param {Boolean} interleave Whether or not to write in an interleaved manner
   * @param {Pool} pool The decoder pool
   * @returns {Promise<TypedArray[]>|Promise<TypedArray>}
   */
  async _readRaster(imageWindow, samples, valueArrays, interleave, poolOrDecoder, width, height, resampleMethod) {
    const tileWidth = this.getTileWidth();
    const tileHeight = this.getTileHeight();

    const minXTile = Math.max(Math.floor(imageWindow[0] / tileWidth), 0);
    const maxXTile = Math.min(
      Math.ceil(imageWindow[2] / tileWidth),
      Math.ceil(this.getWidth() / this.getTileWidth()),
    );
    const minYTile = Math.max(Math.floor(imageWindow[1] / tileHeight), 0);
    const maxYTile = Math.min(
      Math.ceil(imageWindow[3] / tileHeight),
      Math.ceil(this.getHeight() / this.getTileHeight()),
    );
    const windowWidth = imageWindow[2] - imageWindow[0];

    let bytesPerPixel = this.getBytesPerPixel();

    const srcSampleOffsets = [];
    const sampleReaders = [];
    for (let i = 0; i < samples.length; ++i) {
      if (this.planarConfiguration === 1) {
        srcSampleOffsets.push(sum(this.fileDirectory.BitsPerSample, 0, samples[i]) / 8);
      } else {
        srcSampleOffsets.push(0);
      }
      sampleReaders.push(this.getReaderForSample(samples[i]));
    }

    const promises = [];
    const { littleEndian } = this;

    for (let yTile = minYTile; yTile < maxYTile; ++yTile) {
      for (let xTile = minXTile; xTile < maxXTile; ++xTile) {
        for (let sampleIndex = 0; sampleIndex < samples.length; ++sampleIndex) {
          const si = sampleIndex;
          const sample = samples[sampleIndex];
          if (this.planarConfiguration === 2) {
            bytesPerPixel = this.getSampleByteSize(sample);
          }
          const promise = this.getTileOrStrip(xTile, yTile, sample, poolOrDecoder);
          promises.push(promise);
          promise.then((tile) => {
            const buffer = tile.data;
            const dataView = new DataView(buffer);
            const firstLine = tile.y * tileHeight;
            const firstCol = tile.x * tileWidth;
            const lastLine = (tile.y + 1) * tileHeight;
            const lastCol = (tile.x + 1) * tileWidth;
            const reader = sampleReaders[si];

            const ymax = Math.min(tileHeight, tileHeight - (lastLine - imageWindow[3]));
            const xmax = Math.min(tileWidth, tileWidth - (lastCol - imageWindow[2]));

            for (let y = Math.max(0, imageWindow[1] - firstLine); y < ymax; ++y) {
              for (let x = Math.max(0, imageWindow[0] - firstCol); x < xmax; ++x) {
                const pixelOffset = ((y * tileWidth) + x) * bytesPerPixel;
                const value = reader.call(
                  dataView, pixelOffset + srcSampleOffsets[si], littleEndian,
                );
                let windowCoordinate;
                if (interleave) {
                  windowCoordinate =
                    ((y + firstLine - imageWindow[1]) * windowWidth * samples.length) +
                    ((x + firstCol - imageWindow[0]) * samples.length) +
                    si;
                  valueArrays[windowCoordinate] = value;
                } else {
                  windowCoordinate = (
                    (y + firstLine - imageWindow[1]) * windowWidth
                  ) + x + firstCol - imageWindow[0];
                  valueArrays[si][windowCoordinate] = value;
                }
              }
            }
          });
        }
      }
    }
    await Promise.all(promises);

    if ((width && (imageWindow[2] - imageWindow[0]) !== width)
        || (height && (imageWindow[3] - imageWindow[1]) !== height)) {
      let resampled;
      if (interleave) {
        resampled = resampleInterleaved(
          valueArrays,
          imageWindow[2] - imageWindow[0],
          imageWindow[3] - imageWindow[1],
          width, height,
          samples.length,
          resampleMethod,
        );
      } else {
        resampled = resample(
          valueArrays,
          imageWindow[2] - imageWindow[0],
          imageWindow[3] - imageWindow[1],
          width, height,
          resampleMethod,
        );
      }
      resampled.width = width;
      resampled.height = height;
      return resampled;
    }

    valueArrays.width = width || imageWindow[2] - imageWindow[0];
    valueArrays.height = height || imageWindow[3] - imageWindow[1];

    return valueArrays;
  }

  /**
   * Reads raster data from the image. This function reads all selected samples
   * into separate arrays of the correct type for that sample or into a single
   * combined array when `interleave` is set. When provided, only a subset
   * of the raster is read for each sample.
   *
   * @param {Object} [options] optional parameters
   * @param {Array} [options.window=whole image] the subset to read data from.
   * @param {Array} [options.samples=all samples] the selection of samples to read from.
   * @param {Boolean} [options.interleave=false] whether the data shall be read
   *                                             in one single array or separate
   *                                             arrays.
   * @param {Number} [pool=null] The optional decoder pool to use.
   * @param {number} [width] The desired width of the output. When the width is no the
   *                         same as the images, resampling will be performed.
   * @param {number} [height] The desired height of the output. When the width is no the
   *                          same as the images, resampling will be performed.
   * @param {string} [resampleMethod='nearest'] The desired resampling method.
   * @param {number|number[]} [fillValue] The value to use for parts of the image
   *                                      outside of the images extent. When multiple
   *                                      samples are requested, an array of fill values
   *                                      can be passed.
   * @returns {Promise.<(TypedArray|TypedArray[])>} the decoded arrays as a promise
   */
  async readRasters({
    window: wnd, samples = [], interleave, pool = null,
    width, height, resampleMethod, fillValue,
  } = {}) {
    const imageWindow = wnd || [0, 0, this.getWidth(), this.getHeight()];

    // check parameters
    if (imageWindow[0] > imageWindow[2] || imageWindow[1] > imageWindow[3]) {
      throw new Error('Invalid subsets');
    }

    const imageWindowWidth = imageWindow[2] - imageWindow[0];
    const imageWindowHeight = imageWindow[3] - imageWindow[1];
    const numPixels = imageWindowWidth * imageWindowHeight;

    if (!samples || !samples.length) {
      for (let i = 0; i < this.fileDirectory.SamplesPerPixel; ++i) {
        samples.push(i);
      }
    } else {
      for (let i = 0; i < samples.length; ++i) {
        if (samples[i] >= this.fileDirectory.SamplesPerPixel) {
          return Promise.reject(new RangeError(`Invalid sample index '${samples[i]}'.`));
        }
      }
    }
    let valueArrays;
    if (interleave) {
      const format = this.fileDirectory.SampleFormat ?
        Math.max.apply(null, this.fileDirectory.SampleFormat) : 1;
      const bitsPerSample = Math.max.apply(null, this.fileDirectory.BitsPerSample);
      valueArrays = arrayForType(format, bitsPerSample, numPixels * samples.length);
      if (fillValue) {
        valueArrays.fill(fillValue);
      }
    } else {
      valueArrays = [];
      for (let i = 0; i < samples.length; ++i) {
        const valueArray = this.getArrayForSample(samples[i], numPixels);
        if (Array.isArray(fillValue) && i < fillValue.length) {
          valueArray.fill(fillValue[i]);
        } else if (fillValue && !Array.isArray(fillValue)) {
          valueArray.fill(fillValue);
        }
        valueArrays.push(valueArray);
      }
    }

    const poolOrDecoder = pool || getDecoder(this.fileDirectory);

    const result = await this._readRaster(
      imageWindow, samples, valueArrays, interleave, poolOrDecoder, width, height, resampleMethod,
    );
    return result;
  }

  /**
   * Reads raster data from the image as RGB. The result is always an
   * interleaved typed array.
   * Colorspaces other than RGB will be transformed to RGB, color maps expanded.
   * When no other method is applicable, the first sample is used to produce a
   * greayscale image.
   * When provided, only a subset of the raster is read for each sample.
   *
   * @param {Object} [options] optional parameters
   * @param {Array} [options.window=whole image] the subset to read data from.
   * @param {Number} [pool=null] The optional decoder pool to use.
   * @param {number} [width] The desired width of the output. When the width is no the
   *                         same as the images, resampling will be performed.
   * @param {number} [height] The desired height of the output. When the width is no the
   *                          same as the images, resampling will be performed.
   * @param {string} [resampleMethod='nearest'] The desired resampling method.
   * @returns {Promise.<TypedArray|TypedArray[]>} the RGB array as a Promise
   */
  async readRGB({ window, pool = null, width, height, resampleMethod } = {}) {
    const imageWindow = window || [0, 0, this.getWidth(), this.getHeight()];

    // check parameters
    if (imageWindow[0] > imageWindow[2] || imageWindow[1] > imageWindow[3]) {
      throw new Error('Invalid subsets');
    }

    const pi = this.fileDirectory.PhotometricInterpretation;

    if (pi === photometricInterpretations.RGB) {
      return this.readRasters({
        window,
        interleave: true,
        samples: [0, 1, 2],
        pool,
      });
    }

    let samples;
    switch (pi) {
      case photometricInterpretations.WhiteIsZero:
      case photometricInterpretations.BlackIsZero:
      case photometricInterpretations.Palette:
        samples = [0];
        break;
      case photometricInterpretations.CMYK:
        samples = [0, 1, 2, 3];
        break;
      case photometricInterpretations.YCbCr:
      case photometricInterpretations.CIELab:
        samples = [0, 1, 2];
        break;
      default:
        throw new Error('Invalid or unsupported photometric interpretation.');
    }

    const subOptions = {
      window: imageWindow,
      interleave: true,
      samples,
      pool,
      width,
      height,
      resampleMethod,
    };
    const { fileDirectory } = this;
    const raster = await this.readRasters(subOptions);

    const max = 2 ** this.fileDirectory.BitsPerSample[0];
    let data;
    switch (pi) {
      case photometricInterpretations.WhiteIsZero:
        data = fromWhiteIsZero(raster, max);
        break;
      case photometricInterpretations.BlackIsZero:
        data = fromBlackIsZero(raster, max);
        break;
      case photometricInterpretations.Palette:
        data = fromPalette(raster, fileDirectory.ColorMap);
        break;
      case photometricInterpretations.CMYK:
        data = fromCMYK(raster);
        break;
      case photometricInterpretations.YCbCr:
        data = fromYCbCr(raster);
        break;
      case photometricInterpretations.CIELab:
        data = fromCIELab(raster);
        break;
      default:
        throw new Error('Unsupported photometric interpretation.');
    }
    data.width = raster.width;
    data.height = raster.height;
    return data;
  }

  /**
   * Returns an array of tiepoints.
   * @returns {Object[]}
   */
  getTiePoints() {
    if (!this.fileDirectory.ModelTiepoint) {
      return [];
    }

    const tiePoints = [];
    for (let i = 0; i < this.fileDirectory.ModelTiepoint.length; i += 6) {
      tiePoints.push({
        i: this.fileDirectory.ModelTiepoint[i],
        j: this.fileDirectory.ModelTiepoint[i + 1],
        k: this.fileDirectory.ModelTiepoint[i + 2],
        x: this.fileDirectory.ModelTiepoint[i + 3],
        y: this.fileDirectory.ModelTiepoint[i + 4],
        z: this.fileDirectory.ModelTiepoint[i + 5],
      });
    }
    return tiePoints;
  }

  /**
   * Returns the parsed GDAL metadata items.
   * @returns {Object}
   */
  getGDALMetadata() {
    const metadata = {};
    if (!this.fileDirectory.GDAL_METADATA) {
      return null;
    }
    const string = this.fileDirectory.GDAL_METADATA;
    const xmlDom = parseXml(string.substring(0, string.length - 1));
    const result = xmlDom.evaluate(
      'GDALMetadata/Item', xmlDom, null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null,
    );
    for (let i = 0; i < result.snapshotLength; ++i) {
      const node = result.snapshotItem(i);
      metadata[node.getAttribute('name')] = node.textContent;
    }
    return metadata;
  }

  /**
   * Returns the image origin as a XYZ-vector. When the image has no affine
   * transformation, then an exception is thrown.
   * @returns {Array} The origin as a vector
   */
  getOrigin() {
    const tiePoints = this.fileDirectory.ModelTiepoint;
    const modelTransformation = this.fileDirectory.ModelTransformation;
    if (tiePoints && tiePoints.length === 6) {
      return [
        tiePoints[3],
        tiePoints[4],
        tiePoints[5],
      ];
    } else if (modelTransformation) {
      return [
        modelTransformation[3],
        modelTransformation[7],
        modelTransformation[11],
      ];
    }
    throw new Error('The image does not have an affine transformation.');
  }

  /**
   * Returns the image resolution as a XYZ-vector. When the image has no affine
   * transformation, then an exception is thrown.
   * @param {GeoTIFFImage} [referenceImage=null] A reference image to calculate the resolution from
   *                                             in cases when the current image does not have the
   *                                             required tags on its own.
   * @returns {Array} The resolution as a vector
   */
  getResolution(referenceImage = null) {
    const modelPixelScale = this.fileDirectory.ModelPixelScale;
    const modelTransformation = this.fileDirectory.ModelTransformation;

    if (modelPixelScale) {
      return [
        modelPixelScale[0],
        -modelPixelScale[1],
        modelPixelScale[2],
      ];
    } else if (modelTransformation) {
      return [
        modelTransformation[0],
        modelTransformation[5],
        modelTransformation[10],
      ];
    }

    if (referenceImage) {
      const [refResX, refResY, refResZ] = referenceImage.getResolution();
      return [
        refResX * referenceImage.getWidth() / this.getWidth(),
        refResY * referenceImage.getHeight() / this.getHeight(),
        refResZ * referenceImage.getWidth() / this.getWidth(),
      ];
    }

    throw new Error('The image does not have an affine transformation.');
  }

  /**
   * Returns whether or not the pixels of the image depict an area (or point).
   * @returns {Boolean} Whether the pixels are a point
   */
  pixelIsArea() {
    return this.geoKeys.GTRasterTypeGeoKey === 1;
  }

  /**
   * Returns the image bounding box as an array of 4 values: min-x, min-y,
   * max-x and max-y. When the image has no affine transformation, then an
   * exception is thrown.
   * @returns {Array} The bounding box
   */
  getBoundingBox() {
    const origin = this.getOrigin();
    const resolution = this.getResolution();

    const x1 = origin[0];
    const y1 = origin[1];

    const x2 = x1 + (resolution[0] * this.getWidth());
    const y2 = y1 + (resolution[1] * this.getHeight());

    return [
      Math.min(x1, x2),
      Math.min(y1, y2),
      Math.max(x1, x2),
      Math.max(y1, y2),
    ];
  }
}

export default GeoTIFFImage;
