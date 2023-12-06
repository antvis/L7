in vec4 v_color;
in float v_opacity;
out vec4 outputColor;

#pragma include "picking"

void main() {
  outputColor = v_color;
  outputColor.a *= v_opacity;

  outputColor = filterColor(outputColor);
}
