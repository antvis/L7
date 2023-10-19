
layout(std140) uniform ModelUniforms {
  float u_opacity;
};

#pragma include "picking"

in vec3 vVertexNormal;
in float v_offset;
in vec4 v_Color;

out vec4 outputColor;

void main() {
  float intensity = pow(v_offset + dot(normalize(vVertexNormal), normalize(u_CameraPosition)), 3.0);
  // 去除背面
  if(intensity > 1.0) intensity = 0.0;

  outputColor = vec4(v_Color.rgb, v_Color.a * intensity * u_opacity);
}
