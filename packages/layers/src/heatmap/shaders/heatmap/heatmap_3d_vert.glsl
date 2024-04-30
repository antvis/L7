layout(location = 0) in vec3 a_Position;
layout(location = 10) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
  mat4 u_ViewProjectionMatrixUncentered;
  mat4 u_InverseViewProjectionMatrix;
  float u_opacity;
  float u_common_uniforms_padding1;
  float u_common_uniforms_padding2;
  float u_common_uniforms_padding3;
};

uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;

out vec2 v_texCoord;
out float v_intensity;

vec2 toBezier(float t, vec2 P0, vec2 P1, vec2 P2, vec2 P3) {
  float t2 = t * t;
  float one_minus_t = 1.0 - t;
  float one_minus_t2 = one_minus_t * one_minus_t;
  return P0 * one_minus_t2 * one_minus_t +
  P1 * 3.0 * t * one_minus_t2 +
  P2 * 3.0 * t2 * one_minus_t +
  P3 * t2 * t;
}
vec2 toBezier(float t, vec4 p) {
  return toBezier(t, vec2(0.0, 0.0), vec2(p.x, p.y), vec2(p.z, p.w), vec2(1.0, 1.0));
}

#pragma include "projection"
#pragma include "project"

void main() {
  v_texCoord = a_Uv;

  vec2 pos = a_Uv * vec2(2.0) - vec2(1.0); // 将原本 0 -> 1 的 uv 转换为 -1 -> 1 的标准坐标空间（NDC）

  vec4 p1 = vec4(pos, 0.0, 1.0); // x/y 平面上的点（z == 0）可以认为是三维上的点被投影到平面后的点
  vec4 p2 = vec4(pos, 1.0, 1.0); // 平行于x/y平面、z==1 的平面上的点

  vec4 inverseP1 = u_InverseViewProjectionMatrix * p1; // 根据视图投影矩阵的逆矩阵平面上的反算出三维空间中的点（p1平面上的点）
  vec4 inverseP2 = u_InverseViewProjectionMatrix * p2;

  inverseP1 = inverseP1 / inverseP1.w; // 归一化操作（归一化后为世界坐标）
  inverseP2 = inverseP2 / inverseP2.w;

  float zPos = (0.0 - inverseP1.z) / (inverseP2.z - inverseP1.z); // ??
  vec4 position = inverseP1 + zPos * (inverseP2 - inverseP1);

  vec4 b = vec4(0.5, 0.0, 1.0, 0.5);
  float fh;

  v_intensity = texture(SAMPLER_2D(u_texture), v_texCoord).r;
  fh = toBezier(v_intensity, b).y;
  gl_Position = u_ViewProjectionMatrixUncentered * vec4(position.xy, fh * project_pixel(50.0), 1.0);

}
