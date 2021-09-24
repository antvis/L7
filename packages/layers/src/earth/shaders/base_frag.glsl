
uniform sampler2D u_texture;

varying vec4 v_color;
varying vec2 v_texCoord;



void main() {

    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // vec4 color = vec4(v_texCoord, 0.0, 1.0);
    vec4 color = texture2D(u_texture,vec2(v_texCoord.x,v_texCoord.y));
    gl_FragColor = color;
}
