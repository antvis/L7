precision mediump float;

attribute vec3 a_position;

varying vec2 v_tex_pos;

void main() {
    v_tex_pos = vec2(a_position);
    gl_Position = vec4(1.0 - 2.0 * vec2(a_position), 0, 1);
}
