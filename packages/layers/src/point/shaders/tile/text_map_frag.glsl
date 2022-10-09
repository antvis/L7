#define SDF_PX 8.0
#define EDGE_GAMMA 0.105
#define FONT_SIZE 48.0
uniform sampler2D u_sdf_map;
uniform float u_gamma_scale : 0.5;

uniform float u_opacity : 1.0;
uniform vec4 u_stroke_color : [0, 0, 0, 1];
uniform float u_stroke_width : 2.0;
uniform float u_halo_blur : 0.5;
uniform float u_DevicePixelRatio;

varying vec2 v_uv;
varying float v_gamma_scale;
varying float v_fontScale;
uniform vec4 u_color;

void main() {
  // get sdf from atlas
  float dist = texture2D(u_sdf_map, v_uv).a;

  lowp float buff = (6.0 - u_stroke_width / v_fontScale) / SDF_PX;
  highp float gamma = (u_halo_blur * 1.19 / SDF_PX + EDGE_GAMMA) / (v_fontScale * u_gamma_scale) / 1.0;

  highp float gamma_scaled = gamma * v_gamma_scale;

  highp float alpha = smoothstep(buff - gamma_scaled, buff + gamma_scaled, dist);
  
  gl_FragColor = mix(vec4(u_color.rgb, u_color.a * u_opacity), vec4(u_stroke_color.rgb, u_stroke_color.a * u_opacity), smoothstep(0., 0.5, 1. - dist));
  gl_FragColor.a= gl_FragColor.a * alpha;
}
