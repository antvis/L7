precision highp float;

#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute float a_Size;
uniform mat4 u_ModelMatrix;

varying vec4 v_Color;

#pragma include "projection"
#pragma include "picking"

void main() {
  vec4 project_pos = project_position(vec4(a_Position.xy, project_pixel(a_Position.z * a_Size), 1.0));

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

 vec3 worldPos = vec3(project_pos * u_ModelMatrix);

 vec3 worldNormal = vec3(vec4(a_Normal,1.0) * u_ModelMatrix);
//  vec3 worldNormal = project_normal(a_Normal);
  // //cal light weight
 vec3 viewDir = normalize(u_CameraPosition - worldPos);

 vec3 lightDir = normalize(vec3(1, -10.5, 12));

 vec3 halfDir = normalize(viewDir+lightDir);
  // //lambert
 float lambert = dot(worldNormal, lightDir);
    //specular
 float specular = pow( max(0.0, dot(worldNormal, halfDir)), 16.0);
    //sum to light weight
 float lightWeight = ambientRatio + diffuseRatio * lambert + specularRatio * specular;
  // v_Color = a_Color;
  v_Color =vec4(a_Color.rgb * lightWeight, a_Color.w); 



  setPickingColor(a_PickingColor);
}

