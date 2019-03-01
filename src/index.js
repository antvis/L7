
// import Util from './util';
import Scene from './core/scene';
import Global from './global';

const version = Global.version;
const track = function(enable) {
  Global.trackable = enable;
};
export {
  version,
  Scene,
  track

};

