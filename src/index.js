import './component/css/l7.css';
import Scene from './core/scene';
import Global from './global';
import Source from './core/source';
import TileSource from './source/tile_source';
import { registerParser, registerTransform } from './source';
import { registerInteraction, getInteraction } from './interaction';
import { registerLayer } from './layer';
import Popup from './component/popup';
import * as Control from './component/control';
const version = Global.version;
const exported = {
  version,
  Scene,
  Source,
  TileSource,
  registerParser,
  registerTransform,
  registerLayer,
  registerInteraction,
  getInteraction,
  Popup,
  Control
};
export default exported;
