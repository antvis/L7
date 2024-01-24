uniform sampler2D u_texture;
layout(std140) uniform commonUniforms {
 vec2 u_rminmax;
 vec2 u_gminmax;
 vec2 u_bminmax;
 float u_opacity;
 float u_noDataValue;
};

in vec2 v_texCoord;

out vec4 outputColor;

void main() {

  vec3 rgb = texture(SAMPLER_2D(u_texture),vec2(v_texCoord.x,v_texCoord.y)).rgb;

  if(rgb == vec3(u_noDataValue)) {
    outputColor = vec4(0.0, 0, 0, 0.0);
  } else {
    outputColor = vec4(rgb.r / (u_rminmax.y -u_rminmax.x), rgb.g /(u_gminmax.y -u_gminmax.x), rgb.b/ (u_bminmax.y - u_bminmax.x), u_opacity);
  }

  if(outputColor.a < 0.01)
    discard;
 
}