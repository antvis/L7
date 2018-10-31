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
    this.type = 'polygon';
    this.init();
    const source = this.layerSource;
    const geometry = this.geometry = new THREE.BufferGeometry();
    const lineMaterial = new LineMaterial({
      u_opacity: 1.0
    }
    );
    const buffer = this.buffer = new PolygonBuffer({
      shape: this.shape,
      coordinates: source.geoData,
      properties: this.StyleData
    });

    const { attributes } = buffer;
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
    geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
    geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
    this.geometry = geometry;
    let polygonMesh = '';
    if (this.shape === 'line') {
      polygonMesh = new THREE.LineSegments(geometry, lineMaterial);
    } else {
      const material = new PolygonMaterial({
        u_opacity: 1.0
      });
      geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
      polygonMesh = new THREE.Mesh(geometry, material);
    }

    this.add(polygonMesh);
    this.update();
    return this;
  }
  update() {
    this.updateFilter(this.StyleData);
    // 动态更新相关属性
  }

}
