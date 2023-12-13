in vec4 v_dash_array;
in vec4 v_color;
in float v_distance_ratio;

layout(std140) uniform commonUniorm {
  vec4 u_dash_array: [10.0, 5., 0, 0];
  float u_lineDir: 1.0;
  float segmentNumber;
};
out vec4 outputColor;

#pragma include "picking"

void main() {
  outputColor = v_color;

  float flag = 0.;
  float dashLength = mod(v_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
  if(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z)) {
    flag = 1.;
  };
  outputColor.a *=flag;
  
  outputColor = filterColor(outputColor);
}