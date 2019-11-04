precision highp float;
attribute vec3 a_Position;
attribute vec2 a_Uv;
uniform sampler2D u_texture;
uniform vec4 u_extent;
varying vec2 v_texCoord;
uniform mat4 u_ModelMatrix;
uniform mat4 u_InverseViewProjectionMatrix;
#pragma include "projection"
void main() {
  v_texCoord = a_Uv;

  vec2 pos = a_Uv * vec2(2.0) - vec2(1.0);

  vec4 n_0 = vec4(pos, 0.0, 1.0) - u_ViewportCenterProjection;
	vec4 n_1 = vec4(pos, 1.0, 1.0) - u_ViewportCenterProjection;

	vec4 m_0 = u_InverseViewProjectionMatrix * n_0 ;
	vec4 m_1 = u_InverseViewProjectionMatrix * n_1;
	m_0 = m_0 / m_0.w;
	m_1 = m_1 / m_1.w;

	float zPos = (0.0 - m_0.z) / (m_1.z - m_0.z);
	vec4 mapCoord = m_0 + zPos * (m_1 - m_0);

  // vec4 p = u_InverseViewProjectionMatrix * (vec4(pos,0,1) - u_ViewportCenterProjection);
  // p = p /p.w;
  // pos.y = 1.0 -pos.y;
  // vec2 minxy =  project_position(vec4(u_extent.xy, 0, 1.0)).xy;
  // vec2 maxxy =  project_position(vec4(u_extent.zw, 0, 1.0)).xy;

  // vec2 step = (maxxy - minxy);

  // vec2 pos = minxy + (vec2(a_Position.x, a_Position.y ) + vec2(1.0)) / vec2(2.0)  * step;

  float intensity = texture2D(u_texture, v_texCoord).r;
  gl_Position = project_common_position_to_clipspace(vec4(mapCoord.xy, intensity * 100., 1.0));
  // gl_Position = vec4(pos,0.,1.0);
  // v_texCoord =  (gl_Position.xy + vec2(1.0)) / vec2(2.0) / gl_Position.w;
  // v_texCoord.y = 1.0 - v_texCoord.y;

}
