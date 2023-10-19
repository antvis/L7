layout(std140) uniform ModelUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec4 u_dash_array;
  vec2 u_textSize;
  float u_thetaOffset;
  float u_opacity;
  float u_textureBlend;
  float segmentNumber;
  float u_line_type;
  float u_blur;
  float u_lineDir;
  float u_line_texture;
  float u_icon_step;
  float u_linearColor;
};

in vec4 v_dash_array;
in vec4 v_color;
in float v_distance_ratio;

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