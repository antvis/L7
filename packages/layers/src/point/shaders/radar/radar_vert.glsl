attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Extrude;
attribute float a_Size;
uniform float u_speed: 1.0;
uniform float u_time;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;
uniform float u_isMeter;

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;
varying vec2 v_exteude;

#pragma include "projection"
#pragma include "picking"

void main() {
  vec3 extrude = a_Extrude;
  float newSize = setPickingSize(a_Size);

  float time = u_time * u_speed;
  mat2 rotateMatrix = mat2( 
    cos(time), sin(time), 
    -sin(time), cos(time)
  );
  v_exteude = rotateMatrix * a_Extrude.xy;

  // unpack color(vec2)
  v_color = a_Color;

  // radius(16-bit)
  v_radius = newSize;

  // anti-alias
  float blur = 0.0;
  float antialiasblur = -max(2.0 / u_DevicePixelRatio / a_Size, blur);

  vec2 offset = (extrude.xy * (newSize));
  vec3 aPosition = a_Position;
  if(u_isMeter < 1.0) {
    // 不以米为实际单位
    offset = project_pixel(offset);
  } else {
    // 以米为实际单位
    antialiasblur *= pow(19.0 - u_Zoom, 2.0);
    antialiasblur = max(antialiasblur, -0.01);
    // offset *= 0.5;

    if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      aPosition.xy += offset;
      offset.x = 0.0;
      offset.y = 0.0;
    }
  }

  v_data = vec4(extrude.x, extrude.y, antialiasblur, -1.0);

  vec4 project_pos = project_position(vec4(aPosition.xy, 0.0, 1.0));

  if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
    gl_Position = u_Mvp * vec4(project_pos.xy + offset, 0.0, 1.0);
  } else {
    gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, project_pixel(setPickingOrder(0.0)), 1.0));
  }

  setPickingColor(a_PickingColor);
}
