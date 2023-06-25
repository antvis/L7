#define SDF_PX 8.0
#define EDGE_GAMMA 0.105
#define FONT_SIZE 48.0
uniform sampler2D u_sdf_map;
uniform float u_gamma_scale : 0.5;
uniform float u_stroke_width : 2.0;
uniform float u_halo_blur : 0.5;
uniform float u_DevicePixelRatio;

varying vec4 v_color;
varying vec4 v_stroke_color;
varying vec2 v_uv;
varying float v_gamma_scale;
varying float v_fontScale;


#pragma include "picking"
void main() {
  // get style data mapping

  // get sdf from atlas
  float dist = texture2D(u_sdf_map, v_uv).a;

  lowp float buff = (6.0 - u_stroke_width / v_fontScale) / SDF_PX;
  highp float gamma = (u_halo_blur * 1.19 / SDF_PX + EDGE_GAMMA) / (v_fontScale * u_gamma_scale) / 1.0;

  highp float gamma_scaled = gamma * v_gamma_scale;

  highp float alpha = smoothstep(buff - gamma_scaled, buff + gamma_scaled, dist);

  gl_FragColor = mix(v_color, v_stroke_color, smoothstep(0., 0.5, 1.- dist));

  gl_FragColor.a *= alpha;
   // 作为 mask 模板时需要丢弃透明的像素
  if (gl_FragColor.a < 0.01) {
    discard;
  }
  gl_FragColor = filterColor(gl_FragColor);
}
