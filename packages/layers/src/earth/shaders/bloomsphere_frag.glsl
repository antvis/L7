layout(std140) uniform ModelUniforms {
  float u_opacity;
};

#pragma include "picking"

in vec3 vVertexNormal;
in vec4 v_Color;
out vec4 outputColor;

void main() {
    float intensity =  - dot(normalize(vVertexNormal), normalize(u_CameraPosition));
    // 去除背面
    if(intensity > 1.0) intensity = 0.0;

    outputColor = vec4(v_Color.rgb, v_Color.a * intensity * u_opacity);
}
