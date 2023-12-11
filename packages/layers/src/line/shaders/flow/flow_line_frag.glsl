// #extension GL_OES_standard_derivatives : enable

in vec4 v_color;
out vec4 outputColor;


// line texture

#pragma include "picking"

void main() {
  outputColor = v_color;
  outputColor = filterColor(outputColor);
}
