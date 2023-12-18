layout(std140) uniform commonUniforms {
  mat4 u_ViewProjectionMatrixUncentered;
  mat4 u_InverseViewProjectionMatrix;
  float u_opacity;
  float u_common_uniforms_padding1;
  float u_common_uniforms_padding2;
  float u_common_uniforms_padding3;
};

uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;

in vec2 v_texCoord;
in float v_intensity;
out vec4 outputColor;

void main(){
   
    float intensity = texture(SAMPLER_2D(u_texture), v_texCoord).r;
    vec4 color = texture(SAMPLER_2D(u_colorTexture),vec2(intensity, 0));
    outputColor = color;
    // gl_FragColor.a = color.a * smoothstep(0.1,0.2,intensity)* u_opacity;
   outputColor.a = color.a * smoothstep(0.,0.1,intensity) * u_opacity;
}
