precision highp float;

#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

out vec2 v_texCoord;
out vec4 v_Color;
out float v_worldDis;

layout(std140) uniform commonUniforms {
  vec4 u_baseColor : [ 1.0, 0, 0, 1.0 ];
  vec4 u_brightColor : [ 1.0, 0, 0, 1.0 ];
  vec4 u_windowColor : [ 1.0, 0, 0, 1.0 ];
  vec4 u_circleSweepColor;
  vec2 u_cityCenter;
  float u_circleSweep;
  float u_cityMinSize;
  float u_circleSweepSpeed;
  float u_opacity: 1.0;
  float u_near : 0;
  float u_far : 1;
  float u_time;
};
#pragma include "projection"
#pragma include "light"
#pragma include "picking"


void main() {
  vec4 pos = vec4(a_Position.xy, a_Position.z * a_Size, 1.0);
  vec4 project_pos = project_position(pos);

   v_texCoord = a_Uv;

  if(u_circleSweep > 0.0) {
     vec2 lnglatscale = vec2(0.0);
    lnglatscale = (a_Position.xy - u_cityCenter) * vec2(0.0, 0.135);
    v_worldDis = length(a_Position.xy + lnglatscale - u_cityCenter);
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  float lightWeight = calc_lighting(pos);
  // v_Color = a_Color;
  v_Color = vec4(a_Color.rgb * lightWeight, a_Color.w);

  setPickingColor(a_PickingColor);
}
