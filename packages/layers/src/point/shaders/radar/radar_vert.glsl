layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec4 a_Color;
layout(location = 11) in vec4 a_ExtrudeAndSize;

layout(std140) uniform commonUniorm {
  float u_additive;
  float u_size_unit;
  float u_speed: 1.0;
  float u_time;
};

out vec4 v_data;
out vec4 v_color;
out float v_radius;
out vec2 v_extrude;

#pragma include "projection"
#pragma include "picking"

void main() {
  vec3 extrude = a_ExtrudeAndSize.xyz;
  float newSize = setPickingSize(a_ExtrudeAndSize.w);

  float time = u_time * u_speed;
  mat2 rotateMatrix = mat2( 
    cos(time), sin(time), 
    -sin(time), cos(time)
  );
  v_extrude = rotateMatrix * a_ExtrudeAndSize.xy;

  v_color = a_Color;
  v_color.a *= opacity;

  float blur = 0.0;
  float antialiasblur = -max(2.0 / u_DevicePixelRatio / a_ExtrudeAndSize.w, blur);

  if(u_size_unit == 1.) {
    newSize = newSize  * u_PixelsPerMeter.z;
  }
  v_radius = newSize;

  vec2 offset = (extrude.xy * (newSize));
  vec3 aPosition = a_Position;
  
  offset = project_pixel(offset);
  
  v_data = vec4(extrude.x, extrude.y, antialiasblur, -1.0);

  vec4 project_pos = project_position(vec4(aPosition.xy, 0.0, 1.0));
  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xy + offset, project_pixel(setPickingOrder(0.0)), 1.0));

  setPickingColor(a_PickingColor);
}
