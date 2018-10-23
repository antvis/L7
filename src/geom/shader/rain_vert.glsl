precision highp float;
attribute vec3 a_position;
attribute vec2 a_uv;
uniform mat4 matModelViewProjection;
uniform float u_time;
// varying float v_time;

varying vec2 v_texCoord;
varying  vec4 v_color;
float random (in float x) {
    return fract(sin(x)*1e4);
}

void main() {
   v_texCoord = a_uv;
   gl_Position =  matModelViewProjection * vec4(a_position, 1.0);
   gl_PointSize = 1.0;
}