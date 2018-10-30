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
    switch (this.shapeType) {
      case 'model':
        this._staticModelPoint();
        break;
      case 'image':
        this._imagePoint();
        break;
      case '2d':
        this._2dPoint();
        break;
      case 'text':
        this._textPoint();
        break;
      case '3d':
        this._shapePoint();
        break;
      default:
        this._2dPoint();
        break;

    }
    return this;
  }
  _imagePoint() {
    const { opacity, strokeWidth, stroke } = this.get('styleOptions');
    const source = this.layerSource;
    this.scene.image.on('imageLoaded', () => {
      const geometry = new THREE.BufferGeometry();
      const buffer = new PointBuffer({
        imagePos: this.scene.image.imagePos,
        type: this.shapeType,
        coordinates: source.geoData,
        properties: this.StyleData
      });
      const mtl = new PointMaterial({
        u_opacity: opacity,
        u_strokeWidth: strokeWidth,
        u_stroke: stroke,
        u_texture: this.scene.image.texture
      });
      const { attributes } = buffer;
      geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
      geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
      geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
      geometry.addAttribute('uv', new THREE.Float32BufferAttribute(attributes.uvs, 2));
      geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
      const mesh = new THREE.Points(geometry, mtl);
      this.add(mesh);

    });
    return this;
  }
  // sdf 绘制多边形
  _2dPoint() {
    const source = this.layerSource;
    const { opacity, strokeWidth, stroke } = this.get('styleOptions');

    const buffer = new PointBuffer({
      type: this.shapeType,
      coordinates: source.geoData,
      properties: this.StyleData
    });
    this.buffer = buffer;
    const geometry = new THREE.BufferGeometry();
    const mtl = new PointMaterial({
      u_opacity: opacity,
      u_strokeWidth: strokeWidth,
      u_stroke: stroke,
      shape: this.shapeType || false
    });
    const { attributes } = buffer;
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
    geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
    geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
    geometry.addAttribute('a_shape', new THREE.Float32BufferAttribute(attributes.shapes, 1));
    geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
    const mesh = new THREE.Points(geometry, mtl);
    this.remove(this.layerMesh);
    this.add(mesh);
    this.layerMesh = mesh;
    this.updateFilter(this.StyleData);

  }
  _shapePoint() {
    const source = this.layerSource;
    const geometry = new THREE.BufferGeometry();
    const material = new PolygonMaterial({
      u_opacity: 1.0
    });
    const buffer = new PointBuffer({
      type: this.shapeType,
      coordinates: source.geoData,
      properties: this.StyleData
    });
    this.buffer = buffer;
    const { attributes } = buffer;
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
    geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
    geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
    geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));

    const mesh = new THREE.Mesh(geometry, material);
    this.remove(this.layerMesh);
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
        u_gamma: 0.08,
        u_buffer: 0.75,
        u_color: color,
        u_glSize: [ width, height ]
      });
      const mesh = new THREE.Mesh(geometry, material);
      this.add(mesh);

    });

  }
  _getPointScale() {
    const zoom = this.scene.map.getZoom();
    const size = this.get('styleOptions').size * Math.pow(2, 18 - zoom);
    const out = new THREE.Matrix4();
    out.scale([ size, size, size ]);
    return out;
  }
  _customPoint() {
  }
  // todo add pickUP
  _staticModelPoint() {

    const source = this.layerSource;
    this.resourceLoader.once('batchLoaded', e => {
      const gltfs = e.data;
      source.geoData.forEach((pt, index) => {
        const { size, shape } = this.StyleData[index];
        const model = gltfs[shape].asset.rootScene.nodes[0];
        const gltfNode = model.clone();
        gltfNode.position = [ pt[0], pt[1], pt[2] ];
        gltfNode.rotateByAngles(90, 0, 0);
        gltfNode.scale = [ size, size, size ];
        this.layerNode.addChild(gltfNode);
        this._animations(gltfNode, gltfs[shape]);

      });


    });

  }
}

