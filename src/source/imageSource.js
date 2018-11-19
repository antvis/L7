import Source from '../core/source';
import { getImage } from '../util/ajax';
export default class ImageSource extends Source {
  prepareData() {
    this.type='image';
    const extent = this.get('extent');
    const lb = this._coorConvert(extent.slice(0, 2));
    const tr = this._coorConvert(extent.slice(2, 4));
    this.geoData = [ lb, tr ];
    this.propertiesData = [];
    this._loadData();
  }
  _loadData() {
    const url = this.get('data');
    this.image = [];
    if (typeof (url) === 'string') {
      getImage({ url }, (err, img) => {
        this.image = img;
        this.emit('imageLoaded');
      });
    } else {
      const imageCount = url.length;
      let imageindex = 0;
      url.forEach(item => {
        getImage({ url: item }, (err, img) => {
          imageindex++;
          this.image.push(img);
          if (imageindex === imageCount) {
            this.emit('imageLoaded');
          }

        });
      });

    }
  }
}
