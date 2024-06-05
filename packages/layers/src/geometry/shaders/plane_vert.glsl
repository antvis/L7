layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec3 a_Color;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
  float u_opacity;
  float u_mapFlag;
  float u_terrainClipHeight;
};

out vec3 v_Color;
out vec2 v_uv;
out float v_clip;

#pragma include "projection"
#pragma include "picking"
void main() {
  v_Color = a_Color;
  v_uv = a_Uv;

  vec4 project_pos = project_position(vec4(a_Position, 1.0));

  v_clip = 1.0;
  if (a_Position.z < u_terrainClipHeight) {
    v_clip = 0.0;
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, a_Position.z, 1.0));

  setPickingColor(a_PickingColor);
}
