import { getJSON } from '../util/ajax';
import { GeojsonSource } from '../source/geojsonSource';
const EventEmitter = require('wolfy87-eventemitter');
export class geoJsonSourceWorker extends EventEmitter {
  constructor(cfg) {
    super();
    this.source = new GeojsonSource(cfg);
  }
  _loadData(url) {
    const data = this.source.get('data');
    if (typeof (data) === 'string') {
      this.emit('dataLoading');
      getJSON(url, data => {
        this.emit('dataLoaded', { data });

      });
    }

  }


}
