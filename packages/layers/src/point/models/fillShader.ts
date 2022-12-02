export const vert = `
attribute vec3 a_Position;
attribute vec3 a_Extrude;

uniform mat4 u_ModelMatrix;


#define TILE_SIZE 512.0
#define PI 3.1415926536
#define WORLD_SCALE TILE_SIZE / (PI * 2.0)

#define COORDINATE_SYSTEM_LNGLAT 1.0        // mapbox
#define COORDINATE_SYSTEM_LNGLAT_OFFSET 2.0 // mapbox offset
#define COORDINATE_SYSTEM_VECTOR_TILE 3.0
#define COORDINATE_SYSTEM_IDENTITY 4.0
#define COORDINATE_SYSTEM_P20 5.0           // amap
#define COORDINATE_SYSTEM_P20_OFFSET 6.0    // amap offset
#define COORDINATE_SYSTEM_METER_OFFSET 7.0

#define COORDINATE_SYSTEM_P20_2 8.0         // amap2.0

uniform mat4 u_ViewProjectionMatrix;

uniform float u_Zoom;

uniform float u_ZoomScale;

uniform float u_CoordinateSystem;

uniform vec2 u_ViewportCenter;

uniform vec4 u_ViewportCenterProjection;

uniform vec3 u_PixelsPerDegree;

uniform vec3 u_PixelsPerDegree2;

uniform vec3 u_PixelsPerMeter;



vec2 project_mercator(vec2 lnglat) {
  float x = lnglat.x;
  return vec2(
    radians(x) + PI,
    PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5))
  );
}

float project_scale(float meters) {
  return meters * u_PixelsPerMeter.z;
}


// offset coords -> world coords
vec4 project_offset(vec4 offset) {
  float dy = offset.y;
  dy = clamp(dy, -1., 1.);
  vec3 pixels_per_unit = u_PixelsPerDegree + u_PixelsPerDegree2 * dy;
  return vec4(offset.xyz * pixels_per_unit, offset.w);
}

vec4 project_position(vec4 position) {
  float a = COORDINATE_SYSTEM_LNGLAT_OFFSET;
  float b = COORDINATE_SYSTEM_P20_OFFSET;
  float c = COORDINATE_SYSTEM_LNGLAT;
  if (u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
    || u_CoordinateSystem == COORDINATE_SYSTEM_P20_OFFSET) {
    float X = position.x - u_ViewportCenter.x;
    float Y = position.y - u_ViewportCenter.y;
    return project_offset(vec4(X, Y, position.z, position.w));
  }
  if (u_CoordinateSystem < COORDINATE_SYSTEM_LNGLAT + 0.01 && u_CoordinateSystem >COORDINATE_SYSTEM_LNGLAT - 0.01) {
    return vec4(
      project_mercator(position.xy) * WORLD_SCALE * u_ZoomScale,
      project_scale(position.z),
      position.w
    );
  }

  if (u_CoordinateSystem == COORDINATE_SYSTEM_P20) {
    return vec4(
      (project_mercator(position.xy) * WORLD_SCALE * u_ZoomScale - vec2(215440491., 106744817.)) * vec2(1., -1.),
      project_scale(position.z),
      position.w
    );
  }
  return position;
}

vec2 project_pixel(vec2 pixel) {
  if (u_CoordinateSystem == COORDINATE_SYSTEM_P20 || u_CoordinateSystem == COORDINATE_SYSTEM_P20_OFFSET) {
    // P20 坐标系下，为了和 Web 墨卡托坐标系统一，zoom 默认减1
    return pixel * pow(2.0, (19.0 - u_Zoom));
  }
  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) {
    // P20_2 坐标系下，为了和 Web 墨卡托坐标系统一，zoom 默认减3
    return pixel * pow(2.0, (19.0 - 3.0 - u_Zoom));
  }
  return pixel * -1.;
}


vec4 project_common_position_to_clipspace(vec4 position, mat4 viewProjectionMatrix, vec4 center) {
  if (u_CoordinateSystem == COORDINATE_SYSTEM_METER_OFFSET ||
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
    // Needs to be divided with project_uCommonUnitsPerMeter
    position.w *= u_PixelsPerMeter.z;
  }

  return viewProjectionMatrix * position + center;
}

// Projects from common space coordinates to clip space
vec4 project_common_position_to_clipspace(vec4 position) {
  return project_common_position_to_clipspace(
    position,
    u_ViewProjectionMatrix,
    u_ViewportCenterProjection
  );
}

void main() {
  vec2 offset = a_Extrude.xy * 10.0;
  
  offset = project_pixel(offset);

  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));
 
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));
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