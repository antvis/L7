import { IRasterFormat, IBandsOperation } from '../../interface';
// import { bindCancel } from './request';
import {
    SourceTile,
} from '@antv/l7-utils';
import { processRasterData } from '../bandOperation/bands';

export const getCustomData = async (
    tile: SourceTile,
    getCustomData: (tile: { x: number, y: number, z: number }, cb: (err: any, data: any) => void) => void,
    rasterFormat: IRasterFormat,
    operation?: IBandsOperation,
) => {
    return new Promise((resolve, reject) => {
        getCustomData({
            x: tile.x,
            y: tile.y,
            z: tile.z
        }, (err, data) => {
            if(err){
              reject(err)  
            }
            if (data) {
                processRasterData([{data,bands:[0]}], rasterFormat, operation, (err: any, img: any) => {
                    if (err) {
                        reject(err);
                    } else if (img) {
                        resolve(img);
                    }
                },);
            }

        })
    })
 
}


