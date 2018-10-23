attribute float pickingId;
attribute float a_size;
varying vec4 worldId;
void main() {
    mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
    vec3 a = fract(vec3(1.0/255.0, 1.0/(255.0*255.0), 1.0/(255.0*255.0*255.0)) * pickingId);
    a -= a.xxy * vec3(0.0, 1.0/255.0, 1.0/255.0);
    worldId = vec4(a,1);
    gl_PointSize = a_size;
    gl_Position = matModelViewProjection * vec4( position, 1.0 );
}