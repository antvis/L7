uniform sampler2D u_texture;
uniform sampler2D u_colorRamp;
  uniform float u_opacity;
varying vec2 v_uv;

void main(){
    float intensity = texture2D(u_texture,v_uv).r;
    vec4 color = texture2D(u_colorRamp,vec2(0.5,1.0-intensity));
    gl_FragColor = color;
    gl_FragColor.a = color.a * smoothstep(0.,0.05,intensity) * u_opacity;
    
}