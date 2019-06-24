import Source from '../core/source';
import { getArrayBuffer } from '../util/ajax';
import TileDataCache from './tileDataCache';
const tileURLRegex = /\{([zxy])\}/g;
export default class TileSource extends Source {
  constructor(url, cfg) {
    super(cfg);
    this.cfg = cfg;
    this.urlTemplate = url;
    this._tileDataCache = new TileDataCache(50, this.tileDestroy);
    this.type = 'tile';


  }
  getTileData(x, y, z) {
    const key = [ x, y, z ].join('_');
    let tileData = this._tileDataCache.getTile(key);
    if (!tileData) {
      const tiledataPromise = new Promise(resolve => {
        if (tileData) {
          setTimeout(() => {
            resolve(tileData);
          }, 0);
        } else {
          this._requestTileData(x, y, z, resolve);
        }
      });
      tileData = {
        loading: true,
        data: tiledataPromise
      };
      this._tileDataCache.setTile(tileData, key);
      return tileData;
    }
    return tileData;

  }
  _init() {
    const parser = this.get('parser');
    this.set('minSourceZoom', parser && parser.minZoom || 0);
    this.set('maxSourceZoom', parser && parser.maxZoom || 18);
  }
  _generateSource(x, y, z, data) {
    this.cfg.parser.tile = [ x, y, z ];
    const tileData = new Source({
      ...this.cfg,
      mapType: this.get('mapType'),
      data,
      tile: [ x, y, z ]
    });
    return tileData;
  }
  _requestTileData(x, y, z, done) {
    const urlParams = { x, y, z };
    const url = this._getTileURL(urlParams);
    const key = [ x, y, z ].join('_');
    this.xhrRequest = getArrayBuffer({ url }, (err, data) => {
      if (err) {
        this._noData = true;
        this._tileDataCache.setTile({ loaded: true, data: { data: null } }, key);
        return;
      }
      const tileData = this._generateSource(x, y, z, data.data);
      this._tileDataCache.setTile({ loaded: true, data: tileData }, key);
      done(tileData);
    });

  }
  _getTileURL(urlParams) {
    if (!urlParams.s) {
      // Default to a random choice of a, b or c
      urlParams.s = String.fromCharCode(97 + Math.floor(Math.random() * 3));
    }

    tileURLRegex.lastIndex = 0;
    return this.urlTemplate.replace(tileURLRegex, function(value, key) {
      return urlParams[key];
    });
  }
  tileDestroy(tile) {
    if (!tile || !tile.data || tile.loading || !tile.data.data.dataArray) {
      return;
    }
    const tileData = tile.data;
    tileData.destroy();
    tileData.data.dataArray.length = 0;
    tileData.data.featureKeys = null;
    tileData.originData.dataArray.length = 0;
    tileData.originData.featureKeys = null;
  }

}
