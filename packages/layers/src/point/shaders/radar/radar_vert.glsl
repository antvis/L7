attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Extrude;
attribute float a_Size;
uniform float u_speed: 1.0;
uniform float u_time;

uniform mat4 u_ModelMatrix;

uniform int u_size_unit;

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

  // anti-alias
  float blur = 0.0;
  float antialiasblur = -max(2.0 / u_DevicePixelRatio / a_Size, blur);

  if(u_size_unit == 1) {
    newSize = newSize  * u_PixelsPerMeter.z;
  }
  // radius(16-bit)
  v_radius = newSize;

  vec2 offset = (extrude.xy * (newSize));
  vec3 aPosition = a_Position;
  
    // 不以米为实际单位
  offset = project_pixel(offset);
  
  v_data = vec4(extrude.x, extrude.y, antialiasblur, -1.0);

  vec4 project_pos = project_position(vec4(aPosition.xy, 0.0, 1.0));
  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xy + offset, project_pixel(setPickingOrder(0.0)), 1.0));

  setPickingColor(a_PickingColor);
}
