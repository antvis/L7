import * as THREE from '../../core/three';
import polygon_frag from '../shader/polygon_frag.glsl';
import polygon_vert from '../shader/polygon_vert.glsl';
import Material from './material';
export default function PolygonMaterial(options) {
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity },
      u_texture: { value: options.u_texture },
      u_time: { value: options.u_time || 0 }
    },
    vertexShader: polygon_vert,
    fragmentShader: polygon_frag,
    transparent: true,
    defines: {
      TEXCOORD_0: !!options.u_texture
    }
  });
  return material;
}
