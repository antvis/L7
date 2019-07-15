import Layer from '../core/layer';
import Global from '../global';
import { getRender } from './render';
const { pointShape } = Global;
/**
 * point shape 2d circle, traingle text,image
 * shape 3d   cube，column, sphere
 * shape Model ,自定义
 * image
 */

export default class PointLayer extends Layer {
  draw() {
    this.type = 'point';
    this.shapeType = this._getShape();
    const mesh = getRender(this.type, this.shapeType)(this.layerData, this, this.layerSource);
    this.add(mesh);
  }

  _getShape() {
    let shape = null;
    if (!this.layerData[0].hasOwnProperty('shape')) {
      return 'normal';
    }
    for (let i = 0; i < this.layerData.length; i++) {
      shape = this.layerData[i].shape;
      if (shape !== undefined) {
        break;
      }
    }

    // 2D circle 特殊处理
    if (pointShape['2d'].indexOf(shape) !== -1) {
      return 'circle';
    } else if (pointShape['3d'].indexOf(shape) !== -1) {
      return 'fill';
    } else if (this.scene.image.imagesIds.indexOf(shape) !== -1) {
      return 'image';
    }
    return 'text';
  }
  zoomchange(ev) {
    super.zoomchange(ev);
    requestAnimationFrame(() => {
      this._updateData();
    });
  }
  dragend(ev) {
    super.dragend(ev);
    requestAnimationFrame(() => {
      this._updateData();
    });

  }
  _updateData() {
    if (this.layerSource.get('isCluster')) {
      const bounds = this.scene.getBounds().toBounds();
      const SW = bounds.getSouthWest();
      const NE = bounds.getNorthEast();
      const zoom = this.scene.getZoom();
      const step = Math.max(NE.lng - SW.lng, NE.lat - SW.lat) / 2;
      const bbox = [ SW.lng, SW.lat, NE.lng, NE.lat ];
      // const bbox = [ SW.lng - step, SW.lat - step, NE.lng + step, NE.lat + step ];
      const cfg = this.layerSource.get('cluster');
      const preBox = cfg.bbox;
      const preZoom = cfg.zoom;
      if (!(preBox && preBox[0] < bbox[0] && preBox[1] < bbox[1] && preBox[2] > bbox[2] && preBox[3] < bbox[3] && // 当前范围在范围内
         (Math.abs(zoom - preZoom)) < 0.5)) {
        const newbbox = [ SW.lng - step, SW.lat - step, NE.lng + step, NE.lat + step ];
        this.layerSource.updateCusterData(Math.floor(zoom - 1), newbbox);
        this.repaint();
      }
    }
  }
}
PointLayer.type = 'point';
