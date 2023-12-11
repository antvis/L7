
layout(std140) uniform commonUniforms {
  float u_opacity;
  float u_mapFlag;
  float u_Scale;
};
uniform sampler2D u_texture;

in vec3 v_Color;
in float v_d;
out vec4 outputColor;

void main() {

  if(v_d < 0.0) {
    discard;
  }

  if(u_mapFlag > 0.0) {
    outputColor = texture(SAMPLER_2D(u_texture), gl_PointCoord);
    outputColor.a *= u_opacity;
  } else {
    outputColor = vec4(v_Color, u_opacity);
  }
}
