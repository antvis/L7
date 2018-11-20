import polygon_frag from '../shader/polygon_frag.glsl';
import polygon_vert from '../shader/polygon_vert.glsl';
import Material from './material';
export default function PolygonMaterial(options) {
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity || 1.0 },
      u_texture: { value: options.u_texture },
      u_time: { value: options.u_time || 0 },
      u_zoom: { value: options.u_zoom || 0 },
      u_baseColor: { value: options.u_baseColor || [ 1.0, 0, 0, 1.0 ] },
      u_brightColor: { value: options.u_brightColor || [ 1.0, 0, 0, 1.0 ] },
      u_windowColor: { value: options.u_windowColor || [ 1.0, 0, 0, 1.0 ] },
      u_near: { value: options.u_near || 0.0 },
      u_far: { value: options.u_far || 1.0 }
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
