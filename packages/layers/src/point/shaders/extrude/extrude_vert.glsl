precision highp float;

#define pi 3.1415926535
#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

attribute vec3 a_Position;
attribute vec3 a_Pos;
attribute vec4 a_Color;
attribute vec3 a_Size;
attribute vec3 a_Normal;

uniform float u_heightfixed: 0.0; // 默认不固定
uniform float u_globel;
uniform float u_r;
uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
varying vec4 v_color;

uniform float u_opacity : 1;
uniform float u_lightEnable: 1;

varying mat4 styleMappingMat; // 用于将在顶点着色器中计算好的样式值传递给片元

varying float v_z;
varying float v_lightWeight;

#pragma include "styleMapping"
#pragma include "styleMappingCalOpacity"

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

float getYRadian(float x, float z) {
  if(x > 0.0 && z > 0.0) {
    return atan(x/z);
  } else if(x > 0.0 && z <= 0.0){
    return atan(-z/x) + pi/2.0;
  } else if(x <= 0.0 && z <= 0.0) {
    return  pi + atan(x/z); //atan(x/z) + 
  } else {
    return atan(z/-x) + pi*3.0/2.0;
  }
}

float getXRadian(float y, float r) {
  return atan(y/r);
}

void main() {

  // cal style mapping - 数据纹理映射部分的计算
  styleMappingMat = mat4(
    0.0, 0.0, 0.0, 0.0, // opacity - strokeOpacity - strokeWidth - empty
    0.0, 0.0, 0.0, 0.0, // strokeR - strokeG - strokeB - strokeA
    0.0, 0.0, 0.0, 0.0, // offsets[0] - offsets[1]
    0.0, 0.0, 0.0, 0.0
  );

  float rowCount = u_cellTypeLayout[0][0];    // 当前的数据纹理有几行
  float columnCount = u_cellTypeLayout[0][1]; // 当看到数据纹理有几列
  float columnWidth = 1.0/columnCount;  // 列宽
  float rowHeight = 1.0/rowCount;       // 行高
  float cellCount = calCellCount(); // opacity - strokeOpacity - strokeWidth - stroke - offsets
  float id = a_vertexId; // 第n个顶点
  float cellCurrentRow = floor(id * cellCount / columnCount) + 1.0; // 起始点在第几行
  float cellCurrentColumn = mod(id * cellCount, columnCount) + 1.0; // 起始点在第几列
  
  // cell 固定顺序 opacity -> strokeOpacity -> strokeWidth -> stroke ... 
  // 按顺序从 cell 中取值、若没有则自动往下取值
  float textureOffset = 0.0; // 在 cell 中取值的偏移量

  vec2 opacityAndOffset = calOpacityAndOffset(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset, columnWidth, rowHeight);
  styleMappingMat[0][0] = opacityAndOffset.r;
  textureOffset = opacityAndOffset.g;
  // cal style mapping - 数据纹理映射部分的计算
  vec3 size = a_Size * a_Position;

  // a_Position.z 是在构建网格的时候传入的标准值 0 - 1，在插值器插值可以获取 0～1 线性渐变的值
  v_z = a_Position.z;

 

  // vec2 offset = project_pixel(size.xy);
  // vec2 offset = (size.xy);

  vec3 offset = size; // 控制圆柱体的大小 - 从标准单位圆柱体进行偏移
  if(u_heightfixed < 1.0) { // 圆柱体不固定高度
    // offset = project_pixel(offset);
    if (u_CoordinateSystem == COORDINATE_SYSTEM_P20 || u_CoordinateSystem == COORDINATE_SYSTEM_P20_OFFSET) {
      // P20 坐标系下，为了和 Web 墨卡托坐标系统一，zoom 默认减1
      offset = offset * pow(2.0, (19.0 - u_Zoom));
    }
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) {
      // P20_2 坐标系下，为了和 Web 墨卡托坐标系统一，zoom 默认减3
      offset = offset * pow(2.0, (19.0 - 3.0 - u_Zoom));
    }
  } else {// 圆柱体固定高度 （ 处理 mapbox ）
    if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      offset *= 4.0/pow(2.0, 21.0 - u_Zoom);
    }
  }


  vec4 project_pos = project_position(vec4(a_Pos.xy, 0., 1.0));

  // vec4 pos = vec4(project_pos.xy + offset, project_pixel(size.z) * u_r, 1.0);
  // u_r 控制圆柱的生长
  vec4 pos = vec4(project_pos.xy + offset.xy, offset.z * u_r, 1.0);

  // 圆柱光照效果
  // float lightWeight = u_lightEnable > 0.0 ? calc_lighting(pos): 1.0;
  float lightWeight = 1.0;
  if(u_lightEnable > 0.0) { // 取消三元表达式，增强健壮性
    lightWeight = calc_lighting(pos);
  }
  v_lightWeight = lightWeight;

  v_color =vec4(a_Color.rgb * lightWeight, a_Color.w);

  // gl_Position = project_common_position_to_clipspace(pos);

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * pos;
  } else {
    gl_Position = project_common_position_to_clipspace(pos);
  }
  
  if(u_globel > 0.0) {
    // 在地球模式下，将原本垂直于 xy 平面的圆柱调整姿态到适应圆的角度
    //旋转矩阵mx，创建绕x轴旋转矩阵
    float r = sqrt(a_Pos.z*a_Pos.z + a_Pos.x*a_Pos.x);
    float xRadian = getXRadian(a_Pos.y, r);
    float xcos = cos(xRadian);//求解旋转角度余弦值
    float xsin = sin(xRadian);//求解旋转角度正弦值
    mat4 mx = mat4(
      1,0,0,0,  
      0,xcos,-xsin,0,  
      0,xsin,xcos,0,  
      0,0,0,1);

    //旋转矩阵my，创建绕y轴旋转矩阵
    float yRadian = getYRadian(a_Pos.x, a_Pos.z);
    float ycos = cos(yRadian);//求解旋转角度余弦值
    float ysin = sin(yRadian);//求解旋转角度正弦值
    mat4 my = mat4(
      ycos,0,-ysin,0,  
      0,1,0,0,  
      ysin,0,ycos,0,  
      0,0,0,1);

    gl_Position = u_ViewProjectionMatrix * vec4(( my * mx *  vec4(a_Position * a_Size, 1.0)).xyz + a_Pos, 1.0);
  }

  setPickingColor(a_PickingColor);
}
