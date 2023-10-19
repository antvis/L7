in vec4 v_color;
in vec4 v_texture_data;

layout(std140) uniform ModelUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec4 u_dash_array;
  vec4 u_borderColor;
  vec3 u_blur;
  float u_icon_step;
  vec2 u_textSize;
  float u_heightfixed;
  float u_vertexScale;
  float u_raisingHeight;
  float u_linearColor;
  float u_arrow;
  float u_arrowHeight;
  float u_arrowWidth;
  float u_tailWidth;
  float u_textureBlend;
  float u_borderWidth;
  float u_line_texture;
  float u_linearDir;
  float u_line_type;
};

#pragma include "picking"

out vec4 outputColor;

void main() {
  float linearRadio = v_texture_data.r; // 当前点位距离占线总长的比例
  if(u_linearDir < 1.0) {
    linearRadio = v_texture_data.a;
  }

  if(u_linearColor == 1.0) { // 使用渐变颜色
    outputColor = mix(u_sourceColor, u_targetColor, linearRadio);
    outputColor.a *= v_color.a;
  } else { // 使用 color 方法传入的颜色
     outputColor = v_color;
  }

  outputColor = filterColor(outputColor);
}
