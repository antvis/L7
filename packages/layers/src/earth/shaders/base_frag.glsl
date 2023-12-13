uniform sampler2D u_texture;

in vec2 v_texCoord;
in float v_lightWeight;
out vec4 outputColor;

void main() {
    vec4 color = texture(SAMPLER_2D(u_texture),vec2(v_texCoord.x,v_texCoord.y));
    color.xyz = color.xyz * v_lightWeight;
    outputColor = color;
}
