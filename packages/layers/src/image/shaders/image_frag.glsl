uniform sampler2D u_texture;
layout(std140) uniform commonUniforms {
 float u_opacity;
};

in vec2 v_texCoord;
out vec4 outputColor;
void main() {
  vec4 color = texture(SAMPLER_2D(u_texture),vec2(v_texCoord.x,v_texCoord.y));
  outputColor = color;
  outputColor.a *= u_opacity;
  if(outputColor.a < 0.01)
    discard;
}
