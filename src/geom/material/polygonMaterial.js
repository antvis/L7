import * as THREE from '../../core/three';
import polygon_frag from '../shader/polygon_frag.glsl';
import polygon_vert from '../shader/polygon_vert.glsl';
export default function PolygonMaterial(options) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_opacity: { value: options.u_opacity },
      u_texture: { value: options.u_texture }
    },
    vertexShader: polygon_vert,
    fragmentShader: polygon_frag,
    transparent: true,
    defines: {
      TEXCOORD_0: !!options.u_texture
    }
  });
  material.roughness = 1;
  material.metalness = 0.1;
  material.envMapIntensity = 3;
  return material;
}
