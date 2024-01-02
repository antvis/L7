layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec4 a_Color;
layout(location = 9) in float a_Size;
layout(location = 13) in vec3 a_Normal;
layout(location = 14) in vec3 a_uvs;


layout(std140) uniform commonUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_linearColor;
  float u_topsurface;
  float u_sidesurface;
  float u_heightfixed; // 默认不固定
  float u_raisingHeight;
};

out vec4 v_Color;
out vec3 v_uvs;
out vec2 v_texture_data;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {


  v_uvs = a_uvs;
  // cal style mapping - 数据纹理映射部分的计算
  vec4 pos = vec4(a_Position.xy, a_Position.z * a_Size, 1.0);
  vec4 project_pos = project_position(pos);

  if(u_heightfixed > 0.0) { // 判断几何体是否固定高度
    project_pos.z = a_Position.z * a_Size;
    project_pos.z += u_raisingHeight;
    if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
      project_pos.z *= mapboxZoomScale;
      project_pos.z += u_raisingHeight * mapboxZoomScale;
    }
  }

  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xyz, 1.0));
  float lightWeight = calc_lighting(pos);
  v_texture_data = vec2(a_Position.z,lightWeight);

  v_Color = vec4(a_Color.rgb * lightWeight, a_Color.w * opacity);

  setPickingColor(a_PickingColor);
}
