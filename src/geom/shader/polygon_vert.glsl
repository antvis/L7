precision highp float;
#define ambientRatio 0.5
#define diffuseRatio 0.4
#define specularRatio 0.1
attribute vec4 a_color; 
attribute vec2 faceUv;
attribute vec3 a_shape;
attribute vec3 a_size;
uniform float u_zoom;
uniform float u_opacity;
varying vec2 v_texCoord;
varying  vec4 v_color;
varying float v_lightWeight;
varying float v_size;
uniform float u_activeId;
uniform vec4 u_activeColor;
void main() {
   float scale = pow(2.0,(20.0 - u_zoom));
  mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
  worldId = id_toPickColor(pickingId);
  vec3 newposition =  position;
  // newposition.x -= 128.0;
   #ifdef SHAPE 
    newposition =position + a_size * scale* a_shape + vec3(0., a_size.y * scale / 4., 0.);
  #endif
   v_texCoord = faceUv;
  if(normal == vec3(0.,0.,1.)){
     v_color = a_color;
    v_color.a *= u_opacity;
    if(pickingId == u_activeId) {
        v_color = u_activeColor;
     }
      v_size = a_size.x * scale;
     gl_Position =  matModelViewProjection  * vec4(newposition, 1.0);
     return;
  }
  
  vec3 worldPos = vec3(vec4(newposition,1.0) * modelMatrix);
  vec3 worldNormal = vec3(vec4(normal,1.0) * modelMatrix);
  // //cal light weight
  vec3 viewDir = normalize(cameraPosition - worldPos);
  //vec3 lightDir = normalize(vec3(1, -10.5, 12));
  vec3 lightDir = normalize(vec3(0.,-10.,1.));
  vec3 halfDir = normalize(viewDir+lightDir);
  // //lambert
  float lambert = dot(worldNormal, lightDir);
    //specular
  float specular = pow( max(0.0, dot(worldNormal, halfDir)), 32.0);
    //sum to light weight
  float lightWeight = ambientRatio + diffuseRatio * lambert + specularRatio * specular;
  v_texCoord = faceUv;
  v_lightWeight = lightWeight;
 
  v_color =vec4(a_color.rgb*lightWeight, a_color.w); 
   if(pickingId == u_activeId) {
     v_color = u_activeColor;
   }
  gl_Position =  matModelViewProjection * vec4(newposition, 1.0);
  

}