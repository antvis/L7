// import { bindCancel } from './request';
import { SourceTile } from '@antv/l7-utils';
import { IBandsOperation, IRasterFormat } from '../../interface';
import { processRasterData } from '../bandOperation/bands';

export const getCustomData = async (
  tile: SourceTile,
  getCustomDataFunc: (
    tile: { x: number; y: number; z: number },
    cb: (err: any, data: any) => void,
  ) => void,
  rasterFormat: IRasterFormat,
  operation?: IBandsOperation,
) => {
  return new Promise((resolve, reject) => {
    getCustomDataFunc(
      {
        x: tile.x,
        y: tile.y,
        z: tile.z,
      },
      (err, data) => {
        if (err || data.length === 0) {
          reject(err);
          return;
        }
        if (data) {
          processRasterData(
            [{ data, bands: [0] }],
            rasterFormat,
            operation,
            (error: any, img: any) => {
              if (error) {
                reject(error);
              } else if (img) {
                resolve(img);
              }
            },
          );
        }
      },
    );
  });
};
