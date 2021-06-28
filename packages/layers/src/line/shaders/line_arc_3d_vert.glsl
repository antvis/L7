#define LineTypeSolid 0.0
#define LineTypeDash 1.0
#define Animate 0.0
#define LineTexture 1.0
attribute vec3 a_Position;
attribute vec4 a_Instance;
attribute vec4 a_Color;
attribute float a_Size;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
uniform float segmentNumber;
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ];
varying vec4 v_color;
varying vec2 v_normal;
varying float v_distance_ratio;
uniform float u_line_type: 0.0;
uniform vec4 u_dash_array: [10.0, 5., 0, 0];
varying vec4 v_dash_array;

uniform float u_icon_step: 100;
uniform float u_line_texture: 0.0;
varying float v_segmentIndex;
varying float v_arcDistrance;
varying float v_pixelLen;
varying float v_a;
varying vec2 v_offset;
attribute vec2 a_iconMapUV;
varying vec2 v_iconMapUV;

uniform float u_opacity: 1.0;
varying mat4 styleMappingMat; // 用于将在顶点着色器中计算好的样式值传递给片元

#pragma include "styleMapping"
#pragma include "styleMappingCalOpacity"

#pragma include "projection"
#pragma include "project"
#pragma include "picking"

float maps (float value, float start1, float stop1, float start2, float stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

float getSegmentRatio(float index) {
  return smoothstep(0.0, 1.0, index / (segmentNumber - 1.0));
}

float paraboloid(vec2 source, vec2 target, float ratio) {
  vec2 x = mix(source, target, ratio);
  vec2 center = mix(source, target, 0.5);
  float dSourceCenter = distance(source, center);
  float dXCenter = distance(x, center);
  return (dSourceCenter + dXCenter) * (dSourceCenter - dXCenter);
}

vec3 getPos(vec2 source, vec2 target, float segmentRatio) {
  float vertex_height = paraboloid(source, target, segmentRatio);

  return vec3(
    mix(source, target, segmentRatio),
    sqrt(max(0.0, vertex_height))
  );
}
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace);
  // rotate by 90 degrees
  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);

  vec2 offset = dir_screenspace * offset_direction * setPickingSize(a_Size) / 2.0;

  return offset;
}
vec2 getNormal(vec2 line_clipspace, float offset_direction) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace);
  // rotate by 90 degrees
  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
  return reverse_offset_normal(vec3(dir_screenspace,1.0)).xy * sign(offset_direction);
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

  v_color = a_Color;
  vec2 source = project_position(vec4(a_Instance.rg, 0, 0)).xy;
  vec2 target = project_position(vec4(a_Instance.ba, 0, 0)).xy;
  float segmentIndex = a_Position.x;
  float segmentRatio = getSegmentRatio(segmentIndex);
  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));

   if(u_line_type == LineTypeDash) {
    v_distance_ratio = segmentIndex / segmentNumber;
    // float total_Distance = pixelDistance(a_Instance.rg, a_Instance.ba) / 2.0 * PI;
    vec2 s = source;
    vec2 t = target;
    
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
      s = unProjCustomCoord(source);
      t = unProjCustomCoord(target);
    }
    float total_Distance = pixelDistance(s, t) / 2.0 * PI;
    v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / (total_Distance / segmentNumber * segmentIndex);
  }
    if(u_aimate.x == Animate) {
      v_distance_ratio = segmentIndex / segmentNumber;
  }

  float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);
  vec3 curr = getPos(source, target, segmentRatio);
  vec3 next = getPos(source, target, nextSegmentRatio);
  vec2 offset = getExtrusionOffset((next.xy - curr.xy) * indexDir, a_Position.y);
  v_normal = getNormal((next.xy - curr.xy) * indexDir, a_Position.y);


  v_segmentIndex = a_Position.x;
  if(LineTexture == u_line_texture && u_line_type != LineTypeDash) { // 开启贴图模式  
    v_arcDistrance = length(source - target);
    v_pixelLen = project_pixel(u_icon_step);

    vec2 projectOffset = project_pixel(offset);
    v_offset = projectOffset + projectOffset * sign(a_Position.y);
    v_a = project_pixel(a_Size);
    v_iconMapUV = a_iconMapUV;
  }
  

  // gl_Position = project_common_position_to_clipspace(vec4(curr.xy + project_pixel(offset), curr.z, 1.0));
  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * (vec4(curr.xy + project_pixel(offset), curr.z, 1.0));
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(curr.xy + project_pixel(offset), curr.z, 1.0));
  }
  setPickingColor(a_PickingColor);
}
