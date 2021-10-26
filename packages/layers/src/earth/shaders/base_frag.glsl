
uniform sampler2D u_texture;

varying vec2 v_texCoord;
varying float v_lightWeight;


void main() {

    vec4 color = texture2D(u_texture,vec2(v_texCoord.x,v_texCoord.y));
    color.xyz = color.xyz * v_lightWeight;
    gl_FragColor = color;
}
