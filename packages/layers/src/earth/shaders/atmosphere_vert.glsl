
attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute vec2 a_Uv;
attribute vec4 a_Color;
uniform vec3 u_CameraPosition;
varying float v_CamreaDistance;

uniform mat4 u_ViewProjectionMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;

varying vec3 vVertexNormal;
varying vec4 v_Color;
varying float v_offset;

void main() {
    float EARTH_RADIUS = 100.0;
    
    v_Color = a_Color;

    v_offset = min(((length(u_CameraPosition) - EARTH_RADIUS)/600.0) * 0.5 + 0.4, 1.0);
    vVertexNormal = a_Normal;

    gl_Position = u_ViewProjectionMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
}
