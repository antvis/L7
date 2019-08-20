#define SDF_PX 8.0
#define EDGE_GAMMA 0.205 / float(DEVICE_PIXEL_RATIO)

uniform sampler2D u_sdf_map;
uniform float u_gamma_scale : 0.5;
uniform float u_font_size : 24;
uniform float u_font_opacity : 1.0;
uniform vec4 u_halo_color : [0, 0, 0, 1];
uniform float u_halo_width : 2.0;
uniform float u_halo_blur : 0.5;

varying vec4 v_color;
varying vec2 v_uv;
varying float v_gamma_scale;

void main() {
  // get sdf from atlas
  float dist = texture2D(u_sdf_map, v_uv).w;

  float fontScale = u_font_size / 24.0;

  lowp float buff = (6.0 - u_halo_width / fontScale) / SDF_PX;
  highp float gamma = (u_halo_blur * 1.19 / SDF_PX + EDGE_GAMMA) / (fontScale * u_gamma_scale);
  
  highp float gamma_scaled = gamma * v_gamma_scale;

  highp float alpha = smoothstep(buff - gamma_scaled, buff + gamma_scaled, dist);

  gl_FragColor = mix(v_color * u_font_opacity, u_halo_color, smoothstep(0., .5, 1. - dist)) * alpha;
  #pragma include "pick"
}
