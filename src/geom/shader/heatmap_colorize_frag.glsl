uniform sampler2D u_texture;
uniform sampler2D u_colorRamp;
varying vec2 v_uv;

void main(){
    float intensity = texture2D(u_texture,v_uv).r;
    vec4 color = texture2D(u_colorRamp,vec2(0.5,1.0-intensity));
    gl_FragColor = color * intensity;
}