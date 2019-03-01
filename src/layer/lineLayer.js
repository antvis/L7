import Layer from '../core/layer';
import * as THREE from '../core/three';
import { LineBuffer } from '../geom/buffer/index';
import { LineMaterial, ArcLineMaterial, MeshLineMaterial, DashLineMaterial } from '../geom/material/lineMaterial';
export default class LineLayer extends Layer {
  shape(type) {
    this.shapeType = type;
    return this;
  }
  render() {
    this.type = 'polyline';
    this.init();
    const layerData = this.layerData;
    const style = this.get('styleOptions');
    const buffer = this._buffer = new LineBuffer({
      layerData,
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
      const mesh = new THREE.Mesh(geometry, material);
      this.add(mesh);
    } else if (this.shapeType === 'line') {

      geometry.setIndex(attributes.indexArray);
      geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
      geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
      geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
      geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
      geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normal, 3));
      geometry.addAttribute('a_miter', new THREE.Float32BufferAttribute(attributes.miter, 1));
      geometry.addAttribute('a_distance', new THREE.Float32BufferAttribute(attributes.attrDistance, 1));
      const lineType = style.lineType;
      let material;

      if (lineType !== 'dash') {

        material = new MeshLineMaterial({
          u_opacity: opacity,
          u_zoom: this.scene.getZoom()
        });

        if (animateOptions.enable) {

          material.setDefinesvalue('ANIMATE', true);
          const { duration, interval, trailLength, repeat = Infinity } = animateOptions;
          this.animateDuration = this.scene._engine.clock.getElapsedTime() + duration * repeat;
          material.upDateUninform({
            u_duration: duration,
            u_interval: interval,
            u_trailLength: trailLength
          });


        }
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
  _preRender() {
    if (this.animateDuration > 0 && this.animateDuration < this.scene._engine.clock.getElapsedTime()) {
      this.layerMesh.material.setDefinesvalue('ANIMATE', false);
      this.emit('animateEnd');
      this.animateDuration = Infinity;
    }
  }
}
