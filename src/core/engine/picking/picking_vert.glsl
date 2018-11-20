attribute float pickingId;
 #ifdef polyline
 attribute float a_size;
 attribute float a_miter;
#endif 
#ifdef point
attribute vec3 a_size;
attribute vec3 a_shape;
#endif
uniform float u_zoom;
varying vec4 worldId;
void main() {
    mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
    float scale = pow(2.0,(20.0 - u_zoom));
    vec3 newposition =  position;
    #ifdef point 
        newposition =position + a_size * scale * a_shape;
    #endif
    #ifdef polyline
      newposition = position.xyz + vec3(normal * a_size * pow(2.0,20.0-u_zoom) / 2.0 * a_miter);
     #endif 
    float id = step(0.,pickingId) * pickingId;
    vec3 a = fract(vec3(1.0/255.0, 1.0/(255.0*255.0), 1.0/(255.0*255.0*255.0)) * id);
    a -= a.xxy * vec3(0.0, 1.0/255.0, 1.0/255.0);
    worldId = vec4(a,1);
    //gl_PointSize = a_size;
    gl_Position = matModelViewProjection * vec4( newposition, 1.0 );
}