#define LineTypeSolid 0.0
#define LineTypeDash 1.0
#define Animate 0.0
#define LineTexture 1.0
attribute vec3 a_Position;
attribute vec4 a_Instance;
attribute vec4 a_Color;
attribute float a_Size;

uniform float u_globel;
uniform float u_globel_radius;
uniform float u_global_height: 10;
uniform mat4 u_ModelMatrix;

uniform float segmentNumber;
uniform vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
varying vec4 v_color;

uniform float u_line_type: 0.0;
uniform vec4 u_dash_array: [10.0, 5., 0, 0];
varying vec4 v_dash_array;

uniform float u_icon_step: 100;
uniform float u_line_texture: 0.0;
varying float v_segmentIndex;

attribute vec2 a_iconMapUV;
varying vec2 v_iconMapUV;
varying vec4 v_line_data;

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

float torad(float deg) {
  return (deg / 180.0) * acos(-1.0);
}

vec3 lglt2xyz(vec2 lnglat) {
  float pi = 3.1415926;
  // + Math.PI/2 是为了对齐坐标
  float lng = torad(lnglat.x) + pi / 2.0;
  float lat = torad(lnglat.y);

  // 手动增加一些偏移，减轻面的冲突
  float radius = u_globel_radius;

  float z = radius * cos(lat) * cos(lng);
  float x = radius * cos(lat) * sin(lng);
  float y = radius * sin(lat);
  return vec3(x, y, z);
}

void main() {

  v_color = a_Color;
  v_color.a = v_color.a * opacity;
  vec2 source = project_position(vec4(a_Instance.rg, 0, 0)).xy;
  vec2 target = project_position(vec4(a_Instance.ba, 0, 0)).xy;
  float segmentIndex = a_Position.x;
  float segmentRatio = getSegmentRatio(segmentIndex);
  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));

  float d_distance_ratio;
   if(u_line_type == LineTypeDash) {
    d_distance_ratio = segmentIndex / segmentNumber;
    vec2 s = source;
    vec2 t = target;
    
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
      s = unProjCustomCoord(source);
      t = unProjCustomCoord(target);
    }
    float total_Distance = pixelDistance(s, t) / 2.0 * PI;
    v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / (total_Distance / segmentNumber * segmentIndex);
  }
    if(u_animate.x == Animate) {
      d_distance_ratio = segmentIndex / segmentNumber;
  }
  v_line_data.g = d_distance_ratio; // 当前点位距离占线总长的比例

  float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);
  vec3 curr = getPos(source, target, segmentRatio);
  vec3 next = getPos(source, target, nextSegmentRatio);
  vec2 offset = getExtrusionOffset((next.xy - curr.xy) * indexDir, a_Position.y);
  // v_normal = getNormal((next.xy - curr.xy) * indexDir, a_Position.y);


  v_segmentIndex = a_Position.x;
  if(LineTexture == u_line_texture && u_line_type != LineTypeDash) { // 开启贴图模式  

    float arcDistrance = length(source - target);
    float pixelLen =  project_pixel_texture(u_icon_step);
    v_line_data.b = floor(arcDistrance/pixelLen); // 贴图在弧线上重复的数量

    vec2 projectOffset = project_pixel(offset);
    float lineOffsetWidth = length(projectOffset + projectOffset * sign(a_Position.y)); // 线横向偏移的距离
    float linePixelSize = project_pixel(a_Size);  // 定点位置偏移，按地图等级缩放后的距离
    v_line_data.a = lineOffsetWidth/linePixelSize;  // 线图层贴图部分的 v 坐标值

    v_iconMapUV = a_iconMapUV;
  }


  gl_Position = project_common_position_to_clipspace_v2(vec4(curr.xy + project_pixel(offset), curr.z * thetaOffset, 1.0));

  // 地球模式
  if(u_globel > 0.0) {
    vec3 startLngLat = lglt2xyz(a_Instance.rg);
    vec3 endLngLat = lglt2xyz(a_Instance.ba);
    float globalRadius = length(startLngLat);

    vec3 lineDir = normalize(endLngLat - startLngLat);
    vec3 midPointDir = normalize((startLngLat + endLngLat)/2.0);

    // 线的偏移
    vec3 lnglatOffset = cross(lineDir, midPointDir) * a_Position.y;
    // 计算起始点和终止点的距离
    float lnglatLength = length(a_Instance.rg - a_Instance.ba)/50.0;
    // 计算飞线各个节点相应的高度
    float lineHeight = u_global_height * (-4.0*segmentRatio*segmentRatio + 4.0 * segmentRatio) * lnglatLength;
    // 地球点位
    vec3 globalPoint = normalize(mix(startLngLat, endLngLat, segmentRatio)) * (globalRadius + lineHeight) + lnglatOffset * a_Size;
    
    gl_Position = u_ViewProjectionMatrix * vec4(globalPoint, 1.0);
  }
 

  setPickingColor(a_PickingColor);
}
