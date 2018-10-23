import imageSource from './imageSource';
export class RainSource extends imageSource {
  prepareData() {
    const extent = this.get('extent');
    const lb = this._coorConvert(extent.slice(0, 2));
    const tr = this._coorConvert(extent.slice(2, 4));
    this.extent = [ lb, tr ];
    this.propertiesData = [];
    this._genaratePoints();
    this._loadData();
  }
  _genaratePoints() {
    const extent = this.get('extent');
    const numParticles = 512 * 512;

    const particleRes = this.particleRes = Math.ceil(Math.sqrt(numParticles));
    const numPoints = particleRes * particleRes;
    const particleState = [];
    const particleState0 = new Uint8ClampedArray(numPoints * 4);
    const particleState1 = new Uint8ClampedArray(numPoints * 4);
    const emptyPixels = new Uint8ClampedArray(numPoints * 4);
    for (let i = 0; i < particleState0.length; i++) {
      particleState0[i] = Math.floor(Math.random() * 256); // randomize the initial particle positions
    }
    this.particleIndices = new Float32Array(numPoints);
    for (let i = 0; i < numPoints; i++) this.particleIndices[i] = i;
    this.particleImage0 = new ImageData(particleState0, particleRes, particleRes);
    this.particleImage1 = new ImageData(particleState1, particleRes, particleRes);
    this.backgroundImage = new ImageData(emptyPixels, particleRes, particleRes);
    this.geoData = particleState;
  }
}
