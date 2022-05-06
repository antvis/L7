
uniform float u_additive;

varying mat4 styleMappingMat; // 传递从片元中传递的映射数据

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;

#pragma include "sdf_2d"
#pragma include "picking"

void main() {
  int shape = int(floor(v_data.w + 0.5));

  vec4 textrueStroke = vec4(
    styleMappingMat[1][0],
    styleMappingMat[1][1],
    styleMappingMat[1][2],
    styleMappingMat[1][3]
  );

  float opacity = styleMappingMat[0][0];

  lowp float antialiasblur = v_data.z;
  float r = v_radius / (v_radius);

  float outer_df = sdCircle(v_data.xy, 1.0);
  float inner_df = sdCircle(v_data.xy, r);

  float opacity_t = smoothstep(0.0, antialiasblur, outer_df);

  gl_FragColor = vec4(v_color.rgb, v_color.a * opacity);

  if(u_additive > 0.0) {
    gl_FragColor *= opacity_t;
  } else {
    gl_FragColor.a *= opacity_t;
  }

  if(gl_FragColor.a > 0.0) {
    gl_FragColor = filterColor(gl_FragColor);
  }

  vec2 extrude =  styleMappingMat[2].ba;
  vec2 dir = normalize(extrude);
  vec2 baseDir = vec2(1.0, 0.0);
  float pi = 3.14159265359;
  // full circle
  // float rades = dot(dir, baseDir);
  // float flag = sign(dir.y);
  // float radar_v = (flag - 1.0) * -0.5 + flag * acos(rades)/pi/2.0;
  
  // half circle
  float flag = sign(dir.y);
  float rades = dot(dir, baseDir);
  float radar_v = (flag - 1.0) * -0.5 * acos(rades)/pi;
  // simple AA
  if(radar_v > 0.99) {
    radar_v = 1.0 - (radar_v - 0.99)/0.01;
  }

  gl_FragColor.a *= radar_v;
}
