#define SDF_PX 8.0
#define EDGE_GAMMA 0.105
#define FONT_SIZE 48.0
uniform sampler2D u_sdf_map;
uniform float u_gamma_scale : 0.5;
// uniform float u_font_size : 24.0;
uniform float u_opacity : 1.0;
uniform float u_stroke_opacity: 1.0;
uniform vec4 u_stroke : [0, 0, 0, 1];
uniform float u_strokeWidth : 2.0;
uniform float u_halo_blur : 0.5;
uniform float u_DevicePixelRatio;

varying vec4 v_color;
varying vec2 v_uv;
varying float v_gamma_scale;
varying float v_fontScale;

#pragma include "picking"
void main() {
  // get sdf from atlas
  float dist = texture2D(u_sdf_map, v_uv).a;

  // float fontScale = u_font_size / FONT_SIZE;

  lowp float buff = (6.0 - u_strokeWidth / v_fontScale) / SDF_PX;
  highp float gamma = (u_halo_blur * 1.19 / SDF_PX + EDGE_GAMMA) / (v_fontScale * u_gamma_scale) / 1.0;

  highp float gamma_scaled = gamma * v_gamma_scale;

  highp float alpha = smoothstep(buff - gamma_scaled, buff + gamma_scaled, dist);

  gl_FragColor = mix(v_color * u_opacity, u_stroke * u_stroke_opacity, smoothstep(0., 0.5, 1. - dist)) * alpha;
  gl_FragColor = filterColor(gl_FragColor);
}
