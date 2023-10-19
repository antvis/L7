layout(location = 0) in vec3 a_Position;
layout(location = 1) in vec4 a_Color;
layout(location = 7) in vec3 a_Normal;
layout(location = 8) in vec2 a_Uv;

layout(std140) uniform ModelUniforms {
  float u_opacity;
};

#pragma include "projection"
#pragma include "picking"

out vec3 vVertexNormal;
out vec4 v_Color;

void main() {
  v_Color = a_Color;

  vVertexNormal = a_Normal;

  gl_Position = u_ViewProjectionMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
}
