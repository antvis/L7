import Base from '../core/base';
import Global from '../global';
import * as Theme from '../theme/index';
import Util from '../util';
const DEG2RAD = Math.PI / 180;
export default class GaodeMap extends Base {
  getDefaultCfg() {
    return Util.assign(Global.scene, {
      resizeEnable: true,
      viewMode: '3D'
    });
  }
  static project(lnglat) {
    const maxs = 85.0511287798;
    const lat = Math.max(Math.min(maxs, lnglat[1]), -maxs);
    const scale = 256 << 20;
    let d = Math.PI / 180;
    let x = lnglat[0] * d;
    let y = lat * d;
    y = Math.log(Math.tan(Math.PI / 4 + y / 2));
    const a = 0.5 / Math.PI,
      b = 0.5,
      c = -0.5 / Math.PI;
    d = 0.5;
    x = scale * (a * x + b) - 215440491;
    y = -(scale * (c * y + d) - 106744817);
    return { x, y };
  }
  constructor(cfg) {
    super(cfg);
    this.container = this.get('id');
    this.initMap();
    this.addOverLayer();
    setTimeout(() => {
      this.emit('mapLoad');
    }, 100);
  }

  initMap() {
    const mapStyle = this.get('mapStyle');

    switch (mapStyle) {
      case 'dark':
        this.set('mapStyle', Theme.DarkTheme.mapStyle);
        break;
      case 'light':
        this.set('mapStyle', Theme.LightTheme.mapStyle);
        break;
      default:
        this.set('mapStyle', mapStyle);
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
      camera.fov = (180 * fov) / Math.PI;
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
    this.renderDom.style.cssText +=
      'position: absolute;top: 0; z-index:1;height: 100%;width: 100%;pointer-events: none;';
    this.renderDom.id = 'l7_canvaslayer';
    canvasContainer.appendChild(this.renderDom);
  }
  mixMap(scene) {
    const map = this.map;
    scene.getZoom = () => {
      return map.getZoom();
    };
    scene.getCenter = () => {
      return map.getCenter();
    };
    scene.getSize = () => {
      return map.getSize();
    };
    scene.getPitch = () => {
      return map.getPitch();
    };
    scene.getRotation = () => {
      return map.getRotation();
    };
    scene.getStatus = () => {
      return map.getStatus();
    };
    scene.getScale = () => {
      return map.getScale();
    };
    scene.getZoom = () => {
      return map.getZoom();
    };
    scene.setZoom = zoom => {
      return map.setZoom(zoom);
    };
    scene.setBounds = extent => {
      return map.setBounds(new AMap.Bounds([ extent[0], extent[1] ], [ extent[2], extent[3] ]));
    };
    scene.setRotation = rotation => {
      return map.setRotation(rotation);
    };
    scene.zoomIn = () => {
      return map.zoomIn();
    };
    scene.zoomOut = () => {
      return map.zoomOut();
    };
    scene.panTo = lnglat => {
      return map.panTo(new AMap.LngLat(lnglat[0], lnglat[1]));
    };
    scene.panBy = (x, y) => {
      return map.panBy(x, y);
    };
    scene.setPitch = pitch => {
      return map.setPitch(pitch);
    };
    scene.pixelToLngLat = pixel => {
      const ll = new AMap.Pixel(pixel[0], pixel[1]);
      return map.pixelToLngLat(ll);
    };
    scene.lngLatToPixel = lnglat => {
      return map.lngLatToPixel(new AMap.LngLat(lnglat[0], lnglat[1]));
    };
    scene.setMapStyle = style => {
      return map.setMapStyle(style);
    };
    scene.fitBounds = extent => {
      return map.setBounds(
        new AMap.Bounds([ extent[0], extent[1] ], [ extent[2], extent[3] ])
      );
    };
    scene.containerToLngLat = pixel => {
      const ll = new AMap.Pixel(pixel.x, pixel.y);
      return map.containerToLngLat(ll);
    };
  }
}
