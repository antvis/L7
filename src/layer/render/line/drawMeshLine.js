import * as THREE from '../../../core/three';
import { MeshLineMaterial } from '../../../geom/material/lineMaterial';
export default function DrawLine(attributes, cfg, layer) {
  const { style, animateOptions, activeOption, zoom } = cfg;
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
    u_opacity: style.opacity,
    u_zoom: zoom,
    u_time: 0,
    activeColor: activeOption.fill
  }, {
    SHAPE: false,
    ANIMATE: false
  });

  const lineMesh = new THREE.Mesh(geometry, lineMaterial);
  if (animateOptions.enable) {
    layer.scene.startAnimate();
    const {
      duration = 2,
      interval = 0.5,
      trailLength = 0.5,
      repeat = Infinity
    } = animateOptions;
    layer.animateDuration =
    layer.scene._engine.clock.getElapsedTime() + duration * repeat;
    lineMaterial.updateUninform({
      u_duration: duration,
      u_interval: interval,
      u_trailLength: trailLength
    });
    lineMaterial.setDefinesvalue('ANIMATE', true);
  }
  return lineMesh;
}
