precision mediump float;
uniform float u_opacity: 1.0;
uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;
uniform float u_min;
uniform float u_max;
varying vec2 v_texCoord;

void main() {

  float value = texture2D(u_texture,vec2(v_texCoord.x,v_texCoord.y)).a;
   value = clamp(value,u_min,u_max);
  float value1 =  (value - u_min) / (u_max -u_min);
  vec2 ramp_pos = vec2(
        fract(16.0 * (1.0 - value1)),
        floor(16.0 * (1.0 - value1)) / 16.0);
  gl_FragColor =  texture2D(u_colorTexture,ramp_pos);;
}
