uniform sampler2D u_texture;        // 热力强度图
uniform sampler2D u_colorTexture;   // 根据强度分布的色带
uniform float u_opacity;
varying vec2 v_texCoord;

uniform vec2 u_ViewportSize;

float getBlurIndusty() {
    float vW = 2.0/u_ViewportSize.x;
    float vH = 2.0/u_ViewportSize.y;
    vec2 vUv = v_texCoord;
    float i11 = texture2D( u_texture, vec2( vUv.x - 1.0 * vW, vUv.y + 1.0 * vH) ).r;
    float i12 = texture2D( u_texture, vec2( vUv.x - 0.0 * vW, vUv.y + 1.0 * vH) ).r;
    float i13 = texture2D( u_texture, vec2( vUv.x + 1.0 * vW, vUv.y + 1.0 * vH) ).r;

    float i21 = texture2D( u_texture, vec2( vUv.x - 1.0 * vW, vUv.y) ).r;
    float i22 = texture2D( u_texture, vec2( vUv.x , vUv.y) ).r;
    float i23 = texture2D( u_texture, vec2( vUv.x + 1.0 * vW, vUv.y) ).r;

    float i31 = texture2D( u_texture, vec2( vUv.x - 1.0 * vW, vUv.y-1.0*vH) ).r;
    float i32 = texture2D( u_texture, vec2( vUv.x - 0.0 * vW, vUv.y-1.0*vH) ).r;
    float i33 = texture2D( u_texture, vec2( vUv.x + 1.0 * vW, vUv.y-1.0*vH) ).r;

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
    // float intensity = texture2D(u_texture, v_texCoord).r;
    float intensity = getBlurIndusty();
    vec4 color = texture2D(u_colorTexture, vec2(intensity, 0.0));

    gl_FragColor =color;
    gl_FragColor.a = color.a * smoothstep(0.,0.1,intensity) * u_opacity;

}
