
attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute vec2 a_Uv;
attribute vec4 a_Color;
uniform vec3 u_CameraPosition;
uniform mat4 u_ViewProjectionMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;

varying vec3 vVertexNormal;
varying vec4 v_Color;

void main() {
    v_Color = a_Color;

    vVertexNormal = a_Normal;

    gl_Position = u_ViewProjectionMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
}
