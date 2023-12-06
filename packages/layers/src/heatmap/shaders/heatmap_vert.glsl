
layout(location = 0) in vec3 a_Position;
layout(location = 9) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
    float u_opacity;
};

#pragma include "scene_uniforms"

out vec2 v_texCoord;
void main() {
  v_texCoord = a_Uv;

  gl_Position = vec4(a_Position.xy, 0, 1.);
}
