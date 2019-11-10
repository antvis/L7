uniform float u_opacity : 1.0;
uniform float u_MixRatio : 0.5;

uniform sampler2D u_Diffuse1;
uniform sampler2D u_Diffuse2;

varying vec2 v_UV;

void main() {
  vec4 texel1 = texture2D(u_Diffuse1, v_UV);
  vec4 texel2 = texture2D(u_Diffuse2, v_UV);
  gl_FragColor = u_opacity * mix(texel1, texel2, u_MixRatio);
}
