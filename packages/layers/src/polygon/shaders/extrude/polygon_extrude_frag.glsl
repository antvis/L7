layout(std140) uniform commonUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_linearColor;
  float u_topsurface;
  float u_sidesurface;
  float u_heightfixed; // 默认不固定
  float u_raisingHeight;
};

in vec4 v_Color;
#pragma include "scene_uniforms"
#pragma include "picking"
out vec4 outputColor;
void main() {

     // top face
    if(u_topsurface < 1.0) {
      discard;
    }

    outputColor = v_Color;
  
  outputColor = filterColor(outputColor);
}
