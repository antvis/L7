import Layer from '../core/layer';
import * as THREE from '../core/three';
import * as drawPoint from '../layer/render/point';
import { pointShape } from '../global';
// import PointBuffer from '../geom/buffer/point';
import TextBuffer from '../geom/buffer/text';
import TextMaterial from '../geom/material/textMaterial';
import * as PointBuffer from '../geom/buffer/point/index';

/**
 * point shape 2d circle, traingle text,image
 * shape 3d   cube，column, sphere
 * shape Model ,自定义
 * image
 *
 */

export default class PointLayer extends Layer {

  render() {
    this.type = 'point';

    this.init();
    if (!this._hasRender) {
      this._prepareRender(this.shapeType);
      this._hasRender = true;
    } else {
      this._initAttrs();
      (this._needUpdateFilter || this._needUpdateColor) ? this._updateFilter() : null;
    }
    return this;
  }
  _prepareRender() {
    const { stroke, fill } = this.get('styleOptions');
    if (this.shapeType === 'text') { // 绘制文本图层

      this._textPoint();
      return;
    }
    const source = this.layerSource;
    const style = this.get('styleOptions');
    const pointShapeType = this._getShape();

    switch (pointShapeType) {
      case 'fill' :// 填充图形
        {
          if (fill !== 'none') { // 是否填充
            const attributes = PointBuffer.FillBuffer(this.layerData, style);
            const meshfill = drawPoint.DrawFill(attributes, this.get('styleOptions'));
            this.add(meshfill);
          }
          if (stroke !== 'none') { // 是否绘制边界
            const lineAttribute = PointBuffer.StrokeBuffer(this.layerData, style);
            const meshStroke = drawPoint.DrawStroke(lineAttribute, this.get('styleOptions'));
            this.add(meshStroke, 'line');
          }
          break;
        }
      case 'image':// 绘制图片标注
        {
          const imageAttribute = PointBuffer.ImageBuffer(this.layerData, { imagePos: this.scene.image.imagePos });
          const imageMesh = drawPoint.DrawImage(imageAttribute, { ...style, texture: this.scene.image.texture });
          this.add(imageMesh);
          break;
        }
      case 'normal' : // 原生点
        {
          const normalAttribute = PointBuffer.NormalBuffer(this.layerData, style);
          const normalPointMesh = drawPoint.DrawNormal(normalAttribute, style);
          this.add(normalPointMesh);
          break;
        }
      default:
        return null;
    }
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
    if (pointShape['2d'].indexOf(shape) !== -1 || pointShape['3d'].indexOf(shape) !== -1) {
      return 'fill';
    } else if (shape === 'text') {
      return 'text';
    } else if (this.scene.image.imagesIds.indexOf(shape) !== -1) {
      return 'image';
    }
    return 'normal';


  }
  _textPoint() {
    const source = this.layerSource;
    const styleOptions = this.get('styleOptions');
    const buffer = new TextBuffer({
      type: this.shapeType,
      layerData: this.layerData,
      style: this.get('styleOptions')
    });

    buffer.on('completed', () => {
      const { color, stroke } = styleOptions;
      const geometry = new THREE.BufferGeometry();
      geometry.addAttribute('position', new THREE.Float32BufferAttribute(buffer.attributes.originPoints, 3));
      geometry.addAttribute('uv', new THREE.Float32BufferAttribute(buffer.attributes.textureElements, 2));
      geometry.addAttribute('a_txtsize', new THREE.Float32BufferAttribute(buffer.attributes.textSizes, 2));
      geometry.addAttribute('a_txtOffsets', new THREE.Float32BufferAttribute(buffer.attributes.textOffsets, 2));
      geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(buffer.attributes.colors, 4));
      const { width, height } = this.scene.getSize();
      const material = new TextMaterial({
        name: this.layerId,
        u_texture: buffer.bufferStruct.textTexture,
        u_strokeWidth: styleOptions.strokeWidth,
        u_stroke: stroke,
        u_textSize: buffer.bufferStruct.textSize,
        u_gamma: 2 * 1.4142 / 64,
        u_buffer: 0.65,
        u_color: color,
        u_glSize: [ width, height ]
      });
      const mesh = new THREE.Mesh(geometry, material);
      this.add(mesh);

    });

  }

}

