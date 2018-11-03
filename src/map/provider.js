import Base from '../core/base';
import * as Theme from '../theme/index';
import Util from '../util';
import { scene } from '../global';
const DEG2RAD = Math.PI / 180;
export class MapProvider extends Base {
  getDefaultCfg() {
    return Util.assign(scene, {
      resizeEnable: true,
      viewMode: '3D'
    });
  }
  constructor(container, cfg) {
    super(cfg);
    this.container = container;
    this.initMap();
    this.addOverLayer();
    setTimeout(() => {
      this.emit('mapLoad');
    }, 100);

  }

  initMap() {
    const mapStyle = this.get('mapStyle');
    switch (mapStyle) {
      case 'dark' :
        this.set('mapStyle', Theme.DarkTheme.mapStyle);
        break;
      case 'light':
        this.set('mapStyle', Theme.LightTheme.mapStyle);
        break;
      default:
        this.set('mapStyle', Theme.LightTheme.mapStyle);
    }
    this.set('zooms', [ this.get('minZoom'), this.get('maxZoom') ]);
    this.map = new AMap.Map(this.container, this._attrs);

  }
  asyncCamera(engine) {
    this._engine = engine;
    const camera = engine._camera;
    const scene = engine._scene;
    const pickScene = engine._picking._pickingScene;
    this.map.on('camerachange', e => {
      const mapCamera = e.camera;
      let { fov, near, far, height, pitch, rotation, aspect } = mapCamera;
      pitch *= DEG2RAD;
      rotation *= DEG2RAD;
      camera.fov = 180 * fov / Math.PI;
      camera.aspect = aspect;
      camera.near = near;
      camera.far = far;
      camera.updateProjectionMatrix();
      camera.position.z = height * Math.cos(pitch);
      camera.position.x = height * Math.sin(pitch) * Math.sin(rotation);
      camera.position.y = -height * Math.sin(pitch) * Math.cos(rotation);

      camera.up.x = -Math.cos(pitch) * Math.sin(rotation);
      camera.up.y = Math.cos(pitch) * Math.cos(rotation);
      camera.up.z = Math.sin(pitch);
      camera.lookAt(0, 0, 0);
      scene.position.x = -e.camera.position.x;
      scene.position.y = e.camera.position.y;
      pickScene.position.x = -e.camera.position.x;
      pickScene.position.y = e.camera.position.y;
    });
  }

  projectFlat(lnglat) {
    return this.map.lngLatToGeodeticCoord(lnglat);
  }
  getCenter() {
    return this.map.getCenter();
  }
  getCenterFlat() {
    return this.projectFlat(this.getCenter());
  }
  addOverLayer() {
    const canvasContainer = document.getElementById(this.container);
    this.canvasContainer = canvasContainer;
    this.renderDom = document.createElement('div');
    this.renderDom.style.cssText += 'position: absolute;top: 0; z-index:1;height: 100%;width: 100%;pointer-events: none;';
    this.renderDom.id = 'l7_canvaslayer';
    canvasContainer.appendChild(this.renderDom);
  }
}
