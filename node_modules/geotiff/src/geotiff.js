import { fieldTypes, fieldTagNames, arrayFields, geoKeyNames } from './globals';
import GeoTIFFImage from './geotiffimage';
import DataView64 from './dataview64';
import DataSlice from './dataslice';
import { makeRemoteSource, makeBufferSource, makeFileSource, makeFileReaderSource } from './source';
import Pool from './pool';

function getFieldTypeLength(fieldType) {
  switch (fieldType) {
    case fieldTypes.BYTE: case fieldTypes.ASCII: case fieldTypes.SBYTE: case fieldTypes.UNDEFINED:
      return 1;
    case fieldTypes.SHORT: case fieldTypes.SSHORT:
      return 2;
    case fieldTypes.LONG: case fieldTypes.SLONG: case fieldTypes.FLOAT:
      return 4;
    case fieldTypes.RATIONAL: case fieldTypes.SRATIONAL: case fieldTypes.DOUBLE:
    case fieldTypes.LONG8: case fieldTypes.SLONG8: case fieldTypes.IFD8:
      return 8;
    default:
      throw new RangeError(`Invalid field type: ${fieldType}`);
  }
}

function parseGeoKeyDirectory(fileDirectory) {
  const rawGeoKeyDirectory = fileDirectory.GeoKeyDirectory;
  if (!rawGeoKeyDirectory) {
    return null;
  }

  const geoKeyDirectory = {};
  for (let i = 4; i <= rawGeoKeyDirectory[3] * 4; i += 4) {
    const key = geoKeyNames[rawGeoKeyDirectory[i]];
    const location = (rawGeoKeyDirectory[i + 1]) ?
      (fieldTagNames[rawGeoKeyDirectory[i + 1]]) : null;
    const count = rawGeoKeyDirectory[i + 2];
    const offset = rawGeoKeyDirectory[i + 3];

    let value = null;
    if (!location) {
      value = offset;
    } else {
      value = fileDirectory[location];
      if (typeof value === 'undefined' || value === null) {
        throw new Error(`Could not get value of geoKey '${key}'.`);
      } else if (typeof value === 'string') {
        value = value.substring(offset, offset + count - 1);
      } else if (value.subarray) {
        value = value.subarray(offset, offset + count - 1);
      }
    }
    geoKeyDirectory[key] = value;
  }
  return geoKeyDirectory;
}

function getValues(dataSlice, fieldType, count, offset) {
  let values = null;
  let readMethod = null;
  const fieldTypeLength = getFieldTypeLength(fieldType);

  switch (fieldType) {
    case fieldTypes.BYTE: case fieldTypes.ASCII: case fieldTypes.UNDEFINED:
      values = new Uint8Array(count); readMethod = dataSlice.readUint8;
      break;
    case fieldTypes.SBYTE:
      values = new Int8Array(count); readMethod = dataSlice.readInt8;
      break;
    case fieldTypes.SHORT:
      values = new Uint16Array(count); readMethod = dataSlice.readUint16;
      break;
    case fieldTypes.SSHORT:
      values = new Int16Array(count); readMethod = dataSlice.readInt16;
      break;
    case fieldTypes.LONG:
      values = new Uint32Array(count); readMethod = dataSlice.readUint32;
      break;
    case fieldTypes.SLONG:
      values = new Int32Array(count); readMethod = dataSlice.readInt32;
      break;
    case fieldTypes.LONG8: case fieldTypes.IFD8:
      values = new Array(count); readMethod = dataSlice.readUint64;
      break;
    case fieldTypes.SLONG8:
      values = new Array(count); readMethod = dataSlice.readInt64;
      break;
    case fieldTypes.RATIONAL:
      values = new Uint32Array(count * 2); readMethod = dataSlice.readUint32;
      break;
    case fieldTypes.SRATIONAL:
      values = new Int32Array(count * 2); readMethod = dataSlice.readInt32;
      break;
    case fieldTypes.FLOAT:
      values = new Float32Array(count); readMethod = dataSlice.readFloat32;
      break;
    case fieldTypes.DOUBLE:
      values = new Float64Array(count); readMethod = dataSlice.readFloat64;
      break;
    default:
      throw new RangeError(`Invalid field type: ${fieldType}`);
  }

  // normal fields
  if (!(fieldType === fieldTypes.RATIONAL || fieldType === fieldTypes.SRATIONAL)) {
    for (let i = 0; i < count; ++i) {
      values[i] = readMethod.call(
        dataSlice, offset + (i * fieldTypeLength),
      );
    }
  } else { // RATIONAL or SRATIONAL
    for (let i = 0; i < count; i += 2) {
      values[i] = readMethod.call(
        dataSlice, offset + (i * fieldTypeLength),
      );
      values[i + 1] = readMethod.call(
        dataSlice, offset + ((i * fieldTypeLength) + 4),
      );
    }
  }

  if (fieldType === fieldTypes.ASCII) {
    return String.fromCharCode.apply(null, values);
  }
  return values;
}

class GeoTIFFBase {
  /**
   * (experimental) Reads raster data from the best fitting image. This function uses
   * the image with the lowest resolution that is still a higher resolution than the
   * requested resolution.
   * When specified, the `bbox` option is translated to the `window` option and the
   * `resX` and `resY` to `width` and `height` respectively.
   * Then, the [readRasters]{@link GeoTIFFImage#readRasters} method of the selected
   * image is called and the result returned.
   * @see GeoTIFFImage.readRasters
   * @param {Object} [options] optional parameters
   * @param {Array} [options.window=whole image] the subset to read data from.
   * @param {Array} [options.bbox=whole image] the subset to read data from in
   *                                           geographical coordinates.
   * @param {Array} [options.samples=all samples] the selection of samples to read from.
   * @param {Boolean} [options.interleave=false] whether the data shall be read
   *                                             in one single array or separate
   *                                             arrays.
   * @param {Number} [pool=null] The optional decoder pool to use.
   * @param {Number} [width] The desired width of the output. When the width is no the
   *                         same as the images, resampling will be performed.
   * @param {Number} [height] The desired height of the output. When the width is no the
   *                          same as the images, resampling will be performed.
   * @param {String} [resampleMethod='nearest'] The desired resampling method.
   * @param {Number|Number[]} [fillValue] The value to use for parts of the image
   *                                      outside of the images extent. When multiple
   *                                      samples are requested, an array of fill values
   *                                      can be passed.
   * @returns {Promise.<(TypedArray|TypedArray[])>} the decoded arrays as a promise
   */
  async readRasters(options = {}) {
    const { window: imageWindow, width, height } = options;
    let { resX, resY, bbox } = options;

    const firstImage = await this.getImage();
    let usedImage = firstImage;
    const imageCount = await this.getImageCount();
    const imgBBox = firstImage.getBoundingBox();

    if (imageWindow && bbox) {
      throw new Error('Both "bbox" and "window" passed.');
    }

    // if width/height is passed, transform it to resolution
    if (width || height) {
      // if we have an image window (pixel coordinates), transform it to a BBox
      // using the origin/resolution of the first image.
      if (imageWindow) {
        const [oX, oY] = firstImage.getOrigin();
        const [rX, rY] = firstImage.getResolution();

        bbox = [
          oX + (imageWindow[0] * rX),
          oY + (imageWindow[1] * rY),
          oX + (imageWindow[2] * rX),
          oY + (imageWindow[3] * rY),
        ];
      }

      // if we have a bbox (or calculated one)

      const usedBBox = bbox || imgBBox;

      if (width) {
        if (resX) {
          throw new Error('Both width and resX passed');
        }
        resX = (usedBBox[2] - usedBBox[0]) / width;
      }
      if (height) {
        if (resY) {
          throw new Error('Both width and resY passed');
        }
        resY = (usedBBox[3] - usedBBox[1]) / height;
      }
    }

    // if resolution is set or calculated, try to get the image with the worst acceptable resolution
    if (resX || resY) {
      const allImages = [];
      for (let i = 0; i < imageCount; ++i) {
        const image = await this.getImage(i);
        const { SubfileType: subfileType, NewSubfileType: newSubfileType } = image.fileDirectory;
        if (i === 0 || subfileType === 2 || newSubfileType & 1) {
          allImages.push(image);
        }
      }

      allImages.sort((a, b) => a.getWidth() - b.getWidth());
      for (let i = 0; i < allImages.length; ++i) {
        const image = allImages[i];
        const imgResX = (imgBBox[2] - imgBBox[0]) / image.getWidth();
        const imgResY = (imgBBox[3] - imgBBox[1]) / image.getHeight();

        usedImage = image;
        if ((resX && resX > imgResX) || (resY && resY > imgResY)) {
          break;
        }
      }
    }

    let wnd = imageWindow;
    if (bbox) {
      const [oX, oY] = firstImage.getOrigin();
      const [imageResX, imageResY] = usedImage.getResolution(firstImage);

      wnd = [
        Math.round((bbox[0] - oX) / imageResX),
        Math.round((bbox[1] - oY) / imageResY),
        Math.round((bbox[2] - oX) / imageResX),
        Math.round((bbox[3] - oY) / imageResY),
      ];
      wnd = [
        Math.min(wnd[0], wnd[2]),
        Math.min(wnd[1], wnd[3]),
        Math.max(wnd[0], wnd[2]),
        Math.max(wnd[1], wnd[3]),
      ];
    }

    return usedImage.readRasters(Object.assign({}, options, {
      window: wnd,
    }));
  }
}


/**
 * The abstraction for a whole GeoTIFF file.
 * @augments GeoTIFFBase
 */
class GeoTIFF extends GeoTIFFBase {
  /**
   * @constructor
   * @param {Source} source The datasource to read from.
   * @param {Boolean} littleEndian Whether the image uses little endian.
   * @param {Boolean} bigTiff Whether the image uses bigTIFF conventions.
   * @param {Number} firstIFDOffset The numeric byte-offset from the start of the image
   *                                to the first IFD.
   * @param {Object} [options] further options.
   * @param {Boolean} [options.cache=false] whether or not decoded tiles shall be cached.
   */
  constructor(source, littleEndian, bigTiff, firstIFDOffset, options = {}) {
    super();
    this.source = source;
    this.littleEndian = littleEndian;
    this.bigTiff = bigTiff;
    this.firstIFDOffset = firstIFDOffset;
    this.cache = options.cache || false;
    this.fileDirectories = null;
    this.fileDirectoriesParsing = null;
  }

  async getSlice(offset, size) {
    const fallbackSize = this.bigTiff ? 4048 : 1024;
    return new DataSlice(
      await this.source.fetch(
        offset, typeof size !== 'undefined' ? size : fallbackSize,
      ), offset, this.littleEndian, this.bigTiff,
    );
  }

  async parseFileDirectories() {
    let nextIFDByteOffset = this.firstIFDOffset;
    const offsetSize = this.bigTiff ? 8 : 2;
    const entrySize = this.bigTiff ? 20 : 12;
    const fileDirectories = [];

    while (nextIFDByteOffset !== 0x00000000) {
      let dataSlice = await this.getSlice(nextIFDByteOffset);
      const numDirEntries = this.bigTiff ?
        dataSlice.readUint64(nextIFDByteOffset) :
        dataSlice.readUint16(nextIFDByteOffset);

      // if the slice does not cover the whole IFD, request a bigger slice, where the
      // whole IFD fits: num of entries + n x tag length + offset to next IFD
      const byteSize = (numDirEntries * entrySize) + (this.bigTiff ? 16 : 6);
      if (!dataSlice.covers(nextIFDByteOffset, byteSize)) {
        dataSlice = await this.getSlice(nextIFDByteOffset, byteSize);
      }

      const fileDirectory = {};

      // loop over the IFD and create a file directory object
      let i = nextIFDByteOffset + (this.bigTiff ? 8 : 2);
      for (let entryCount = 0; entryCount < numDirEntries; i += entrySize, ++entryCount) {
        const fieldTag = dataSlice.readUint16(i);
        const fieldType = dataSlice.readUint16(i + 2);
        const typeCount = this.bigTiff ?
          dataSlice.readUint64(i + 4) :
          dataSlice.readUint32(i + 4);

        let fieldValues;
        let value;
        const fieldTypeLength = getFieldTypeLength(fieldType);
        const valueOffset = i + (this.bigTiff ? 12 : 8);

        // check whether the value is directly encoded in the tag or refers to a
        // different external byte range
        if (fieldTypeLength * typeCount <= (this.bigTiff ? 8 : 4)) {
          fieldValues = getValues(dataSlice, fieldType, typeCount, valueOffset);
        } else {
          // resolve the reference to the actual byte range
          const actualOffset = dataSlice.readOffset(valueOffset);
          const length = getFieldTypeLength(fieldType) * typeCount;

          // check, whether we actually cover the referenced byte range; if not,
          // request a new slice of bytes to read from it
          if (dataSlice.covers(actualOffset, length)) {
            fieldValues = getValues(dataSlice, fieldType, typeCount, actualOffset);
          } else {
            const fieldDataSlice = await this.getSlice(actualOffset, length);
            fieldValues = getValues(fieldDataSlice, fieldType, typeCount, actualOffset);
          }
        }

        // unpack single values from the array
        if (typeCount === 1 && arrayFields.indexOf(fieldTag) === -1 &&
          !(fieldType === fieldTypes.RATIONAL || fieldType === fieldTypes.SRATIONAL)) {
          value = fieldValues[0];
        } else {
          value = fieldValues;
        }

        // write the tags value to the file directly
        fileDirectory[fieldTagNames[fieldTag]] = value;
      }

      fileDirectories.push([
        fileDirectory, parseGeoKeyDirectory(fileDirectory),
      ]);

      // continue with the next IFD
      nextIFDByteOffset = dataSlice.readOffset(
        nextIFDByteOffset + offsetSize + (entrySize * numDirEntries),
      );
    }
    return fileDirectories;
  }

  /**
   * Get the n-th internal subfile of an image. By default, the first is returned.
   *
   * @param {Number} [index=0] the index of the image to return.
   * @returns {GeoTIFFImage} the image at the given index
   */
  async getImage(index = 0) {
    if (!this.fileDirectories) {
      if (!this.fileDirectoriesParsing) {
        this.fileDirectoriesParsing = this.parseFileDirectories();
      }
      this.fileDirectories = await this.fileDirectoriesParsing;
    }

    const fileDirectoryAndGeoKey = this.fileDirectories[index];
    if (!fileDirectoryAndGeoKey) {
      throw new RangeError('Invalid image index');
    }
    return new GeoTIFFImage(
      fileDirectoryAndGeoKey[0], fileDirectoryAndGeoKey[1],
      this.dataView, this.littleEndian, this.cache, this.source,
    );
  }

  /**
   * Returns the count of the internal subfiles.
   *
   * @returns {Number} the number of internal subfile images
   */
  async getImageCount() {
    if (!this.fileDirectories) {
      if (!this.fileDirectoriesParsing) {
        this.fileDirectoriesParsing = this.parseFileDirectories();
      }
      this.fileDirectories = await this.fileDirectoriesParsing;
    }

    return this.fileDirectories.length;
  }

  /**
   * Parse a (Geo)TIFF file from the given source.
   *
   * @param {source~Source} source The source of data to parse from.
   * @param {object} options Additional options.
   */
  static async fromSource(source, options) {
    const headerData = await source.fetch(0, 1024);
    const dataView = new DataView64(headerData);

    const BOM = dataView.getUint16(0, 0);
    let littleEndian;
    if (BOM === 0x4949) {
      littleEndian = true;
    } else if (BOM === 0x4D4D) {
      littleEndian = false;
    } else {
      throw new TypeError('Invalid byte order value.');
    }

    const magicNumber = dataView.getUint16(2, littleEndian);
    let bigTiff;
    if (magicNumber === 42) {
      bigTiff = false;
    } else if (magicNumber === 43) {
      bigTiff = true;
      const offsetByteSize = dataView.getUint16(4, littleEndian);
      if (offsetByteSize !== 8) {
        throw new Error('Unsupported offset byte-size.');
      }
    } else {
      throw new TypeError('Invalid magic number.');
    }

    const firstIFDOffset = bigTiff ?
      dataView.getUint64(8, littleEndian) :
      dataView.getUint32(4, littleEndian);
    return new GeoTIFF(source, littleEndian, bigTiff, firstIFDOffset, options);
  }
}

export { GeoTIFF };
export default GeoTIFF;

/**
 * Wrapper for GeoTIFF files that have external overviews.
 * @augments GeoTIFFBase
 */
class MultiGeoTIFF extends GeoTIFFBase {
  /**
   * Construct a new MultiGeoTIFF from a main and several overview files.
   * @param {GeoTIFF} mainFile The main GeoTIFF file.
   * @param {GeoTIFF[]} overviewFiles An array of overview files.
   */
  constructor(mainFile, overviewFiles) {
    super();
    this.mainFile = mainFile;
    this.overviewFiles = overviewFiles;
    this.imageFiles = [mainFile].concat(overviewFiles);

    this.fileDirectoriesPerFile = null;
    this.fileDirectoriesPerFileParsing = null;
    this.imageCount = null;
  }

  async parseFileDirectoriesPerFile() {
    const requests = [this.mainFile.parseFileDirectories()]
      .concat(this.overviewFiles.map(file => file.parseFileDirectories()));

    this.fileDirectoriesPerFile = await Promise.all(requests);
    return this.fileDirectoriesPerFile;
  }

  /**
   * Get the n-th internal subfile of an image. By default, the first is returned.
   *
   * @param {Number} [index=0] the index of the image to return.
   * @returns {GeoTIFFImage} the image at the given index
   */
  async getImage(index = 0) {
    if (!this.fileDirectoriesPerFile) {
      if (!this.fileDirectoriesPerFileParsing) {
        this.fileDirectoriesPerFileParsing = this.parseFileDirectoriesPerFile();
      }
      this.fileDirectoriesPerFile = await this.fileDirectoriesPerFileParsing;
    }

    let relativeIndex = index;
    for (let i = 0; i < this.fileDirectoriesPerFile.length; ++i) {
      const fileDirectories = this.fileDirectoriesPerFile[i];
      if (relativeIndex < fileDirectories.length) {
        const file = this.imageFiles[i];
        return new GeoTIFFImage(
          fileDirectories[relativeIndex][0], fileDirectories[relativeIndex][1],
          file.dataView, file.littleEndian, file.cache, file.source,
        );
      }
      relativeIndex -= fileDirectories.length;
    }
    throw new RangeError('Invalid image index');
  }

  /**
   * Returns the count of the internal subfiles.
   *
   * @returns {Number} the number of internal subfile images
   */
  async getImageCount() {
    if (!this.fileDirectoriesPerFile) {
      if (!this.fileDirectoriesPerFileParsing) {
        this.fileDirectoriesPerFileParsing = this.parseFileDirectoriesPerFile();
      }
      this.fileDirectoriesPerFile = await this.fileDirectoriesPerFileParsing;
    }
    return this.fileDirectoriesPerFile.reduce((count, ifds) => count + ifds.length, 0);
  }
}

export { MultiGeoTIFF };

/**
 * Creates a new GeoTIFF from a remote URL.
 * @param {string} url The URL to access the image from
 * @param {object} [options] Additional options to pass to the source.
 *                           See {@link makeRemoteSource} for details.
 * @returns {Promise.<GeoTIFF>} The resulting GeoTIFF file.
 */
export async function fromUrl(url, options = {}) {
  return GeoTIFF.fromSource(makeRemoteSource(url, options));
}

/**
 * Construct a new GeoTIFF from an
 * [ArrayBuffer]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}.
 * @param {ArrayBuffer} arrayBuffer The data to read the file from.
 * @returns {Promise.<GeoTIFF>} The resulting GeoTIFF file.
 */
export async function fromArrayBuffer(arrayBuffer) {
  return GeoTIFF.fromSource(makeBufferSource(arrayBuffer));
}

/**
 * Construct a GeoTIFF from a local file path. This uses the node
 * [filesystem API]{@link https://nodejs.org/api/fs.html} and is
 * not available on browsers.
 * @param {string} path The filepath to read from.
 * @returns {Promise.<GeoTIFF>} The resulting GeoTIFF file.
 */
export async function fromFile(path) {
  return GeoTIFF.fromSource(makeFileSource(path));
}

/**
 * Construct a GeoTIFF from an HTML
 * [Blob]{@link https://developer.mozilla.org/en-US/docs/Web/API/Blob} or
 * [File]{@link https://developer.mozilla.org/en-US/docs/Web/API/File}
 * object.
 * @param {Blob|File} blob The Blob or File object to read from.
 * @returns {Promise.<GeoTIFF>} The resulting GeoTIFF file.
 */
export async function fromBlob(blob) {
  return GeoTIFF.fromSource(makeFileReaderSource(blob));
}

/**
 * Construct a MultiGeoTIFF from the given URLs.
 * @param {string} mainUrl The URL for the main file.
 * @param {string[]} overviewUrls An array of URLs for the overview images.
 * @param {object} [options] Additional options to pass to the source.
 *                           See [makeRemoteSource]{@link module:source.makeRemoteSource}
 *                           for details.
 * @returns {Promise.<MultiGeoTIFF>} The resulting MultiGeoTIFF file.
 */
export async function fromUrls(mainUrl, overviewUrls = [], options = {}) {
  const mainFile = await GeoTIFF.fromSource(makeRemoteSource(mainUrl, options));
  const overviewFiles = await Promise.all(
    overviewUrls.map(url => GeoTIFF.fromSource(makeRemoteSource(url, options))),
  );

  return new MultiGeoTIFF(mainFile, overviewFiles);
}

export { Pool };
