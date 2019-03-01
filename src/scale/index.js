/**
 * @fileOverview Scale entry, used to reference all the scales
 * @author dxq613@gmail.com
 */

import Util from '../util';
import Base from './base';
import Linear from './linear';
import Identity from './identity';
import Cat from './category';
import Time from './time';
import TimeCat from './time-cat';
import Log from './log';
import Pow from './pow';

Base.Linear = Linear;
Base.Identity = Identity;
Base.Cat = Cat;
Base.Time = Time;
Base.TimeCat = TimeCat;
Base.Log = Log;
Base.Pow = Pow;

for (const k in Base) {
  if (Base.hasOwnProperty(k)) {
    const methodName = Util.lowerFirst(k);
    Base[methodName] = function(cfg) {
      return new Base[k](cfg);
    };
  }
}

const CAT_ARR = [ 'cat', 'timeCat' ];

Base.isCategory = function(type) {
  return CAT_ARR.indexOf(type) >= 0;
};

export default Base;
