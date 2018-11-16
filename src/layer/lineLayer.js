
import Layer from '../core/layer';
import * as THREE from '../core/three';
import { LineBuffer } from '../geom/buffer/index';
import { LineMaterial, ArcLineMaterial, MeshLineMaterial, DashLineMaterial } from '../geom/material/lineMaterial';
export default class MeshlineLayer extends Layer {
  shape(type) {
    this.shapeType = type;
    return this;
  }
  render() {
    this.type = 'polyline';
    this.init();
    const source = this.layerSource;
    const StyleData = this.StyleData;
    const style = this.get('styleOptions');
    const buffer = new LineBuffer({
      coordinates: source.geoData,
      properties: StyleData,
      shapeType: this.shapeType,
      style
    });
    const { opacity } = this.get('styleOptions');

    const animateOptions = this.get('animateOptions');
    const geometry = new THREE.BufferGeometry();
    const { attributes } = buffer;
    if (this.shapeType === 'arc') {
      geometry.setIndex(attributes.indexArray);
      geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
      geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
      geometry.addAttribute('a_instance', new THREE.Float32BufferAttribute(attributes.instances, 4));
      geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
      const material = new ArcLineMaterial({
        u_opacity: opacity,
        u_zoom: this.scene.getZoom()
      });
      // const mesh = new THREE.Line(geometry, material);
      const mesh = new THREE.Mesh(geometry, material);
      this.add(mesh);
    } else if (this.shapeType === 'meshLine') {
      geometry.setIndex(attributes.indexArray);
      geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
      geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
      geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
      geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normal, 3));
      geometry.addAttribute('a_miter', new THREE.Float32BufferAttribute(attributes.miter, 1));


      // geometry.setIndex(new THREE.BufferAttribute(new THREE.Float32BufferAttribute(attributes.indexArray, 1)));
      const lineType = style.lineType;
      let material;

      if (lineType !== 'dash') {

        material = new MeshLineMaterial({
          u_opacity: opacity,
          u_zoom: this.scene.getZoom()
        });
      } else {
        geometry.addAttribute('a_distance', new THREE.Float32BufferAttribute(attributes.attrDistance, 1));
        material = new DashLineMaterial({
          u_opacity: opacity,
          u_zoom: this.scene.getZoom()
        });
      }
      const mesh = new THREE.Mesh(geometry, material);
      this.add(mesh);
    } else { // 直线

      geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
      geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
      const material = new LineMaterial({
        u_opacity: opacity,
        u_time: 0
      });
      if (animateOptions.enable) {
        material.setDefinesvalue('ANIMATE', true);
      }

      const mesh = new THREE.LineSegments(geometry, material);
      this.add(mesh);
    }
    return this;
  }
}
