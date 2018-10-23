precision mediump float;
uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;
uniform vec2 u_wind_min;
uniform vec2 u_wind_max;
varying float v_time;
varying vec2 v_texCoord;

void main() {
  vec2 velocity = mix(u_wind_min, u_wind_max, texture2D(u_texture, v_texCoord).rg);
  float speed_t = length(velocity) / length(u_wind_max);
  vec2 ramp_pos = vec2(
        fract(16.0 * speed_t),
        floor(16.0 * speed_t) / 16.0);
  gl_FragColor = texture2D(u_colorTexture, ramp_pos);
 
}