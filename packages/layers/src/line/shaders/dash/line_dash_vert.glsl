#define LineTypeSolid 0.0
#define LineTypeDash 1.0
#define Animate 0.0

layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec4 a_Color;
layout(location = 7) in vec2 a_Size;
layout(location = 8) in float a_Miter;
layout(location = 9) in vec3 a_Normal;
layout(location = 10) in vec2 a_iconMapUV;
layout(location = 11) in float a_Total_Distance;
layout(location = 12) in vec2 a_DistanceAndIndex;

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

#pragma include "projection"
#pragma include "picking"

out vec4 v_color;
out vec4 v_dash_array;
out float v_d_distance_ratio;

void main() {

  v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / a_Total_Distance;
  v_color = vec4(a_Color.xyz, a_Color.w * opacity);

  vec3 size = a_Miter * setPickingSize(a_Size.x) * reverse_offset_normal(a_Normal);
  vec2 offset = project_pixel(size.xy);
  v_d_distance_ratio = a_DistanceAndIndex.x / a_Total_Distance;


  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));

  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, a_Size.y, 1.0));

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * (vec4(project_pos.xy + offset, project_pixel(a_Size.y), 1.0));
  } else {
    float lineHeight = a_Size.y;
 
    // #define COORDINATE_SYSTEM_P20 5.0
    // #define COORDINATE_SYSTEM_P20_OFFSET 6.0
    // amap1.x
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20 || u_CoordinateSystem == COORDINATE_SYSTEM_P20_OFFSET) {
      // 保持高度相对不变
      lineHeight *= pow(2.0, 20.0 - u_Zoom);
    }

    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, lineHeight, 1.0));
  }

  setPickingColor(a_PickingColor);
}
