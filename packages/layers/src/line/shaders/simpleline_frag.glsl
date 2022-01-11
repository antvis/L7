
uniform float u_blur : 0.99;
uniform float u_line_type: 0.0;
uniform float u_opacity : 1.0;

uniform float u_borderWidth: 0.0;
uniform vec4 u_borderColor;
varying vec4 v_color;


uniform float u_linearColor: 0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

uniform float u_time;
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ]; // 控制运动

varying mat4 styleMappingMat;
void main() {
  float opacity = styleMappingMat[0][0];
  float d_distance_ratio = styleMappingMat[3].r; // 当前点位距离占线总长的比例

  if(u_linearColor == 1.0) { // 使用渐变颜色
    gl_FragColor = mix(u_sourceColor, u_targetColor, d_distance_ratio);
  } else { // 使用 color 方法传入的颜色
     gl_FragColor = v_color;
  }
  // anti-alias
  // float blur = 1.0 - smoothstep(u_blur, 1., length(v_normal.xy));
  gl_FragColor.a *= opacity; // 全局透明度
}
