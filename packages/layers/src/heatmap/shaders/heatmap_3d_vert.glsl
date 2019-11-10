precision highp float;
attribute vec3 a_Position;
attribute vec2 a_Uv;
uniform sampler2D u_texture;
varying vec2 v_texCoord;
uniform mat4 u_ModelMatrix;
uniform mat4 u_InverseViewProjectionMatrix;
varying float v_intensity;

vec2 toBezier(float t, vec2 P0, vec2 P1, vec2 P2, vec2 P3) {
    float t2 = t * t;
    float one_minus_t = 1.0 - t;
    float one_minus_t2 = one_minus_t * one_minus_t;
    return (P0 * one_minus_t2 * one_minus_t + P1 * 3.0 * t * one_minus_t2 + P2 * 3.0 * t2 * one_minus_t + P3 * t2 * t);
}
vec2 toBezier(float t, vec4 p){
    return toBezier(t, vec2(0.0, 0.0), vec2(p.x, p.y), vec2(p.z, p.w), vec2(1.0, 1.0));
}
#pragma include "projection"
void main() {
  v_texCoord = a_Uv;

  vec2 pos = 1.8 * (a_Uv * vec2(2.0) - vec2(1.0));


  vec4 p1 = vec4(pos, 0.0, 1.0);
	vec4 p2 = vec4(pos, 1.0, 1.0);

	vec4 inverseP1 = unproject_clipspace_to_position(p1, u_InverseViewProjectionMatrix);
	vec4 inverseP2 = unproject_clipspace_to_position(p2, u_InverseViewProjectionMatrix) ;

  inverseP1 = inverseP1 / inverseP1.w;
	inverseP2 = inverseP2 / inverseP2.w;

	float zPos = (0.0 - inverseP1.z) / (inverseP2.z - inverseP1.z);
	vec4 position = inverseP1 + zPos * (inverseP2 - inverseP1);

  vec4 b= vec4(0.5000, 0, 1, 0.5000);
  float fh;

  v_intensity = texture2D(u_texture, v_texCoord).r;
  fh = toBezier(v_intensity, b).y;
  gl_Position = project_common_position_to_clipspace(vec4(position.xy, v_intensity * 50., 1.0));

}
