
in vec3 vVertexNormal;
in vec4 v_Color;

layout(std140) uniform commonUniforms {
 float u_opacity;
};
out vec4 outputColor;
#pragma include "scene_uniforms"
void main() {
    float intensity =  - dot(normalize(vVertexNormal), normalize(u_CameraPosition));
    // 去除背面
    if(intensity > 1.0) intensity = 0.0;

    outputColor = vec4(v_Color.rgb, v_Color.a * intensity * u_opacity);
}
