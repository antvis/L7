import { IRasterFileData, IRasterFormat, IBandsOperation, IRasterData } from '../../interface';

export async function bandsOperation(imageDataList: IRasterFileData[], rasterFormat: IRasterFormat, operation: IBandsOperation|undefined) {
    let bandData = (await Promise.all(
    imageDataList.map(({ data, bands }) => rasterFormat(data, bands)),
    )) as IRasterData[];
    // @ts-ignore 
    bandData = bandData.flat();
    bandData.map(band => band.isRasterData = true)
    // Tip: rasterFormat 返回值 rasterData|rasterData[]

    const { width, height } = bandData[0];
    let rasterData: HTMLImageElement | Uint8Array | ImageBitmap | null | undefined;
    switch (typeof operation) {
      case 'function':
        rasterData = operation(bandData) as Uint8Array;
        break;
      case 'object':
        // console.log('operation bandExpress', operation)
        // calExpress(operation, bandData)
        // 波段计算表达式 - operation
        // const bandExpress = [
        //   '+',
        //   ['*', ['bands', 0], ['number', 1/2]],
        //   ['*', ['bands', 1], ['number', 1/3]]
        // ];

        const testexpress = [
            '+', 
            // ['band', 0], 
            ['*', ['band', 0], 0.5],
            ['*', ['band', 1], 0.5]
        ]

        rasterData = calExpress(operation, bandData)

        break;
      default:
        rasterData = bandData[0].rasterData;
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
 * @param bandData 
 */
function calExpress(express: any[], bandData: IRasterData[]) {
    const {width, height} = bandData[0];
    const dataArray = bandData.map(band => band.rasterData) as Uint8Array[];
    const length = width * height;
    const rasterData = new Uint8Array(length);

    for(let i = 0;i < length; i++) {
        const exp = JSON.parse(JSON.stringify(express));
        replaceBand(exp, dataArray, i);
        rasterData[i] = parseExpress(exp) as number;
    }
    return rasterData;
}

type IExpress = any[];

/**
 * 将表达式中的指定波段替换为对应波段的栅格数据
 * @param express 
 * @param dataArray 
 * @param index 
 */
function replaceBand(express: any[], dataArray: Uint8Array[], index: number) {
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

function checkExpress() {

}

function parseExpress(express: any[]) {
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