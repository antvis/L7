uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;
uniform float u_opacity;
varying vec2 v_texCoord;
varying float v_intensity;

void main(){
   
     float intensity = texture2D(u_texture, v_texCoord).r;
    vec4 color = texture2D(u_colorTexture,vec2(intensity, 0));
    gl_FragColor = color;
    // gl_FragColor.a = color.a * smoothstep(0.1,0.2,intensity)* u_opacity;
     gl_FragColor.a = color.a * smoothstep(0.,0.1,intensity) * u_opacity;
}
