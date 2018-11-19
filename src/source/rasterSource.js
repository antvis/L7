import Source from '../core/source';
export default class RasterSource extends Source {
  prepareData() {
    this.type='raster';
    const extent = this.get('extent');
    const lb = this._coorConvert(extent.slice(0, 2));
    const tr = this._coorConvert(extent.slice(2, 4));
    this.geoData = [ lb, tr ];
    this.propertiesData = [];
    this.rasterData = {
      data: this.get('data'),
      width: this.get('width'),
      height: this.get('height'),
      min: this.get('min'),
      max: this.get('max')
    };

  }

}
