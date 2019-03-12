precision highp float;
attribute float a_miter;
attribute vec3 a_size;
attribute vec3 a_shape;
uniform float u_strokeWidth;
uniform float u_zoom;
uniform float u_time;
varying float vTime;
varying float v_pickingId;
void main() {
 mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
 float scale = pow(2.0,(20.0 - u_zoom));
 vec3 newposition = position + (a_size + vec3(u_strokeWidth/2.,u_strokeWidth/2.,0)) * scale* a_shape;
   #ifdef ANIMATE 
        vTime = 1.0- (mod(u_time*50.,3600.)- position.z) / 100.;
   #endif
  v_pickingId = pickingId;
 //vec3 pointPos = newposition.xyz + vec3(normal * u_strokeWidth * pow(2.0,20.0-u_zoom) / 2.0 * a_miter);
 vec3 pointPos = newposition.xyz + vec3(normal * u_strokeWidth * scale / 2.0 * a_miter);
 gl_Position = matModelViewProjection * vec4(pointPos, 1.0);
 worldId = id_toPickColor(pickingId);

}