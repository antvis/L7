import * as THREE from '../core/three';
import Layer from '../core/layer';
import PolygonBuffer from '../geom/buffer/polygon';
import PolygonMaterial from '../geom/material/polygonMaterial';
import { LineMaterial } from '../geom/material/lineMaterial';
export default class PolygonLayer extends Layer {
  shape(type) {
    this.shape = type;
    return this;
  }
  render() {
    if (!this._hasRender) { // 首次渲染
      this._hasRender = true;
      this._prepareRender();
    } else {

      this._initAttrs();
      (this._needUpdateFilter || this._needUpdateColor) ? this._updateFilter() : null;
      const { opacity, baseColor, brightColor, windowColor } = this.get('styleOptions');
      this.layerMesh.material.upDateUninform({
        u_opacity: opacity,
        u_baseColor: baseColor,
        u_brightColor: brightColor,
        u_windowColor: windowColor
      });

    }


    return this;
  }
  _prepareRender() {
    this.init();
    this.type = 'polygon';

    const source = this.layerSource;
    this._buffer = new PolygonBuffer({
      shape: this.shape,
      coordinates: source.geoData,
      properties: this.StyleData
    });
    const { attributes } = this._buffer;
    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
    this.geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
    this.geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
    if (this.shape === 'line') {
      this._renderLine();
    } else {
      this._renderPolygon();
    }
  }
  _renderLine() {
    const { opacity } = this.get('styleOptions');
    const lineMaterial = new LineMaterial({
      u_opacity: opacity
    });
    const polygonLine = new THREE.LineSegments(this.geometry, lineMaterial);
    this.add(polygonLine);

  }
  _renderPolygon() {
    const animateOptions = this.get('animateOptions');
    const { opacity, baseColor, brightColor, windowColor } = this.get('styleOptions');
    const material = new PolygonMaterial({
      u_opacity: opacity,
      u_baseColor: baseColor,
      u_brightColor: brightColor,
      u_windowColor: windowColor
    });

    const { attributes } = this._buffer;
    this.geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
    if (animateOptions.enable) {
      material.setDefinesvalue('ANIMATE', true);

      this.geometry.addAttribute('faceUv', new THREE.Float32BufferAttribute(attributes.faceUv, 2));
      this.geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
    }

   // const pickmaterial = new PickingMaterial();
    const polygonMesh = new THREE.Mesh(this.geometry, material);
    this.add(polygonMesh);
  }

  update() {
    this.updateFilter(this.StyleData);
    // 动态更新相关属性
  }

}
