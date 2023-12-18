layout(location = 0) in vec3 a_Position;
layout(location = 1) vec4 a_Color;
layout(location = 13) in vec3 a_Normal;
layout(location = 14) in vec2 a_Uv;
layout(std140) uniform commonUniforms {
 float u_opacity;
};
#pragma include "scene_uniforms"

out vec3 vVertexNormal;
out vec4 v_Color;

void main() {
    v_Color = a_Color;

    vVertexNormal = a_Normal;

    gl_Position = u_ViewProjectionMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
}
