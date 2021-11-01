// @ts-nocheck
// tslint:disable
export class ImageData {
  private _w: number;
  private _h: number;
  private _data: Uint8ClampedArray;

  constructor() {
    const len = arguments.length;
    if (len === 2) {
      if (
        typeof arguments[0] === 'number' &&
        typeof arguments[1] === 'number'
      ) {
        this._w = arguments[0];
        this._h = arguments[1];
        this._data = new Uint8ClampedArray(this._w * this._h * 4);
        return;
      }
    } else if (len === 3) {
      if (
        typeof arguments[0] === 'object' &&
        typeof arguments[1] === 'number' &&
        typeof arguments[2] === 'number'
      ) {
        this._data = arguments[0];
        this._w = arguments[1];
        this._h = arguments[2];
      }
    }
    throw new Error('ImageData: params error');
  }

  get width(): number {
    return this._w;
  }

  get height(): number {
    return this._h;
  }

  get data(): Uint8ClampedArray {
    return this._data;
  }
}
