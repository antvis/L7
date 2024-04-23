layout(location = 0) in vec3 a_Position;
layout(location = 10) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
  float u_opacity;
  float u_common_uniforms_padding1;
  float u_common_uniforms_padding2;
  float u_common_uniforms_padding3;
};

#pragma include "scene_uniforms"

out vec2 v_texCoord;
void main() {
  v_texCoord = a_Uv;
  #ifdef VIEWPORT_ORIGIN_TL
  v_texCoord.y = 1.0 - v_texCoord.y;
  #endif

  gl_Position = vec4(a_Position.xy, 0, 1.0);
}
