import clamp from 'lodash/clamp';
// cloneDeep
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
// get
import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';
// isEqual
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import isNumber from 'lodash/isNumber';
import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';
import isTypedArray from 'lodash/isTypedArray';
import merge from 'lodash/merge';
// mergewith
import mergeWith from 'lodash/mergeWith';
import pull from 'lodash/pull';
import throttle from 'lodash/throttle';
// uniq clamp
import uniq from 'lodash/uniq';
// upperFirst
import upperFirst from 'lodash/upperFirst';

// isFunction
import isFunction from 'lodash/isFunction';
// isObject
import isObject from 'lodash/isObject';
// isundefined
import isUndefined from 'lodash/isUndefined';

// camelCase
import camelCase from 'lodash/camelCase';

import uniqueId from 'lodash/uniqueId';

export type { DebouncedFunc } from 'lodash';

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
};
