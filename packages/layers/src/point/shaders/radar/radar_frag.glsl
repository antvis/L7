
layout(std140) uniform commonUniorm{
  float u_additive;
  float u_size_unit;
  float u_speed: 1.0;
  float u_time;
};
in vec4 v_data;
in vec4 v_color;
in float v_radius;
in vec2 v_extrude;
#pragma include "sdf_2d"
#pragma include "picking"

out vec4 outputColor;

void main() {

  lowp float antialiasblur = v_data.z;
  float r = v_radius / (v_radius);

  float outer_df = sdCircle(v_data.xy, 1.0);
  float inner_df = sdCircle(v_data.xy, r);

  float opacity_t = smoothstep(0.0, antialiasblur, outer_df);

  outputColor = vec4(v_color.rgb, v_color.a);

  if(u_additive > 0.0) {
    outputColor *= opacity_t;
  } else {
    outputColor.a *= opacity_t;
  }

  if(outputColor.a > 0.0) {
    outputColor = filterColor(outputColor);
  }

  vec2 extrude =  v_extrude;
  vec2 dir = normalize(extrude);
  vec2 baseDir = vec2(1.0, 0.0);
  float pi = 3.14159265359;
  float flag = sign(dir.y);
  float rades = dot(dir, baseDir);
  float radar_v = (flag - 1.0) * -0.5 * acos(rades)/pi;
  // simple AA
  if(radar_v > 0.99) {
    radar_v = 1.0 - (radar_v - 0.99)/0.01;
  }

  outputColor.a *= radar_v;
}
