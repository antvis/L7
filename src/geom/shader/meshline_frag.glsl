precision highp float;

uniform float u_opacity : 1.0;
uniform float u_dash_offset : 0.0;
uniform float u_dash_ratio : 0.0;
uniform float u_blur : 0.9;

varying vec4 v_color;
#ifdef DASHLINE
varying float v_distance_ratio;
#endif
varying float v_dash_array;
varying float v_time;
varying vec2 v_normal;

#ifdef TEXTURE
uniform sampler2D u_texture;
varying vec2 v_uv;
varying float v_texture_y;
varying float v_texture_percent;
#endif

void main() {
  #ifdef TEXTURE
    float texture_y_fract = fract(v_texture_y);
    if (texture_y_fract <= v_texture_percent) {
      vec4 tex_color = texture2D(u_texture, vec2(v_uv.x, 1.0 - 0.125 - v_uv.y + (texture_y_fract / v_texture_percent) * 0.125));
      // tex_color = texture2D(u_texture, vec2(v_uv.x, v_uv.y));
      gl_FragColor = vec4(mix(v_color.rgb, tex_color.rgb, tex_color.a), v_color.a);
    } else {
    gl_FragColor = v_color;
    }
  #else
    gl_FragColor = v_color;
  #endif

  #ifdef DASHLINE
    gl_FragColor.a *= u_opacity * ceil(mod(v_distance_ratio + u_dash_offset, v_dash_array) - (v_dash_array * u_dash_ratio));
  #else
    gl_FragColor.a *= u_opacity;
  #endif
  #ifdef ANIMATE 
    gl_FragColor.a *= v_time;
  #endif
  // anti-alias
  float blur = 1. - smoothstep(u_blur, 1., length(v_normal));
  gl_FragColor.a *= blur;
}
