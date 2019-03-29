import * as THREE from '../../../core/three';
import { MeshLineMaterial } from '../../../geom/material/lineMaterial';
export default function DrawLine(attributes, style) {
  const { opacity, zoom, animate, duration, interval, trailLength } = style;
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(attributes.indexArray);
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normal, 3));
  geometry.addAttribute('a_miter', new THREE.Float32BufferAttribute(attributes.miter, 1));
  geometry.addAttribute('a_distance', new THREE.Float32BufferAttribute(attributes.attrDistance, 1));
  const lineMaterial = new MeshLineMaterial({
    u_opacity: opacity,
    u_zoom: zoom,
    u_duration: duration,
    u_interval: interval,
    u_trailLength: trailLength,
    u_time: 0
  }, {
    SHAPE: false,
    ANIMATE: animate
  });
  const arcMesh = new THREE.Mesh(geometry, lineMaterial);
  if (animate) {
    this.scene.startAnimate();
    const {
      duration,
      interval,
      trailLength,
      repeat = Infinity
    } = style;
    this.animateDuration =
    this.scene._engine.clock.getElapsedTime() + duration * repeat;
    lineMaterial.upDateUninform({
      u_duration: duration,
      u_interval: interval,
      u_trailLength: trailLength
    });
  }
  return arcMesh;
}
