const PRECISION = 0.00001; // 常量，据的精度，小于这个精度认为是0
const RADIAN = Math.PI / 180;
const DEGREE = 180 / Math.PI;

module.exports = {
  isFunction: require('lodash/isFunction'),
  isObject: require('lodash/isObject'),
  isBoolean: require('lodash/isBoolean'),
  isNil: require('lodash/isNil'),
  isString: require('lodash/isString'),
  isArray: require('lodash/isArray'),
  isNumber: require('lodash/isNumber'),
  isEmpty: require('lodash/isEmpty'), // isBlank
  uniqueId: require('lodash/uniqueId'),
  clone: require('lodash/clone'),
  assign: require('lodash/assign'), // simpleMix
  merge: require('lodash/merge'), // mix
  upperFirst: require('lodash/upperFirst'), // ucfirst
  remove: require('lodash/pull'),
  each: require('lodash/forEach'),
  isEqual: require('lodash/isEqual'),
  toArray: require('lodash/toArray'),
  extend(subclass, superclass, overrides, staticOverrides) {
    // 如果只提供父类构造函数，则自动生成子类构造函数
    if (!this.isFunction(superclass)) {
      overrides = superclass;
      superclass = subclass;
      subclass = function() {};
    }

    const create = Object.create ?
      function(proto, c) {
        return Object.create(proto, {
          constructor: {
            value: c
          }
        });
      } :
      function(proto, c) {
        function F() {}

        F.prototype = proto;
        const o = new F();
        o.constructor = c;
        return o;
      };

    const superObj = create(superclass.prototype, subclass); // new superclass(),//实例化父类作为子类的prototype
    subclass.prototype = this.merge(superObj, subclass.prototype); // 指定子类的prototype
    subclass.superclass = create(superclass.prototype, superclass);
    this.merge(superObj, overrides);
    this.merge(subclass, staticOverrides);
    return subclass;
  },
  augment(c) {
    const args = this.toArray(arguments);
    for (let i = 1; i < args.length; i++) {
      let obj = args[i];
      if (this.isFunction(obj)) {
        obj = obj.prototype;
      }
      this.merge(c.prototype, obj);
    }
  },
  /**
   * 判断两个数是否相等
   * @param {Number} a 数
   * @param {Number} b 数
   * @return {Boolean} 是否相等
   **/
  isNumberEqual(a, b) {
    return Math.abs((a - b)) < PRECISION;
  },
  /**
   * 获取角度对应的弧度
   * @param {Number} degree 角度
   * @return {Number} 弧度
   **/
  toRadian(degree) {
    return RADIAN * degree;
  },
  /**
   * 获取弧度对应的角度
   * @param {Number} radian 弧度
   * @return {Number} 角度
   **/
  toDegree(radian) {
    return DEGREE * radian;
  },
  /**
   * 广义取模运算
   * @param {Number} n 被取模的值
   * @param {Number} m 模
   * @return {Number} 返回n 被 m 取模的结果
   */
  mod(n, m) {
    return ((n % m) + m) % m;
  },
  /**
   * 把a夹在min，max中间, 低于min的返回min，高于max的返回max，否则返回自身
   * @param {Number} a 数
   * @param {Number} min 下限
   * @param {Number} max 上限
   * @return {Number} 返回结果值
   **/
  clamp(a, min, max) {
    if (a < min) {
      return min;
    } else if (a > max) {
      return max;
    }

    return a;
  }
};
