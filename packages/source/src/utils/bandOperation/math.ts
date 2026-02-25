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
 * 预编译表达式为执行函数（内部实现）
 * 避免在循环中反复进行 JSON 序列化/反序列化
 */
type CompiledExprFn = (dataArray: Uint8Array[], index: number) => number;

function compileExpressionInner(express: any): CompiledExprFn {
  // 如果是数字常量
  if (typeof express === 'number') {
    return () => express;
  }

  // 如果不是数组，返回 0
  if (!Array.isArray(express)) {
    return () => 0;
  }

  // 如果是单波段引用 ['band', n]
  if (express.length === 2 && express[0] === 'band' && typeof express[1] === 'number') {
    const bandIndex = express[1];
    return (dataArray, index) => {
      try {
        return dataArray[bandIndex]?.[index] ?? 0;
      } catch {
        return 0;
      }
    };
  }

  const operator = express[0];

  // 处理单目运算符
  if (['abs', 'floor', 'round', 'ceil', 'sin', 'cos', 'log10', 'log2'].includes(operator)) {
    const operand = compileExpressionInner(express[1]);
    const mathOps: Record<string, (v: number) => number> = {
      abs: Math.abs,
      floor: Math.floor,
      round: Math.round,
      ceil: Math.ceil,
      sin: Math.sin,
      cos: Math.cos,
      log10: Math.log,
      log2: Math.log2,
    };
    const fn = mathOps[operator] || ((v) => v);
    return (dataArray, index) => fn(operand(dataArray, index));
  }

  // 处理 atan 特殊情况
  if (operator === 'atan') {
    const operand1 = compileExpressionInner(express[1]);
    const operand2 =
      express[2] !== undefined && express[2] !== -1 ? compileExpressionInner(express[2]) : null;
    return (dataArray, index) => {
      const v1 = operand1(dataArray, index);
      if (operand2) {
        return Math.atan2(v1, operand2(dataArray, index));
      }
      return Math.atan(v1);
    };
  }

  // 处理双目运算符
  const left = compileExpressionInner(express[1]);
  const right = compileExpressionInner(express[2]);

  return (dataArray, index) => {
    const l = left(dataArray, index);
    const r = right(dataArray, index);
    return mathematical(operator, l, r);
  };
}

/**
 * 根据表达式计算（优化版本：使用预编译）
 * @param express
 * @param bandsData
 */
export function calculate(express: any[], bandsData: IRasterData[]) {
  const { width, height } = bandsData[0];
  const dataArray = bandsData.map((band) => band.rasterData) as Uint8Array[];
  const length = width * height;

  // 预编译表达式（只编译一次）
  const compiled = compileExpressionInner(express);

  // 预分配结果数组（避免动态扩容）
  const rasterData = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    rasterData[i] = compiled(dataArray, i);
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
