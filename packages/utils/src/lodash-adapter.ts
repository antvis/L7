// 类型定义
export interface DebouncedFunc<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
}

// TypedArray 类型定义
type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

// isNil: 检查是否为 null 或 undefined
const isNil = (value: unknown): value is null | undefined => {
  return value == null;
};

// isString: 检查是否为字符串
const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

// isNumber: 检查是否为有效数字
const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

// isBoolean: 检查是否为布尔值
const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

// isFunction: 检查是否为函数
const isFunction = (value: unknown): value is (...args: any[]) => any => {
  return typeof value === 'function';
};

// isObject: 检查是否为对象（非 null）
const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && value !== null;
};

// isUndefined: 检查是否为 undefined
const isUndefined = (value: unknown): value is undefined => {
  return typeof value === 'undefined';
};

// isTypedArray: 检查是否为 TypedArray
const isTypedArray = (value: unknown): value is TypedArray => {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
};

// isPlainObject: 检查是否为普通对象
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (!isObject(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
};

// clamp: 限制数值范围
const clamp = (value: number, lower: number, upper: number): number => {
  return Math.min(Math.max(value, lower), upper);
};

// uniq: 数组去重
const uniq = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

// pull: 从数组中移除指定元素
const pull = <T>(array: T[], ...values: T[]): T[] => {
  const valuesToRemove = new Set(values);
  for (let i = array.length - 1; i >= 0; i--) {
    if (valuesToRemove.has(array[i])) {
      array.splice(i, 1);
    }
  }
  return array;
};

// upperFirst: 首字母大写
const upperFirst = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// camelCase: 转换为驼峰命名
const camelCase = (str: string): string => {
  if (!str) return str;
  return str
    .replace(/^[_.\- ]+/, '')
    .replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase())
    .replace(/[A-Z]/g, (char, index) => (index === 0 ? char.toLowerCase() : char));
};

// uniqueId: 生成唯一 ID
let idCounter = 0;
const uniqueId = (prefix: string = ''): string => {
  return `${prefix}${++idCounter}`;
};

// get: 获取对象的嵌套属性
const get = <T = unknown>(obj: unknown, path: string | string[], defaultValue?: T): T => {
  if (!obj) return defaultValue as T;

  const pathArray = Array.isArray(path)
    ? path
    : path
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .filter(Boolean);

  let result: unknown = obj;
  for (const key of pathArray) {
    if (result == null) return defaultValue as T;
    result = (result as Record<string, unknown>)[key];
  }
  return result === undefined ? (defaultValue as T) : (result as T);
};

// cloneDeep: 深度克隆
const cloneDeep = <T>(value: T): T => {
  // 使用 structuredClone（现代浏览器和 Node.js 17+ 支持）
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      // structuredClone 不支持的类型，使用手动克隆
    }
  }

  // 手动克隆
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => cloneDeep(item)) as T;
  }

  if (value instanceof Date) {
    return new Date(value) as T;
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  if (value instanceof Map) {
    const clonedMap = new Map();
    value.forEach((v, k) => clonedMap.set(cloneDeep(k), cloneDeep(v)));
    return clonedMap as T;
  }

  if (value instanceof Set) {
    const clonedSet = new Set();
    value.forEach((v) => clonedSet.add(cloneDeep(v)));
    return clonedSet as T;
  }

  if (isTypedArray(value)) {
    // 使用 slice 方法克隆 TypedArray
    return value.slice() as T;
  }

  if (value instanceof ArrayBuffer) {
    return value.slice(0) as T;
  }

  if (value instanceof DataView) {
    return new DataView(value.buffer.slice(0), value.byteOffset, value.byteLength) as T;
  }

  if (isPlainObject(value)) {
    const clonedObj: Record<string, unknown> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        clonedObj[key] = cloneDeep(value[key]);
      }
    }
    return clonedObj as T;
  }

  return value;
};

// isEqual: 深度比较
const isEqual = (value: unknown, other: unknown): boolean => {
  if (Object.is(value, other)) return true;

  if (typeof value !== 'object' || typeof other !== 'object') {
    return false;
  }

  if (value === null || other === null) {
    return value === other;
  }

  if (Array.isArray(value) !== Array.isArray(other)) {
    return false;
  }

  if (Array.isArray(value) && Array.isArray(other)) {
    if (value.length !== other.length) return false;
    return value.every((item, index) => isEqual(item, other[index]));
  }

  if (value instanceof Date && other instanceof Date) {
    return value.getTime() === other.getTime();
  }

  if (value instanceof RegExp && other instanceof RegExp) {
    return value.source === other.source && value.flags === other.flags;
  }

  if (value instanceof Map && other instanceof Map) {
    if (value.size !== other.size) return false;
    for (const [key, val] of value) {
      if (!other.has(key) || !isEqual(val, other.get(key))) return false;
    }
    return true;
  }

  if (value instanceof Set && other instanceof Set) {
    if (value.size !== other.size) return false;
    for (const val of value) {
      if (!other.has(val)) return false;
    }
    return true;
  }

  if (isTypedArray(value) && isTypedArray(other)) {
    if (value.length !== other.length) return false;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== other[i]) return false;
    }
    return true;
  }

  const valueKeys = Object.keys(value);
  const otherKeys = Object.keys(other);

  if (valueKeys.length !== otherKeys.length) return false;

  for (const key of valueKeys) {
    if (!Object.prototype.hasOwnProperty.call(other, key)) return false;
    if (
      !isEqual((value as Record<string, unknown>)[key], (other as Record<string, unknown>)[key])
    ) {
      return false;
    }
  }

  return true;
};

// merge: 深度合并对象
// 使用宽松的类型签名以匹配 lodash 行为
const merge = <T extends object = Record<string, unknown>>(
  target: T,
  ...sources: (object | undefined | null)[]
): T => {
  // 过滤掉 undefined/null 的 sources
  const validSources = sources.filter((s): s is object => s != null);
  if (!validSources.length) return target;

  const source = validSources.shift();

  if (isPlainObject(target) && isPlainObject(source)) {
    for (const key in source) {
      if (isPlainObject(source[key])) {
        if (!(key in target)) {
          Object.assign(target, { [key]: {} });
        }
        merge((target as Record<string, unknown>)[key] as object, source[key] as object);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return merge(target, ...validSources);
};

// mergeWith: 带自定义合并函数的深度合并
type MergeWithCustomizer = (
  targetValue: unknown,
  sourceValue: unknown,
  key: string,
  target: object,
  source: object,
) => unknown;

const mergeWith = <T extends object>(
  target: T,
  source: Partial<T> | Partial<T>[],
  customizer: MergeWithCustomizer,
): T => {
  const sources = Array.isArray(source) ? source : [source];

  for (const src of sources) {
    if (isPlainObject(target) && isPlainObject(src)) {
      for (const key in src) {
        const targetValue = (target as Record<string, unknown>)[key];
        const sourceValue = (src as Record<string, unknown>)[key];

        const result = customizer(targetValue, sourceValue, key, target, src);

        if (result !== undefined) {
          (target as Record<string, unknown>)[key] = result;
        } else if (isPlainObject(sourceValue)) {
          if (!(key in target)) {
            (target as Record<string, unknown>)[key] = {};
          }
          mergeWith(
            (target as Record<string, unknown>)[key] as object,
            sourceValue as object,
            customizer,
          );
        } else {
          (target as Record<string, unknown>)[key] = sourceValue;
        }
      }
    }
  }

  return target;
};

// debounce: 防抖函数
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number = 0,
): DebouncedFunc<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown = null;
  let result: ReturnType<T> | undefined;

  const later = () => {
    if (lastArgs) {
      result = func.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
    timeoutId = null;
  };

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(later, wait);

    return result;
  } as DebouncedFunc<T>;

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = () => {
    if (timeoutId && lastArgs) {
      result = func.apply(lastThis, lastArgs);
    }
    debounced.cancel();
    return result;
  };

  return debounced;
};

// throttle: 节流函数
const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number = 0,
): DebouncedFunc<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown = null;
  let lastCallTime = 0;
  let result: ReturnType<T> | undefined;

  const invokeFunc = () => {
    if (lastArgs) {
      result = func.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
  };

  const throttled = function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    if (timeSinceLastCall >= wait) {
      lastCallTime = now;
      invokeFunc();
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        timeoutId = null;
        invokeFunc();
      }, wait - timeSinceLastCall);
    }

    return result;
  } as DebouncedFunc<T>;

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastThis = null;
    lastCallTime = 0;
  };

  throttled.flush = () => {
    invokeFunc();
    throttled.cancel();
    return result;
  };

  return throttled;
};

// extent: 获取数组的最大值和最小值 (来自 d3-array)
const extent = <T>(array: Iterable<T> | undefined | null): [T | undefined, T | undefined] => {
  if (!array) {
    return [undefined, undefined];
  }

  let min: T | undefined;
  let max: T | undefined;
  let defined = false;

  for (const value of array) {
    if (value == null || Number.isNaN(value)) {
      continue;
    }
    if (!defined) {
      min = value;
      max = value;
      defined = true;
    } else {
      if (value < min!) {
        min = value;
      }
      if (value > max!) {
        max = value;
      }
    }
  }

  return [min, max];
};

export const lodashUtil = {
  isNil,
  merge,
  throttle,
  isString,
  debounce,
  pull,
  isTypedArray,
  isPlainObject,
  isNumber,
  isBoolean,
  isEqual,
  cloneDeep,
  uniq,
  clamp,
  upperFirst,
  get,
  mergeWith,
  isFunction,
  isObject,
  isUndefined,
  camelCase,
  uniqueId,
  extent,
};
