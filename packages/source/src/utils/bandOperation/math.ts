
import { IRasterData } from '../../interface';

/** 数学运算 根据计算表达式进行数学运算
 * * * Math operators:
 * `['*', value1, value2]` multiplies `value1` by `value2`
 * `['/', value1, value2]` divides `value1` by `value2`
 * `['+', value1, value2]` adds `value1` and `value2`
 * `['-', value1, value2]` subtracts `value2` from `value1`
 * `['%', value1, value2]` returns the result of `value1 % value2` (modulo)
 * `['^', value1, value2]` returns the value of `value1` raised to the `value2` power
 * `['abs', value1]` returns the absolute value of `value1`
 * `['floor', value1]` returns the nearest integer less than or equal to `value1`
 * `['round', value1]` returns the nearest integer to `value1`
 * `['ceil', value1]` returns the nearest integer greater than or equal to `value1`
 * `['sin', value1]` returns the sine of `value1`
 * `['cos', value1]` returns the cosine of `value1`
 * `['atan', value1, value2]` returns `atan2(value1, value2)`. If `value2` is not provided, returns `atan(value1)`
 */
export function mathematical(symbol: string, n1: number, n2: number) {    
    switch(symbol) {
        case '+': return n1 + n2;
        case '-': return n1 - n2;
        case '*': return n1 * n2;
        case '/': return n1 / n2;
        case '%': return n1 % n2;

        case '^': return Math.pow(n1, n2);
        case 'abs': return Math.abs(n1);
        case 'floor': return Math.floor(n1);
        case 'round': return Math.round(n1);
        case 'ceil': return Math.ceil(n1);
        case 'sin': return Math.sin(n1);
        case 'cos': return Math.cos(n1);
        case 'atan': return (n2 === -1) ? Math.atan(n1): Math.atan2(n1, n2);

        default:
            console.warn('Calculate symbol err! Return default 0');
            return 0;
    }
}

/**
 * 根据表达式计算
 * @param express 
 * @param bandsData 
 */
export function calculate(express: any[], bandsData: IRasterData[]) {
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
export function spellExpress(express: IExpress, dataArray: Uint8Array[], index: number) {
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

export function formatExpress(express: IExpress) {
    const [symbol1, symbol2 = -1, symbol3 = -1] = express;
    if(symbol1 === undefined) {
        console.warn('Express err!')
        return ['+', 0, 0];
    }
    const symbol = symbol1.replace(/\s+/g, '');

    return [symbol, symbol2, symbol3];
}

export function calculateExpress(express: IExpress) {
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