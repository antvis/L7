export const vert = `
#define TILE_SIZE 512.0
#define PI 3.1415926536
#define WORLD_SCALE TILE_SIZE / (PI * 2.0)

#define COORDINATE_SYSTEM_P20 5.0           // amap
#define COORDINATE_SYSTEM_P20_OFFSET 6.0    // amap offset

attribute vec3 a_Position;
attribute vec3 a_Extrude;

uniform mat4 u_ViewProjectionMatrix;

uniform float u_Zoom;

uniform float u_ZoomScale;

uniform float u_CoordinateSystem;

uniform vec2 u_ViewportCenter;

uniform vec4 u_ViewportCenterProjection;

uniform vec3 u_PixelsPerDegree;

uniform vec3 u_PixelsPerDegree2;

vec2 project_mercator(vec2 lnglat) {
  float x = lnglat.x;
  return vec2(
    radians(x) + PI,
    PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5))
  );
}

// offset coords -> world coords 偏移坐标转成世界坐标
vec4 project_offset(vec4 offset) {
  float dy = offset.y;
  dy = clamp(dy, -1., 1.);
  vec3 pixels_per_unit = u_PixelsPerDegree + u_PixelsPerDegree2 * dy;
  return vec4(offset.xy * pixels_per_unit.xy, 0.0, 1.0);
}

// 投影方法 - 将经纬度转化为平面坐标（xy 平面）
vec4 project_position(vec4 position) {

  if (u_CoordinateSystem == COORDINATE_SYSTEM_P20_OFFSET) {
    float X = position.x - u_ViewportCenter.x;
    float Y = position.y - u_ViewportCenter.y;
    return project_offset(vec4(X, Y, 0.0, 1.0));
  }

  if (u_CoordinateSystem == COORDINATE_SYSTEM_P20) {
    return vec4(
      (project_mercator(position.xy) * WORLD_SCALE * u_ZoomScale - vec2(215440491., 106744817.)) * vec2(1., -1.),
      0.0,
      1.0
    );
  }
  return position;
}

vec2 project_pixel(vec2 pixel) {
  // P20 坐标系下，为了和 Web 墨卡托坐标系统一，zoom 默认减1
  return pixel * pow(2.0, (19.0 - u_Zoom));
}


void main() {
  vec2 offset = a_Extrude.xy * 10.0;
  
  offset = project_pixel(offset);

  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));

  vec4 worldPos = u_ViewProjectionMatrix *  vec4(project_pos.xy + offset, 0.0, 1.0) + u_ViewportCenterProjection;
  gl_Position = worldPos;
}
`;

export const frag = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
 precision highp float;
 #else
 precision mediump float;
#endif

void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;