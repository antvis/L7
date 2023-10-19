out vec4 outputColor;

in vec4 v_color;

layout(std140) uniform ModelUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_opacity;
  float u_vertexScale;
  float u_linearColor;
};

void main() {
  outputColor = vec4(1.0, 0.0, 0.0, 1.0);
}
