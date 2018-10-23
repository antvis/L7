precision highp float;
#define ambientRatio 0.65
#define diffuseRatio 0.6
#define specularRatio  0.4
attribute vec4 a_color; 
attribute vec4 a_idColor;
attribute vec2 faceUv;
varying vec2 v_texCoord;
varying float vlightWeight;


varying  vec4 v_color;
void main() {
  mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
  vec3 worldPos = vec3(vec4(position,1.0) * modelMatrix);
  vec3 worldNormal = vec3(vec4(normal,1.0) * modelMatrix);
  // //cal light weight
  vec3 viewDir = normalize(cameraPosition - worldPos);
  vec3 lightDir = normalize(vec3(0.5,0,-1));
  // vec3 lightDir = normalize(vec3(0.05,-0.001,-1));
  vec3 halfDir = normalize(viewDir+lightDir);
  // //lambert
  float lambert = 0.5 * dot(worldNormal, lightDir) + 0.8;
    //specular
  float specular = pow( max(0.0, dot(worldNormal, halfDir)), 32.0);
    //sum to light weight
  float lightWeight = ambientRatio + diffuseRatio * lambert + specularRatio * specular;
  vlightWeight = lightWeight;
  v_texCoord = faceUv;
  v_color =vec4(a_color.rgb * lightWeight, a_color.w);

  gl_Position =  matModelViewProjection * vec4(position, 1.0);
}