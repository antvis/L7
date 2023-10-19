#define LineTypeSolid 0.0

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

in vec4 v_color;

// dash
in vec4 v_dash_array;
in float v_d_distance_ratio;

out vec4 outputColor;

#pragma include "picking"

layout(std140) uniform AnimationUniforms {
  vec4 u_animate;
  float u_time;
};

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
