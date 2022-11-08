import { IRasterFileData, IRasterLayerData } from '../interface';

interface IDataItem {
  [key: string]: any;
}

export function getColumn(data: IDataItem[], columnName: string) {
  return data.map((item: IDataItem) => {
    return item[columnName] * 1;
  });
}

export function isRasterFileData(data?: IRasterLayerData) {
  if (data === undefined) {
    return false;
  }
  if (!Array.isArray(data) && data.data !== undefined) {
    return true;
  } else {
    return false;
  }
}

export function isRasterFileDataArray(data: IRasterLayerData) {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return false;
    }
    if (isRasterFileData(data[0] as IRasterFileData)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function isNumberArray(data: IRasterLayerData) {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return true;
    }
    if (typeof data[0] === 'number') {
      return true;
    } else {
      return false;
    }
  }
  return false;
}
