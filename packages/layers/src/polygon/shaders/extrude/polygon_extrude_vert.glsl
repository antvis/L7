precision highp float;

#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute float a_Size;
attribute vec3 a_uvs;
uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;

varying vec4 v_Color;
uniform float u_heightfixed: 0.0; // 默认不固定
uniform float u_raisingHeight: 0.0;
uniform float u_opacity: 1.0;
varying mat4 styleMappingMat; // 用于将在顶点着色器中计算好的样式值传递给片元

#pragma include "styleMapping"
#pragma include "styleMappingCalOpacity"

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
  // cal style mapping - 数据纹理映射部分的计算
  
  // cell 固定顺序 opacity -> strokeOpacity -> strokeWidth -> stroke ... 
  // 按顺序从 cell 中取值、若没有则自动往下取值
  float textureOffset = 0.0; // 在 cell 中取值的偏移量

  vec2 opacityAndOffset = calOpacityAndOffset(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset, columnWidth, rowHeight);
  styleMappingMat[0][0] = opacityAndOffset.r;
  textureOffset = opacityAndOffset.g;
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

  // project_pos.z += 500000.0; // amap1

  // project_pos.z += (500000.0 * 4.0)/pow(2.0, 21.0 - u_Zoom); // mapbox
  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    // gl_Position = u_Mvp * (vec4(project_pos.xyz * vec3(1.0, 1.0, -1.0), 1.0));
    gl_Position = u_Mvp * (vec4(project_pos.xyz, 1.0));
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
  }

  float lightWeight = calc_lighting(pos);
  // v_Color = a_Color;
  v_Color = vec4(a_Color.rgb * lightWeight, a_Color.w);

  styleMappingMat[3][1] = lightWeight;

  setPickingColor(a_PickingColor);
}
