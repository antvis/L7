import Layer from '../core/layer';
import * as THREE from '../core/three';
import PointBuffer from '../geom/buffer/point';
import PointMaterial from '../geom/material/pointMaterial';
import PolygonMaterial from '../geom/material/polygonMaterial';
import TextBuffer from '../geom/buffer/text';
import TextMaterial from '../geom/material/textMaterial';

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
    if (this.shapeType === 'text') { // 绘制文本图层

      this._textPoint();
      return;
    }
    const source = this.layerSource;
    const { opacity, strokeWidth, stroke } = this.get('styleOptions');
    this._buffer = new PointBuffer({
      type: this.shapeType,
      imagePos: this.scene.image.imagePos,
      coordinates: source.geoData,
      properties: this.StyleData
    });
    const geometry = this.geometry = new THREE.BufferGeometry();
    let mtl;
    if (this.shapeType === '2d' || this.shapeType === '3d') {
      mtl = new PolygonMaterial({
        u_opacity: opacity,
        u_zoom: this.scene.getZoom()
      });
      mtl.setDefinesvalue('SHAPE', true);
    } else { // sdf 绘制点
      mtl = new PointMaterial({
        u_opacity: opacity,
        u_strokeWidth: strokeWidth,
        u_stroke: stroke,
        shape: this.shapeType || false,
        u_texture: this.scene.image.texture
      }, {
        SHAPE: (this.shapeType !== 'image'),
        TEXCOORD_0: (this.shapeType === 'image')
      });
    }

    const { attributes } = this._buffer;
    console.log(attributes);
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
    geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
    geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
    if (this.shapeType === 'image') {
      geometry.addAttribute('uv', new THREE.Float32BufferAttribute(attributes.uvs, 2));
      geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
    } else { // 多边形面
      geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
      geometry.addAttribute('a_shape', new THREE.Float32BufferAttribute(attributes.shapePositions, 3));
      geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.a_size, 3));
    }
    let mesh;
    if (this.shapeType === 'image') {
      mesh = new THREE.Points(geometry, mtl);
    } else if (this.shapeType === undefined) { // 散点图
      mesh = new THREE.Points(geometry, mtl);
      geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));


    } else {
      mesh = new THREE.Mesh(geometry, mtl);
    }

    this.add(mesh);
  }
  _textPoint() {
    const source = this.layerSource;
    const styleOptions = this.get('styleOptions');
    const buffer = new TextBuffer({
      type: this.shapeType,
      coordinates: source.geoData,
      properties: this.StyleData,
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
        u_strokeWidth: 1,
        u_stroke: stroke,
        u_textSize: buffer.bufferStruct.textSize,
        u_gamma: 0.11,
        u_buffer: 0.8,
        u_color: color,
        u_glSize: [ width, height ]
      });
      const mesh = new THREE.Mesh(geometry, material);
      this.add(mesh);

    });

  }

}

