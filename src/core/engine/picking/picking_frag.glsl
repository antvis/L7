#ifdef GL_ES
precision highp float;
#endif
varying vec4 worldId;
void main() {
    gl_FragColor = worldId;
}