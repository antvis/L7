
uniform float u_additive;
uniform float u_opacity: 1.0;

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;
varying vec2 v_exteude;
#pragma include "sdf_2d"
#pragma include "picking"

void main() {

  lowp float antialiasblur = v_data.z;
  float r = v_radius / (v_radius);

  float outer_df = sdCircle(v_data.xy, 1.0);
  float inner_df = sdCircle(v_data.xy, r);

  float opacity_t = smoothstep(0.0, antialiasblur, outer_df);

  gl_FragColor = vec4(v_color.rgb, v_color.a * u_opacity);

  if(u_additive > 0.0) {
    gl_FragColor *= opacity_t;
  } else {
    gl_FragColor.a *= opacity_t;
  }

  if(gl_FragColor.a > 0.0) {
    gl_FragColor = filterColor(gl_FragColor);
  }

  vec2 extrude =  v_exteude;
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

  gl_FragColor.a *= radar_v;
}
