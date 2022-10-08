import { IRasterFileData, IRasterLayerData, IRasterFormat, IBandsOperation, IRasterData } from '../../interface';
import { mathematical } from './math';

export async function bandsOperation(imageDataList: IRasterFileData[], rasterFormat: IRasterFormat, operation: IBandsOperation|undefined) {
    let bandsData = (await Promise.all(
    imageDataList.map(({ data, bands = [0] }) => rasterFormat(data, bands)),
    )) as IRasterData[];
    // @ts-ignore 
    bandsData = bandsData.flat();
    // Tip: rasterFormat 返回值 rasterData|rasterData[]

    const { width, height } = bandsData[0];
    let rasterData: HTMLImageElement | Uint8Array | ImageBitmap | null | undefined;
    switch (typeof operation) {
      case 'function':
        rasterData = operation(bandsData) as Uint8Array;
        break;
      case 'object':
        // 波段计算表达式 - operation
        rasterData = calculate(operation, bandsData) ;
        break;
      default:
        rasterData = bandsData[0].rasterData;
    }
    return {
        rasterData,
        width,
        height
    }
}
/**
 * 根据表达式计算
 * @param express 
 * @param bandsData 
 */
function calculate(express: any[], bandsData: IRasterData[]) {
    const {width, height} = bandsData[0];
    const dataArray = bandsData.map(band => band.rasterData) as Uint8Array[];
    const length = width * height;
    const rasterData = [];
    const originExp = JSON.stringify(express);
    for(let i = 0;i < length; i++) {
        const exp = JSON.parse(originExp);
        // 将表达式中的 ['band', 0]、['band', 1] 等替换为实际的栅格数据
        spellExpress(exp, dataArray, i);
        const result = calculateExpress(exp);
        rasterData.push(result);
    }
    return rasterData as unknown as Uint8Array;
}

type IExpress = any[];

/**
 * 将表达式中的指定波段替换为对应波段的栅格数据
 * @param express 
 * @param dataArray 
 * @param index 
 */
function spellExpress(express: IExpress, dataArray: Uint8Array[], index: number) {
    express.map((e, i) => {
        if(Array.isArray(e) && e.length > 0) {
            switch(e[0]) {
                case 'band': 
                    try {
                        express[i] = dataArray[e[1]][index]; 
                    } catch(err) {
                        console.warn('Raster Data err!');
                        express[i] = 0;
                    }
                    break;
                default: 
                spellExpress(e, dataArray, index);
            }
        }
    })    
}

function formatExpress(express: IExpress) {
    const [symbol1, symbol2 = -1, symbol3 = -1] = express;
    if(symbol1 === undefined) {
        console.warn('Express err!')
        return ['+', 0, 0];
    }
    const symbol = symbol1.replace(/\s+/g, '');

    return [symbol, symbol2, symbol3];
}

function calculateExpress(express: IExpress) {
    const formatExp = formatExpress(express);
    const str = formatExp[0];
    let left = formatExp[1];
    let right = formatExp[2];
    
    if(Array.isArray(left)) {
        left = calculateExpress(express[1]);
    }
    if(Array.isArray(right)) {
        right = calculateExpress(express[2]);
    }
    return mathematical(str, left, right);
}

export function isNumberArray(data: IRasterLayerData) {
    if(Array.isArray(data)) {
        if(data.length === 0) return true;
        if(typeof data[0] === 'number') {
            return true;
        } else {
            return false;
        }
        
    }
    return false;
}

export function isRasterFileData(data?: IRasterLayerData) {
    if(data === undefined) return false;
    if(!Array.isArray(data) && data.data !== undefined) {
        return true;
    } else {
        return false;
    }
}

export function isRasterFileDataArray(data: IRasterLayerData) {
    if(Array.isArray(data)) {
        if(data.length === 0) return false;
        if(isRasterFileData(data[0] as IRasterFileData)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}