export const vert = `


#define TILE_SIZE 512.0
#define PI 3.1415926536
#define WORLD_SCALE TILE_SIZE / (PI * 2.0)

#define COORDINATE_SYSTEM_P20 5.0           // amap
#define COORDINATE_SYSTEM_P20_OFFSET 6.0    // amap offset

attribute vec3 a_Position;
attribute vec3 a_Extrude;

uniform mat4 u_ModelMatrix;


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


vec4 project_offset(vec4 offset) {
  float dy = offset.y;
  dy = clamp(dy, -1., 1.);
  vec3 pixels_per_unit = u_PixelsPerDegree + u_PixelsPerDegree2 * dy;
  return vec4(offset.xyz * pixels_per_unit, offset.w);
}


vec4 project_position(vec4 position) {
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
    return pixel * pow(2.0, (19.0 - u_Zoom));
  }
  return pixel * -1.;
}


vec4 project_common_position_to_clipspace(vec4 position, mat4 viewProjectionMatrix, vec4 center) {
  return viewProjectionMatrix * position + center;
}

vec4 project_common_position_to_clipspace(vec4 position) {
  return project_common_position_to_clipspace(
    position,
    u_ViewProjectionMatrix,
    u_ViewportCenterProjection
  );
}

vec4 unproject_clipspace_to_position(vec4 clipspacePos, mat4 u_InverseViewProjectionMatrix) {
  vec4 pos = u_InverseViewProjectionMatrix * (clipspacePos - u_ViewportCenterProjection);
  return pos;
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