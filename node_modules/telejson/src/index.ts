import isRegExp from 'is-regex';
import isFunction from 'is-function';
import isSymbol from 'is-symbol';
import isObjectAny from 'isobject';
import get from 'lodash/get';
import transform from 'lodash/transform';
import memoize from 'memoizerific';

const isObject = isObjectAny as <T = object>(val: any) => val is T;

const removeCodeComments = (code: string) => {
  let inQuoteChar = null;
  let inBlockComment = false;
  let inLineComment = false;
  let inRegexLiteral = false;
  let newCode = '';

  if (code.indexOf('//') >= 0 || code.indexOf('/*') >= 0) {
    for (let i = 0; i < code.length; i += 1) {
      if (!inQuoteChar && !inBlockComment && !inLineComment && !inRegexLiteral) {
        if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
          inQuoteChar = code[i];
        } else if (code[i] === '/' && code[i + 1] === '*') {
          inBlockComment = true;
        } else if (code[i] === '/' && code[i + 1] === '/') {
          inLineComment = true;
        } else if (code[i] === '/' && code[i + 1] !== '/') {
          inRegexLiteral = true;
        }
      } else {
        if (
          inQuoteChar &&
          ((code[i] === inQuoteChar && code[i - 1] !== '\\') ||
            (code[i] === '\n' && inQuoteChar !== '`'))
        ) {
          inQuoteChar = null;
        }
        if (inRegexLiteral && ((code[i] === '/' && code[i - 1] !== '\\') || code[i] === '\n')) {
          inRegexLiteral = false;
        }
        if (inBlockComment && code[i - 1] === '/' && code[i - 2] === '*') {
          inBlockComment = false;
        }
        if (inLineComment && code[i] === '\n') {
          inLineComment = false;
        }
      }
      if (!inBlockComment && !inLineComment) {
        newCode += code[i];
      }
    }
  } else {
    newCode = code;
  }

  return newCode;
};

const cleanCode = memoize(10000)(code =>
  removeCodeComments(code)
    .replace(/\n\s*/g, '') // remove indents & newlines
    .trim()
);

const convertShorthandMethods = function(key: string, stringified: string) {
  const fnHead = stringified.slice(0, stringified.indexOf('{'));
  const fnBody = stringified.slice(stringified.indexOf('{'));

  if (fnHead.includes('=>')) {
    // This is an arrow function
    return stringified;
  }

  if (fnHead.includes('function')) {
    // This is an anonymous function
    return stringified;
  }

  let modifiedHead = fnHead;

  modifiedHead = modifiedHead.replace(key, 'function');

  return modifiedHead + fnBody;
};

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

interface Options {
  allowRegExp: boolean;
  allowFunction: boolean;
  allowSymbol: boolean;
  allowDate: boolean;
  allowUndefined: boolean;
  allowClass: boolean;
  maxDepth: number;
  space: number | undefined;
  lazyEval: boolean;
}

export const replacer = function replacer(options: Options) {
  let objects: { keys: string; value: any }[];
  let stack: any[];
  let keys: string[];

  return function replace(this: any, key: string, value: any) {
    //  very first iteration
    if (key === '') {
      keys = ['root'];
      objects = [{ keys: 'root', value }];
      stack = [];
      return value;
    }

    // From the JSON.stringify's doc:
    // "The object in which the key was found is provided as the replacer's this parameter." thus one can control the depth
    while (stack.length && this !== stack[0]) {
      stack.shift();
      keys.pop();
    }

    if (isRegExp(value)) {
      if (!options.allowRegExp) {
        return undefined;
      }
      return `_regexp_${value.flags}|${value.source}`;
    }

    if (isFunction(value)) {
      if (!options.allowFunction) {
        return undefined;
      }
      const { name } = value;
      const stringified = value.toString();

      if (
        !stringified.match(
          /(\[native code\]|WEBPACK_IMPORTED_MODULE|__webpack_exports__|__webpack_require__)/
        )
      ) {
        return `_function_${name}|${cleanCode(convertShorthandMethods(key, stringified))}`;
      }
      return `_function_${name}|${(() => {}).toString()}`;
    }

    if (isSymbol(value)) {
      if (!options.allowSymbol) {
        return undefined;
      }
      return `_symbol_${value.toString().slice(7, -1)}`;
    }

    if (typeof value === 'string' && dateFormat.test(value)) {
      if (!options.allowDate) {
        return undefined;
      }
      return `_date_${value}`;
    }

    if (value === undefined) {
      if (!options.allowUndefined) {
        return undefined;
      }
      return '_undefined_';
    }

    if (typeof value === 'number') {
      if (value === -Infinity) {
        return '_-Infinity_';
      }
      if (value === Infinity) {
        return '_Infinity_';
      }
      if (Number.isNaN(value)) {
        return '_NaN_';
      }

      return value;
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (stack.length >= options.maxDepth) {
      if (Array.isArray(value)) {
        return `[Array(${value.length})]`;
      }
      return '[Object]';
    }

    const found = objects.find(o => o.value === value);
    if (!found) {
      if (
        value &&
        isObject(value) &&
        value.constructor &&
        value.constructor.name &&
        value.constructor.name !== 'Object'
      ) {
        if (!options.allowClass) {
          return undefined;
        }

        try {
          Object.assign(value, { '_constructor-name_': value.constructor.name });
        } catch (e) {
          // immutable objects can't be written to and throw
          // we could make a deep copy but if the user values the correct instance name,
          // the user should make the deep copy themselves.
        }
      }

      keys.push(key);
      stack.unshift(value);
      objects.push({ keys: keys.join('.'), value });
      return value;
    }

    //  actually, here's the only place where the keys keeping is useful
    return `_duplicate_${found.keys}`;
  };
};

interface ValueContainer {
  '_constructor-name_': string;
  [keys: string]: any;
}

export const reviver = function reviver(options: Options) {
  const refs: { target: string; container: { [keys: string]: any }; replacement: string }[] = [];
  let root: any;

  return function revive(this: any, key: string, value: ValueContainer | string) {
    // last iteration = root
    if (key === '') {
      root = value;

      // restore cyclic refs
      refs.forEach(({ target, container, replacement }) => {
        if (replacement === 'root') {
          // eslint-disable-next-line no-param-reassign
          container[target] = root;
        } else {
          // eslint-disable-next-line no-param-reassign
          container[target] = get(root, replacement.replace('root.', ''));
        }
      });
    }

    if (key === '_constructor-name_') {
      return value;
    }

    // deal with instance names
    if (isObject<ValueContainer>(value) && value['_constructor-name_']) {
      const name = value['_constructor-name_'];
      if (name !== 'Object') {
        // eslint-disable-next-line no-new-func
        const Fn = new Function(`return function ${name}(){}`)();
        Object.setPrototypeOf(value, new Fn());
      }
      // eslint-disable-next-line no-param-reassign
      delete value['_constructor-name_'];
      return value;
    }

    if (typeof value === 'string' && value.startsWith('_function_')) {
      const [, name, source] = value.match(/_function_([^|]*)\|(.*)/) || [];

      if (!options.lazyEval) {
        // eslint-disable-next-line no-eval
        return eval(`(${source})`);
      }

      // lazy eval of the function
      const result = (...args: any[]) => {
        // eslint-disable-next-line no-eval
        const f = eval(`(${source})`);
        return f(...args);
      };
      Object.defineProperty(result, 'toString', {
        value: () => source,
      });
      Object.defineProperty(result, 'name', {
        value: name,
      });
      return result;
    }

    if (typeof value === 'string' && value.startsWith('_regexp_')) {
      // this split isn't working correctly
      const [, flags, source] = value.match(/_regexp_([^|]*)\|(.*)/) || [];
      return new RegExp(source, flags);
    }

    if (typeof value === 'string' && value.startsWith('_date_')) {
      return new Date(value.replace('_date_', ''));
    }

    if (typeof value === 'string' && value.startsWith('_duplicate_')) {
      refs.push({ target: key, container: this, replacement: value.replace('_duplicate_', '') });
      return null;
    }

    if (typeof value === 'string' && value.startsWith('_symbol_')) {
      return Symbol(value.replace('_symbol_', ''));
    }

    if (typeof value === 'string' && value === '_-Infinity_') {
      return -Infinity;
    }

    if (typeof value === 'string' && value === '_Infinity_') {
      return Infinity;
    }

    if (typeof value === 'string' && value === '_NaN_') {
      return NaN;
    }

    return value;
  };
};

// eslint-disable-next-line no-useless-escape
export const isJSON = (input: string) => input.match(/^[\[\{\"\}].*[\]\}\"]$/);

const defaultOptions: Options = {
  maxDepth: 10,
  space: undefined,
  allowFunction: true,
  allowRegExp: true,
  allowDate: true,
  allowClass: true,
  allowUndefined: true,
  allowSymbol: true,
  lazyEval: true,
};

export const stringify = (data: any, options: Partial<Options> = {}) => {
  const mergedOptions: Options = { ...defaultOptions, ...options };
  return JSON.stringify(data, replacer(mergedOptions), options.space);
};

const mutator = () => {
  const mutated: any[] = [];
  return function mutateUndefined(value: any) {
    // JSON.parse will not output keys with value of undefined
    // we map over a deeply nester object, if we find any value with `_undefined_`, we mutate it to be undefined
    if (isObject<{ [keys: string]: any }>(value)) {
      Object.entries(value).forEach(([k, v]) => {
        if (v === '_undefined_') {
          // eslint-disable-next-line no-param-reassign
          value[k] = undefined;
        } else if (!mutated.includes(v)) {
          mutated.push(v);
          mutateUndefined(v);
        }
      });
    }
    if (Array.isArray(value)) {
      value.forEach(v => {
        mutated.push(v);
        mutateUndefined(v);
      });
    }
  };
};

export const parse = (data: string, options: Partial<Options> = {}) => {
  const mergedOptions: Options = Object.assign({}, defaultOptions, options);
  const result = JSON.parse(data, reviver(mergedOptions));

  mutator()(result);

  return result;
};
