export class LatLng {
  constructor(lat, lng, alt) {
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
    }
    this.lat = +lat;
    this.lng = +lng;
    if (alt !== undefined) {
      this.alt = +alt;
    }

  }
  equal() {

  }
  distanceTo() {

  }

}
