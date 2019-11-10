uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;
uniform float u_opacity;
varying vec2 v_texCoord;

void main(){
    float intensity = texture2D(u_texture, v_texCoord).r;
     vec2 ramp_pos = vec2(
        fract(16.0 * (1.0 - intensity)),
        floor(16.0 * (1.0 - intensity)) / 16.0);
    // vec4 color = texture2D(u_colorTexture,vec2(0.5,1.0-intensity));
    vec4 color = texture2D(u_colorTexture,ramp_pos);
    gl_FragColor = color;
    gl_FragColor.a = color.a * smoothstep(0.,0.01,intensity) * u_opacity;

}
