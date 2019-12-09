import Base from '../core/base';
import Global from '../global';
import * as Theme from '../theme/index';
import Util from '../util';
const DEG2RAD = Math.PI / 180;
let canvasCount = 0;
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
  constructor(container, cfg) {
    super(cfg);
    this.container = container;
    this.initMap();
  }

  initMap() {
    window.forceWebGL = true;
    const mapStyle = this.get('mapStyle');
    if (mapStyle) {
      switch (mapStyle) {
        case 'dark':
          this.set('mapStyle', Theme.darkTheme.mapStyle);
          break;
        case 'light':
          this.set('mapStyle', Theme.lightTheme.mapStyle);
          break;
        case 'blank':
          this.set('mapStyle', Theme.blankTheme.mapStyle);
          break;
        default:
          this.set('mapStyle', mapStyle);
      }
    }
    this.set('zooms', [ this.get('minZoom'), this.get('maxZoom') ]);
    const map = this.get('map');
    if (map instanceof AMap.Map) {
      this.map = map;
      this.container = map.getContainer();
      if (mapStyle) {
        this.setMapStyle(mapStyle);
      }
      this.addOverLayer();
      setTimeout(() => { this.emit('mapLoad'); }, 100);
    } else {
      this.map = new AMap.Map(this.container, this._attrs);
      this.map.on('complete', () => {
        if (mapStyle === 'blank') {
          this.map.setLayers([]);
        }
        this.addOverLayer();
        this.emit('mapLoad');
      });
    }

  }
  asyncCamera(engine) {
    this._engine = engine;
    this.map.on('camerachange', this.updateCamera.bind(this));
    this.updateCamera();

  }
  updateCamera() {
    const camera = this._engine._camera;
    const mapCamera = this.map.getCameraState();
    if (!mapCamera || !mapCamera.fov) return;
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
    camera.position.x += mapCamera.position.x;
    camera.position.y += -mapCamera.position.y;
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
    this.amapContainer = this.map.getContainer().getElementsByClassName('amap-maps')[0];
    if (!this.amapContainer) {
      throw new Error('确保高德地图实例化完成再创建初始化L7 scene');
    }
    this.renderDom = document.createElement('div');
    this.renderDom.style.cssText +=
      'position: absolute;top: 0;height: 100%;width: 100%;pointer-events: none;';
    this.renderDom.id = 'l7_canvaslayer' + canvasCount++;

    this.amapContainer.appendChild(this.renderDom);
    this.l7_marker_Container = document.createElement('div');
    this.l7_marker_Container.className = 'l7_marker';
    this.amapContainer.appendChild(this.l7_marker_Container);
  }
  setMapStyle(style) {
    const map = this.map;
    switch (style) {
      case 'dark':
        this.set('mapStyle', Theme.darkTheme.mapStyle);
        break;
      case 'light':
        this.set('mapStyle', Theme.lightTheme.mapStyle);
        break;
      case 'blank':
        this.set('mapStyle', Theme.blankTheme.mapStyle);
        break;
      default:
        this.set('mapStyle', style);
    }
    map.setMapStyle(this.get('mapStyle'));
    if (style === 'blank') {
      map.setLayers([]);
    }
    return;
  }
  mixMap(scene) {
    const map = this.map;
    scene.project = GaodeMap.project;
    scene.getZoom = () => {
      return map.getZoom();
    };
    scene.getCenter = () => {
      return map.getCenter();
    };
    scene.getSize = () => {
      return map.getSize();
    };
    scene.setCenter = center => {
      const lnglat = new AMap.LngLat(center[0], center[1]);
      return map.setCenter(lnglat);
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
    scene.setZoom = zoom => {
      return map.setZoom(zoom);
    };
    scene.getBounds = () => {
      return map.getBounds();
    };
    scene.setMapStyle = style => {
      return this.setMapStyle(style);
    };
    scene.setZoomAndCenter = (zoom, center) => {
      const lnglat = new AMap.LngLat(center[0], center[1]);
      return map.setZoomAndCenter(zoom, lnglat);
    };
    scene.setFeature = features => {
      return map.setFeature(features);
    };
    scene.setBounds = extent => {
      return map.setBounds(new AMap.Bounds([ extent[0], extent[1] ], [ extent[2], extent[3] ]));
    };
    scene.setRotation = rotation => {
      return map.setRotation(rotation);
    };
    scene.setStatus = status => {
      return map.setStatus(status);
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
      return map.lnglatToPixel(new AMap.LngLat(lnglat[0], lnglat[1]));
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
    scene.lngLatToContainer = lnglat => {
      const ll = new AMap.LngLat(lnglat[0], lnglat[1]);
      return map.lngLatToContainer(ll);
    };
    scene.lngLatToGeodeticCoord = lnglat => {
      const ll = new AMap.LngLat(lnglat[0], lnglat[1]);
      return map.lngLatToGeodeticCoord(ll);
    };
  }
}
