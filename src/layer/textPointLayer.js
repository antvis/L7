
import Layer from '../core/layer';
import PointGeometry from '../geom/bufferGeometry/point';
import { PointMaterial } from '../geom/material/point';
import { TextMaterial } from '../geom/material/text';
import TextGeometry from '../geom/bufferGeometry/text';
import { textBuffer } from '../geom/buffer/index';
import ColorUtil from '../attr/color-util';
export default class textPointLayer extends Layer {
  shape(type) {
    this.shape = type;
    return this;
  }
  render() {
    this.init();
    const styleOptions = this.get('styleOptions');
    const source = this.layerSource;
    const buffer = new textBuffer(
      {
        coordinates: source.geoData,
        properties: this.StyleData
      }
    );
    buffer.bufferStruct.drawMode = 'POINTS';
    const geometry = new TextGeometry(buffer.bufferStruct);
    const borderColor = ColorUtil.toRGB(styleOptions.borderColor).map(e => e / 255);
    if (borderColor.length === 3) {
      borderColor.push(1.0);
    }
    const material = new PointMaterial({
      name: 'text',
      u_texture: buffer.bufferStruct.utexture,
      u_opacity: styleOptions.opacity,
      u_strokeWidth: 0,
      u_stroke: borderColor,
      u_zoom: this.scene.map.getZoom()
    });
    this.scene.map.on('zoomchange', e => {
      const zoom = this.scene.map.getZoom();
      material.setValue('u_zoom', zoom);
    });
    this.renderer.geometry = geometry;
    this.renderer.setMaterial(material);

    return this;
  }
}
