precision highp float;

#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

attribute vec3 a_Position;
attribute vec3 a_Pos;
attribute vec4 a_Color;
attribute vec3 a_Size;
attribute vec3 a_Normal;

uniform mat4 u_ModelMatrix;
varying vec4 v_color;

#pragma include "projection"
#pragma include "light"

void main() {
 vec3 size = a_Size * a_Position;

 vec2 offset = project_pixel(size.xy);
 
 vec4 project_pos = project_position(vec4(a_Pos.xy, 0, 1.0));
 vec4 pos = vec4(project_pos.xy + offset, project_pixel(size.z), 1.0);

 float lightWeight = calc_lighting(pos);

//  vec3 worldPos = vec3(pos * u_ModelMatrix);

//  vec3 worldNormal = vec3(vec4(a_Normal,1.0));
//   // //cal light weight
//  vec3 viewDir = normalize(u_CameraPosition - worldPos);

//  vec3 lightDir = normalize(vec3(1, -10.5, 12));

//  vec3 halfDir = normalize(viewDir+lightDir);
//   // //lambert
//  float lambert = dot(worldNormal, lightDir);
//     //specular
//  float specular = pow( max(0.0, dot(worldNormal, halfDir)), 32.0);
//     //sum to light weight
//  float lightWeight = ambientRatio + diffuseRatio * lambert + specularRatio * specular;

 v_color =vec4(a_Color.rgb*lightWeight, a_Color.w); 

 gl_Position = project_common_position_to_clipspace(pos);

}
