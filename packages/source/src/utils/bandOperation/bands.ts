import { IRasterFileData, IRasterLayerData, IRasterFormat, IBandsOperation, IRasterData } from '../../interface';

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
        rasterData = calExpress(operation, bandsData) ;
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
function calExpress(express: any[], bandsData: IRasterData[]) {
    const {width, height} = bandsData[0];
    const dataArray = bandsData.map(band => band.rasterData) as Uint8Array[];
    const length = width * height;
    const rasterData = [];

    for(let i = 0;i < length; i++) {
        const exp = JSON.parse(JSON.stringify(express));
        replaceBand(exp, dataArray, i);
        rasterData.push(parseExpress(exp) as number)
        
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
function replaceBand(express: IExpress, dataArray: Uint8Array[], index: number) {
    express.map((e, i) => {
        if(Array.isArray(e)) {
            if(e[0] === 'band') {
                express[i] = dataArray[e[1]][index]
            } else {
                replaceBand(e, dataArray, index);
            }
        }
    })
}

function checkExpress(express: IExpress) {
    const [symbol1, symbol2, symbol3] = express;
    if(symbol1 === undefined || symbol2 === undefined || symbol3 === undefined) {
        console.warn('Express err!')
        return false;
    }
    return true;
}

function parseExpress(express: IExpress) {
    // if express err，return 0
    if(!checkExpress(express)) return 0;
    const str = express[0];
    let left = express[1];
    let right = express[2];
    
    if(Array.isArray(left)) {
        left = parseExpress(express[1])
    }
    if(Array.isArray(right)) {
        right = parseExpress(express[2])
    }
    return calNum(str, left, right);
}

function calNum(str: string, n1: number, n2: number) {
    // remove spacing - get calculate symbol
    const symbol = str.replace(/\s+/g, '');
    
    switch(symbol) {
        case '+': return n1 + n2;
        case '-': return n1 - n2;
        case '*': return n1 * n2;
        case '/': return n1 / n2;
        default:
            console.warn('Calculate symbol err! Return default 0');
            return 0;
    }
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