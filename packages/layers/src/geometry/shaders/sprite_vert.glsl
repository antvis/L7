layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec3 a_Color;

layout(std140) uniform commonUniforms {
  float u_opacity;
  float u_mapFlag;
  float u_Scale;
};

out vec3 v_Color;
out float v_d;

#pragma include "projection"
void main() {
   v_Color = a_Color.xyz;
  
   vec4 project_pos = project_position(vec4(a_Position, 1.0));

   v_d = a_Position.z;

  gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xy, a_Position.z, 1.0));
gl_PointSize = pow((u_Zoom - 1.0), 2.0) * u_Scale;
}
