#define SDF_PX 8.0
#define EDGE_GAMMA 0.105
#define FONT_SIZE 48.0

uniform sampler2D u_sdf_map;
layout(std140) uniform commonUniforms {
  vec4 u_stroke_color : [0.0, 0.0, 0.0, 0.0];
  vec2 u_sdf_map_size;
  float u_raisingHeight: 0.0;
  float u_stroke_width : 2;
  float u_gamma_scale : 0.5;
  float u_halo_blur : 0.5;
};

in vec2 v_uv;
in float v_gamma_scale;
in vec4 v_color;
in vec4 v_stroke_color;
in float v_fontScale;

out vec4 outputColor;

#pragma include "picking"
void main() {
  // get style data mapping

  // get sdf from atlas
  float dist = texture(SAMPLER_2D(u_sdf_map), v_uv).a;

  lowp float fill_buff = 6.0 / SDF_PX;
  lowp float stroke_buff = (6.0 - u_stroke_width / v_fontScale) / SDF_PX;
  highp float gamma = (u_halo_blur * 1.19 / SDF_PX + EDGE_GAMMA) / (v_fontScale * u_gamma_scale) / 1.0;

  highp float gamma_scaled = gamma * v_gamma_scale;

  highp float fill_alpha = smoothstep(
    fill_buff - gamma_scaled,
    fill_buff + gamma_scaled,
    dist
  ) * v_color.a;
  highp float outer_alpha = smoothstep(
    stroke_buff - gamma_scaled,
    stroke_buff + gamma_scaled,
    dist
  );
  highp float stroke_alpha = max(outer_alpha - fill_alpha / max(v_color.a, 0.0001), 0.0) * v_stroke_color.a;

  float out_alpha = clamp(fill_alpha + stroke_alpha, 0.0, 1.0);
  vec3 out_rgb = vec3(0.0);
  if (out_alpha > 0.0) {
    out_rgb = (v_color.rgb * fill_alpha + v_stroke_color.rgb * stroke_alpha) / out_alpha;
  }

  outputColor = vec4(out_rgb, out_alpha);
   // 作为 mask 模板时需要丢弃透明的像素
  if (outputColor.a < 0.01) {
    discard;
  }
  outputColor = filterColor(outputColor);
}
