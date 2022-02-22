#define Animate 0.0
#define LineTexture 1.0

attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec4 a_Instance;
attribute float a_Size;
uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
uniform float segmentNumber;
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ];
varying vec4 v_color;

uniform float u_lineDir: 1.0;

uniform float u_thetaOffset: 0.314;
uniform float u_icon_step: 100;
uniform float u_line_texture: 0.0;
attribute vec2 a_iconMapUV;
varying vec2 v_iconMapUV;

uniform float u_opacity: 1.0;
varying mat4 styleMappingMat; // 用于将在顶点着色器中计算好的样式值传递给片元

#pragma include "styleMapping"
#pragma include "styleMappingCalOpacity"
#pragma include "styleMappingCalThetaOffset"

#pragma include "projection"
#pragma include "project"
#pragma include "picking"

float bezier3(vec3 arr, float t) {
  float ut = 1. - t;
  return (arr.x * ut + arr.y * t) * ut + (arr.y * ut + arr.z * t) * t;
}
vec2 midPoint(vec2 source, vec2 target, float arcThetaOffset) {
  vec2 center = target - source;
  float r = length(center);
  float theta = atan(center.y, center.x);
  float thetaOffset = arcThetaOffset;
  float r2 = r / 2.0 / cos(thetaOffset);
  float theta2 = theta + thetaOffset;
  vec2 mid = vec2(r2*cos(theta2) + source.x, r2*sin(theta2) + source.y);
  if(u_lineDir == 1.0) { // 正向
    return mid;
  } else { // 逆向
    // (mid + vmin)/2 = (s + t)/2
    vec2 vmid = source + target - mid;
    return vmid;
  }
  // return mid;
}
float getSegmentRatio(float index) {
    return smoothstep(0.0, 1.0, index / (segmentNumber - 1.));
}
vec2 interpolate (vec2 source, vec2 target, float t, float arcThetaOffset) {
  // if the angularDist is PI, linear interpolation is applied. otherwise, use spherical interpolation
  vec2 mid = midPoint(source, target, arcThetaOffset);
  vec3 x = vec3(source.x, mid.x, target.x);
  vec3 y = vec3(source.y, mid.y, target.y);
  return vec2(bezier3(x ,t), bezier3(y,t));
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
  v_color = a_Color;

  // cal style mapping - 数据纹理映射部分的计算
  styleMappingMat = mat4(
    0.0, 0.0, 0.0, 0.0, // opacity - strokeOpacity - strokeWidth - empty
    0.0, 0.0, 0.0, 0.0, // strokeR - strokeG - strokeB - strokeA
    0.0, 0.0, 0.0, 0.0, // offsets[0] - offsets[1]
    0.0, 0.0, 0.0, 0.0  // dataset 数据集
  );

  float rowCount = u_cellTypeLayout[0][0];    // 当前的数据纹理有几行
  float columnCount = u_cellTypeLayout[0][1]; // 当看到数据纹理有几列
  float columnWidth = 1.0/columnCount;  // 列宽
  float rowHeight = 1.0/rowCount;       // 行高
  float cellCount = calCellCount(); // opacity - strokeOpacity - strokeWidth - stroke - offsets
  float id = a_vertexId; // 第n个顶点
  float cellCurrentRow = floor(id * cellCount / columnCount) + 1.0; // 起始点在第几行
  float cellCurrentColumn = mod(id * cellCount, columnCount) + 1.0; // 起始点在第几列
  
  // cell 固定顺序 opacity -> strokeOpacity -> strokeWidth -> stroke -> thetaOffset... 
  // 按顺序从 cell 中取值、若没有则自动往下取值
  float textureOffset = 0.0; // 在 cell 中取值的偏移量

  vec2 opacityAndOffset = calOpacityAndOffset(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset, columnWidth, rowHeight);
  styleMappingMat[0][0] = opacityAndOffset.r;
  textureOffset = opacityAndOffset.g;

  vec2 thetaOffsetAndOffset = calThetaOffsetAndOffset(cellCurrentRow, cellCurrentColumn, columnCount, textureOffset, columnWidth, rowHeight);
  styleMappingMat[0][1] = thetaOffsetAndOffset.r;
  textureOffset = thetaOffsetAndOffset.g;
  // cal style mapping - 数据纹理映射部分的计算

  
  vec2 source = a_Instance.rg;  // 起始点
  vec2 target =  a_Instance.ba; // 终点
  float segmentIndex = a_Position.x;
  float segmentRatio = getSegmentRatio(segmentIndex);

  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));
  float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);
  float d_distance_ratio;
  
  if(u_aimate.x == Animate) {
      d_distance_ratio = segmentIndex / segmentNumber;
      if(u_lineDir != 1.0) {
        d_distance_ratio = 1.0 - d_distance_ratio;
      }
  }

   styleMappingMat[3].b = d_distance_ratio;

  // styleMappingMat[0][1] - arcThetaOffset
  vec4 curr = project_position(vec4(interpolate(source, target, segmentRatio, styleMappingMat[0][1]), 0.0, 1.0));
  vec4 next = project_position(vec4(interpolate(source, target, nextSegmentRatio, styleMappingMat[0][1]), 0.0, 1.0));
  // v_normal = getNormal((next.xy - curr.xy) * indexDir, a_Position.y);
  //unProjCustomCoord
  
  vec2 offset = project_pixel(getExtrusionOffset((next.xy - curr.xy) * indexDir, a_Position.y));


  float d_segmentIndex = a_Position.x + 1.0; // 当前顶点在弧线中所处的分段位置
  styleMappingMat[3].r = d_segmentIndex;

  if(LineTexture == u_line_texture) { // 开启贴图模式

    float arcDistrance = length(source - target); // 起始点和终点的距离
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20) { // amap
      arcDistrance *= 1000000.0;
    }
    if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) { // mapbox
      // arcDistrance *= 8.0;
      arcDistrance = project_pixel_allmap(arcDistrance);
    }
    v_iconMapUV = a_iconMapUV;

    float pixelLen = project_pixel_texture(u_icon_step); // 贴图沿弧线方向的长度 - 随地图缩放改变
    float texCount = floor(arcDistrance/pixelLen); // 贴图在弧线上重复的数量
     styleMappingMat[3].g = texCount;

    float lineOffsetWidth = length(offset + offset * sign(a_Position.y)); // 线横向偏移的距离
    float linePixelSize = project_pixel(a_Size); // 定点位置偏移
     styleMappingMat[3].a = lineOffsetWidth/linePixelSize; // 线图层贴图部分的 v 坐标值
  }
  

  // gl_Position = project_common_position_to_clipspace(vec4(curr.xy + offset, 0, 1.0));
  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    // gl_Position = u_Mvp * (vec4(curr.xy + offset, 0, 1.0));
    gl_Position = u_Mvp * (vec4(curr.xy + offset, 0, 1.0));
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(curr.xy + offset, 0, 1.0));
  }
  setPickingColor(a_PickingColor);
}
