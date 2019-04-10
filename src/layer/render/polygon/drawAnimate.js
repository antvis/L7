import * as THREE from '../../../core/three';
import PolygonMaterial from '../../../geom/material/polygonMaterial';
export default function DrawAnimate(attributes, style) {
  const { opacity, baseColor, brightColor, windowColor, near, far } = style;
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
  geometry.addAttribute('faceUv', new THREE.Float32BufferAttribute(attributes.faceUv, 2));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  const material = new PolygonMaterial({
    u_opacity: opacity,
    u_baseColor: baseColor,
    u_brightColor: brightColor,
    u_windowColor: windowColor,
    u_near: near,
    u_far: far
  }, {
    SHAPE: false,
    ANIMATE: true
  });
  const fillPolygonMesh = new THREE.Mesh(geometry, material);
  return fillPolygonMesh;
}

DrawAnimate.prototype.updateStyle = function(style) {
  this.fillPolygonMesh.material.updateUninform({
    u_opacity: style.opacity,
    u_baseColor: style.baseColor,
    u_brightColor: style.brightColor,
    u_windowColor: style.windowColor
  });
};
