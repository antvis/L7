#define LineTypeSolid 0.0
#define LineTypeDash 1.0
#define Animate 0.0

attribute float a_Miter;
attribute vec4 a_Color;
attribute vec2 a_Size;
attribute vec3 a_Normal;
attribute vec3 a_Position;

attribute vec2 a_iconMapUV;

// dash line
attribute float a_Total_Distance;
attribute float a_Distance;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
uniform float u_line_type: 0.0;
uniform vec4 u_dash_array: [10.0, 5., 0, 0];
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ];
uniform float u_icon_step: 100;

#pragma include "projection"
#pragma include "picking"

varying vec4 v_color;
varying vec4 v_dash_array;
varying vec2 v_normal;
varying float v_distance_ratio;
varying float v_side;

varying float v_distance;
varying vec2 v_offset;
varying float v_size;
varying float v_a;
varying float v_pixelLen;
varying vec2 v_iconMapUV;
uniform float u_linearColor: 0;

uniform float u_opacity: 1.0;
varying mat4 styleMappingMat; // 用于将在顶点着色器中计算好的样式值传递给片元

#pragma include "styleMapping"
#pragma include "styleMappingCalOpacity"

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

  v_iconMapUV = a_iconMapUV;
  v_distance = a_Distance;
  v_pixelLen = project_pixel(u_icon_step);
  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) {
    v_pixelLen *= 10.0;
  }

  if(u_line_type == LineTypeDash) {
    v_distance_ratio = a_Distance / a_Total_Distance;
    // v_distance_ratio = 0.01;
    v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / a_Total_Distance;
  }
  if(u_aimate.x == Animate || u_linearColor == 1.0) {
      v_distance_ratio = a_Distance / a_Total_Distance;
  }
  v_normal = vec2(reverse_offset_normal(a_Normal) * sign(a_Miter));


  v_color = a_Color;
  v_a = project_pixel(a_Size.x);
  

  vec3 size = a_Miter * setPickingSize(a_Size.x) * reverse_offset_normal(a_Normal);

  vec2 offset = project_pixel(size.xy);

  v_offset = offset + offset * sign(a_Miter);

  v_side = a_Miter * a_Size.x;
  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0));

  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, a_Size.y, 1.0));

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    // gl_Position = u_Mvp * (vec4(project_pos.xy + offset, a_Size.y, 1.0));
    gl_Position = u_Mvp * (vec4(project_pos.xy + offset, a_Size.y / 8.0, 1.0)); // 额外除 8.0 是为了和gaode1.x的高度兼容
  } else {
    float lineHeight = a_Size.y;
    // 兼容 mapbox 在线高度上的效果表现基本一致
    if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      lineHeight = lineHeight*2.0/pow(2.0, 20.0 - u_Zoom);
    }
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, lineHeight, 1.0));
  }

  setPickingColor(a_PickingColor);
}
