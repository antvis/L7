// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import throttle from 'lodash/throttle';
import { Map } from './map';

/*
 * Adds the map's position to its page's location hash.
 * Passed as an option to the map object.
 *
 * @returns {Hash} `this`
 */
class Hash {
  private map: Map;
  private updateHash: () => number | void;
  private hashName?: string;

  constructor(hashName?: string) {
    this.hashName = hashName && encodeURIComponent(hashName);

    // Mobile Safari doesn't allow updating the hash more than 100 times per 30 seconds.
    this.updateHash = throttle(this.updateHashUnthrottled, (30 * 1000) / 100);
  }
  public addTo(map: Map) {
    this.map = map;
    window.addEventListener('hashchange', this.onHashChange, false);
    this.map.on('moveend', this.updateHash);
    return this;
  }
  public remove() {
    window.removeEventListener('hashchange', this.onHashChange, false);
    this.map.off('moveend', this.updateHash);
    // clearTimeout(this.updateHash());

    delete this.map;
    return this;
  }

  public onHashChange = () => {
    const loc = this.getCurrentHash();
    if (loc.length >= 3 && !loc.some((v: string) => isNaN(+v))) {
      const bearing =
        this.map.dragRotate.isEnabled() && this.map.touchZoomRotate.isEnabled()
          ? +(loc[3] || 0)
          : this.map.getBearing();
      this.map.jumpTo({
        center: [+loc[2], +loc[1]],
        zoom: +loc[0],
        bearing,
        pitch: +(loc[4] || 0),
      });
      return true;
    }
    return false;
  };

  private getCurrentHash = () => {
    // Get the current hash from location, stripped from its number sign
    const hash = window.location.hash.replace('#', '');
    if (this.hashName) {
      // Split the parameter-styled hash into parts and find the value we need
      let keyval;
      hash
        .split('&')
        .map((part) => part.split('='))
        .forEach((part) => {
          if (part[0] === this.hashName) {
            keyval = part;
          }
        });
      return (keyval ? keyval[1] || '' : '').split('/');
    }
    return hash.split('/');
  };

  private getHashString(mapFeedback?: boolean) {
    const center = this.map.getCenter();
    const zoom = Math.round(this.map.getZoom() * 100) / 100;
    // derived from equation: 512px * 2^z / 360 / 10^d < 0.5px
    const precision = Math.ceil(
      (zoom * Math.LN2 + Math.log(512 / 360 / 0.5)) / Math.LN10,
    );
    const m = Math.pow(10, precision);
    const lng = Math.round(center.lng * m) / m;
    const lat = Math.round(center.lat * m) / m;
    const bearing = this.map.getBearing();
    const pitch = this.map.getPitch();
    let hash = '';
    if (mapFeedback) {
      // new map feedback site has some constraints that don't allow
      // us to use the same hash format as we do for the Map hash option.
      hash += `/${lng}/${lat}/${zoom}`;
    } else {
      hash += `${zoom}/${lat}/${lng}`;
    }

    if (bearing || pitch) {
      hash += `/${Math.round(bearing * 10) / 10}`;
    }
    if (pitch) {
      hash += `/${Math.round(pitch)}`;
    }

    if (this.hashName) {
      const hashName = this.hashName;
      let found = false;
      const parts = window.location.hash
        .slice(1)
        .split('&')
        .map((part) => {
          const key = part.split('=')[0];
          if (key === hashName) {
            found = true;
            return `${key}=${hash}`;
          }
          return part;
        })
        .filter((a) => a);
      if (!found) {
        parts.push(`${hashName}=${hash}`);
      }
      return `#${parts.join('&')}`;
    }

    return `#${hash}`;
  }

  private updateHashUnthrottled = () => {
    const hash = this.getHashString();
    try {
      window.history.replaceState(window.history.state, '', hash);
    } catch (SecurityError) {
      // IE11 does not allow this if the page is within an iframe created
      // with iframe.contentWindow.document.write(...).
      // https://github.com/mapbox/mapbox-gl-js/issues/7410
    }
  };
}

export default Hash;
