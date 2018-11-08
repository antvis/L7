
import Layer from '../core/layer';
import * as THREE from '../core/three';
import { LineBuffer } from '../geom/buffer/index';
import { LineMaterial, ArcLineMaterial } from '../geom/material/lineMaterial';
export default class MeshlineLayer extends Layer {
  render() {
    this.type = 'polyline';
    this.init();
    const source = this.layerSource;
    const StyleData = this.StyleData;
    const buffer = new LineBuffer({
      coordinates: source.geoData,
      properties: StyleData,
      propertiesData: source.propertiesData
    });
    const { opacity} = this.get('styleOptions');
    const animateOptions= this.get('animateOptions');
    const geometry = new THREE.BufferGeometry();
    const { attributes } = buffer;
    const shape = buffer.shape;
    if (shape === 'arc') {
      geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
      geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
      geometry.addAttribute('a_instance', new THREE.Float32BufferAttribute(attributes.inposs, 4))
      console.log(opacity)
      const material = new ArcLineMaterial({
        u_opacity: opacity
      });
      const mesh = new THREE.Line(geometry, material);
      this.add(mesh);
    } else if (shape === 'meshLine') {
      geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
      geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
      const material = new LineMaterial({
        u_opacity: opacity
      });
      const mesh = new THREE.Mesh(geometry, material);
      this.add(mesh);
    } else { // 直线
      geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
      geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
      
      const material = new LineMaterial({
        u_opacity: opacity,
        u_time: 0
      });
      if(animateOptions.enable){
        material.setDefinesvalue('ANIMATE',true)
      }
      
      const mesh = new THREE.LineSegments(geometry, material);
      this.add(mesh);
    }
    return this;
  }
}
