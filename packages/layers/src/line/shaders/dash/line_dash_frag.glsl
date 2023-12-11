#define LineTypeSolid 0.0
in vec4 v_color;

// dash
in vec4 v_dash_array;
in float v_d_distance_ratio;

#pragma include "picking"

layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ]; // 控制运动
  vec4 u_dash_array: [10.0, 5., 0, 0];
  float u_time;
  float u_heightfixed: 0.0;
  float u_vertexScale: 1.0;
  float u_raisingHeight: 0.0; 
};
out vec4 outputColor;
// [animate, duration, interval, trailLength],
void main() {

  outputColor = v_color;

  float dashLength = mod(v_d_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
  if(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z)) {
    // 实线部分
  } else {
    // 虚线部分
    discard;
  };

  outputColor = filterColor(outputColor);
}
