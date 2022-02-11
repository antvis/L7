
uniform float u_additive;

varying mat4 styleMappingMat; // 传递从片元中传递的映射数据

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;
uniform float u_time;
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ];

#pragma include "sdf_2d"
#pragma include "picking"


void main() {

  vec4 textrueStroke = vec4(
    styleMappingMat[1][0],
    styleMappingMat[1][1],
    styleMappingMat[1][2],
    styleMappingMat[1][3]
  );

  float opacity = styleMappingMat[0][0];
  float stroke_opacity = styleMappingMat[0][1];
  float strokeWidth = styleMappingMat[0][2];
  vec4 strokeColor = textrueStroke == vec4(0) ? v_color : textrueStroke;

  float r = v_radius / (v_radius + strokeWidth);

  // 'circle'
  float outer_df = sdCircle(v_data.xy, 1.0);
  float inner_df = sdCircle(v_data.xy, r);
 
  float d = length(v_data.xy);
  if(d > 0.5) {
    discard;
  }
  float PI = 3.14159;
  float intensity = clamp(cos(d * PI), 0.0, 1.0) * clamp(cos(2.0 * PI * (d * 2.0 * u_aimate.z - u_aimate.y * u_time)), 0.0, 1.0);

  // TODO: 根据叠加水波效果
  gl_FragColor = vec4(v_color.xyz, v_color.a * opacity * intensity);

  // TODO: 优化在水波纹情况下的拾取
  if(d < 0.45) {
    gl_FragColor = filterColor(gl_FragColor);
  }
}
