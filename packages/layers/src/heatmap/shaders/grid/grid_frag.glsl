in vec4 v_color;

#pragma include "scene_uniforms"
#pragma include "picking"
out vec4 outputColor;
void main() {
  outputColor = v_color;
  outputColor = filterColor(outputColor);
}
