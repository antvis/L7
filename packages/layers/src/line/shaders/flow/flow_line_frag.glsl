#extension GL_OES_standard_derivatives : enable

varying vec4 v_color;


// line texture

#pragma include "picking"

void main() {
gl_FragColor = v_color;
gl_FragColor = filterColor(gl_FragColor);
}
