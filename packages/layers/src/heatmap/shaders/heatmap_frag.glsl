uniform sampler2D u_texture;        // 热力强度图
uniform sampler2D u_colorTexture;   // 根据强度分布的色带

layout(std140) uniform commonUniforms {
  float u_opacity;
  float u_common_uniforms_padding1;
  float u_common_uniforms_padding2;
  float u_common_uniforms_padding3;
};
in vec2 v_texCoord;
out vec4 outputColor;

#pragma include "scene_uniforms"

float getBlurIndusty() {
    float vW = 2.0/ u_ViewportSize.x;
    float vH = 2.0/ u_ViewportSize.y;
    vec2 vUv = v_texCoord;
    float i11 = texture(SAMPLER_2D(u_texture), vec2( vUv.x - 1.0 * vW, vUv.y + 1.0 * vH) ).r;
    float i12 = texture(SAMPLER_2D(u_texture), vec2( vUv.x - 0.0 * vW, vUv.y + 1.0 * vH) ).r;
    float i13 = texture(SAMPLER_2D(u_texture), vec2( vUv.x + 1.0 * vW, vUv.y + 1.0 * vH) ).r;

    float i21 = texture(SAMPLER_2D(u_texture), vec2( vUv.x - 1.0 * vW, vUv.y) ).r;
    float i22 = texture(SAMPLER_2D(u_texture), vec2( vUv.x , vUv.y) ).r;
    float i23 = texture(SAMPLER_2D(u_texture), vec2( vUv.x + 1.0 * vW, vUv.y) ).r;

    float i31 = texture(SAMPLER_2D(u_texture), vec2( vUv.x - 1.0 * vW, vUv.y-1.0*vH) ).r;
    float i32 = texture(SAMPLER_2D(u_texture), vec2( vUv.x - 0.0 * vW, vUv.y-1.0*vH) ).r;
    float i33 = texture(SAMPLER_2D(u_texture), vec2( vUv.x + 1.0 * vW, vUv.y-1.0*vH) ).r;

    return(
        i11 + 
        i12 + 
        i13 + 
        i21 + 
        i21 + 
        i22 + 
        i23 + 
        i31 + 
        i32 + 
        i33
        )/9.0;
}


void main(){
    // float intensity = texture(u_texture, v_texCoord).r;
    float intensity = getBlurIndusty();
    vec4 color = texture(SAMPLER_2D(u_colorTexture), vec2(intensity, 0.0));
    outputColor = color;
    outputColor.a = color.a * smoothstep(0.,0.1,intensity) * u_opacity;
}
