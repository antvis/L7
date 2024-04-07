import type { IRasterData } from '../../interface';

// tslint:disable-next-line: jsdoc-format
/** 数学运算 根据计算表达式进行数学运算
 * * * Math operators:
 * `['*', value1, value2]`
 * `['/', value1, value2]`
 * `['+', value1, value2]`
 * `['-', value1, value2]`
 * `['%', value1, value2]`
 * `['^', value1, value2]`
 * `['abs', value1]`
 * `['floor', value1]`
 * `['round', value1]`
 * `['ceil', value1]`
 * `['sin', value1]`
 * `['cos', value1]`
 * `['atan', value1, value2]`
 */
export function mathematical(symbol: string, n1: number, n2: number) {
  switch (symbol) {
    case '+':
      return n1 + n2;
    case '-':
      return n1 - n2;
    case '*':
      return n1 * n2;
    case '/':
      return n1 / n2;
    case '%':
      return n1 % n2;

    case '^':
      return Math.pow(n1, n2);
    case 'abs':
      return Math.abs(n1);
    case 'floor':
      return Math.floor(n1);
    case 'round':
      return Math.round(n1);
    case 'ceil':
      return Math.ceil(n1);
    case 'sin':
      return Math.sin(n1);
    case 'cos':
      return Math.cos(n1);
    case 'atan':
      return n2 === -1 ? Math.atan(n1) : Math.atan2(n1, n2);
    case 'min':
      return Math.min(n1, n2);
    case 'max':
      return Math.max(n1, n2);
    case 'log10':
      return Math.log(n1);
    case 'log2':
      return Math.log2(n1);
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
  const { width, height } = bandsData[0];
  const dataArray = bandsData.map((band) => band.rasterData) as Uint8Array[];
  const length = width * height;
  const rasterData = [];
  const originExp = JSON.stringify(express);
  for (let i = 0; i < length; i++) {
    const exp = JSON.parse(originExp);
    // 将表达式中的 ['band', 0]、['band', 1] 等替换为实际的栅格数据
    const expResult = spellExpress(exp, dataArray, i);
    if (typeof expResult === 'number') {
      // exp: ['band', 0] => exp: 2 ...
      // exp 直接指定了波段值，替换完后直接就是数值了，无需计算
      rasterData.push(expResult);
    } else {
      const result = calculateExpress(exp);
      rasterData.push(result);
    }
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
  /**
   * 用户直接指定波段数值，无需计算
   */
  if (express.length === 2 && express[0] === 'band' && typeof express[1] === 'number') {
    try {
      return dataArray[express[1]][index];
    } catch (err) {
      console.warn('Raster Data err!');
      return 0;
    }
  }
  express.map((e, i) => {
    if (Array.isArray(e) && e.length > 0) {
      switch (e[0]) {
        case 'band':
          try {
            express[i] = dataArray[e[1]][index];
          } catch (err) {
            console.warn('Raster Data err!');
            express[i] = 0;
          }
          break;
        default:
          spellExpress(e, dataArray, index);
      }
    }
  });
}

export function formatExpress(express: IExpress) {
  const [symbol1, symbol2 = -1, symbol3 = -1] = express;
  if (symbol1 === undefined) {
    console.warn('Express err!');
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

  if (Array.isArray(left)) {
    left = calculateExpress(express[1]);
  }
  if (Array.isArray(right)) {
    right = calculateExpress(express[2]);
  }
  return mathematical(str, left, right);
}
