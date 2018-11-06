precision highp float;
#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2
attribute vec4 a_color; 
attribute vec4 a_idColor;
attribute vec2 faceUv;
varying vec2 v_texCoord;
varying  vec4 v_color;
void main() {
  mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
  vec3 worldPos = vec3(vec4(position,1.0) * modelMatrix);
  vec3 worldNormal = vec3(vec4(normal,1.0) * modelMatrix);
  // //cal light weight
  vec3 viewDir = normalize(cameraPosition - worldPos);
  vec3 lightDir = normalize(vec3(1, -10.5, 12));
  //vec3 lightDir = normalize(vec3(0.05,-0.001,-1));
  vec3 halfDir = normalize(viewDir+lightDir);
  // //lambert
  float lambert = dot(worldNormal, lightDir);
    //specular
  float specular = pow( max(0.0, dot(worldNormal, halfDir)), 32.0);
    //sum to light weight
  float lightWeight = ambientRatio + diffuseRatio * lambert + specularRatio * specular;
  v_texCoord = faceUv;
  v_color =vec4(a_color.rgb * lightWeight, a_color.w); 
  gl_Position =  matModelViewProjection * vec4(position, 1.0);
}