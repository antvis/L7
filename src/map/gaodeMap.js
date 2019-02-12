export default class GaodeMap {
  constructor(map) {
    this.map = map;
  }
  getZoom() {
    return this.map.getZoom();
  }
  getCenter() {
    return this.map.getCenter();
  }
  getSize() {
    return this.map.getSize();
  }
  getPitch() {
    return this.map.getPitch();
  }
  getRotation() {
    return this.map.getRotation();
  }
  getStatus() {
    return this.map.getStatus();
  }
  getScale() {
    return this.map.getScale();
  }
  setZoom(zoom) {
    return this.map.setZoom(zoom);
  }
  setBounds(bounds) {
    return this.map.setBounds(bounds);
  }
  setRotation(rotation) {
    return this.map.setRotation(rotation);
  }
  zoomIn() {
    return this.map.zoomIn();
  }
  zoomOut() {
    return this.map.zoomOut();
  }
  panTo(lngLat) {
    return this.map.panTo(lngLat);
  }
  panBy(x, y) {
    return this.map.panBy(x, y);
  }
  setPitch(pitch) {
    return this.map.setPitch(pitch);
  }
  pixelToLngLat(lngLat, level) {
    return this.map.pixelToLngLat(lngLat, level);
  }
  lngLatToPixel(lngLat, level) {
    return this.map.lnglatToPixel(lngLat, level);

  }
  containerToLngLat(pixel) {
    const ll = new AMap.Pixel(pixel.x, pixel.y);
    return this.map.containerToLngLat(ll);
  }
  setMapStyle(style) {
    return this.map.setMapStyle(style);
  }


}
