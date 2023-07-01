
uniform float u_additive;


varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;
uniform float u_time;
uniform vec4 u_animate: [ 1., 2., 1.0, 0.2 ];

#pragma include "sdf_2d"
#pragma include "picking"

void main() {

  lowp float antialiasblur = v_data.z;
  float r = v_radius / (v_radius);

  float outer_df;
  float inner_df;
  // 'circle', 'triangle', 'square', 'pentagon', 'hexagon', 'octogon', 'hexagram', 'rhombus', 'vesica'
  
  outer_df = sdCircle(v_data.xy, 1.0);
  inner_df = sdCircle(v_data.xy, r);


  float opacity_t = smoothstep(0.0, antialiasblur, outer_df);

  float color_t = smoothstep(
    antialiasblur,
    0.0,
    inner_df
  );
  float PI = 3.14159;
  float N_RINGS = 3.0;
  float FREQ = 1.0;

  gl_FragColor = v_color;

  float d = length(v_data.xy);
  if(d > 0.5) {
    discard;
  }
  float intensity = clamp(cos(d * PI), 0.0, 1.0) * clamp(cos(2.0 * PI * (d * 2.0 * u_animate.z - u_animate.y * u_time)), 0.0, 1.0);
  
  // 根据叠加模式选择效果
  if(u_additive > 0.0) {
    gl_FragColor *= intensity;
    // 优化水波点 blend additive 模式下有的拾取效果 
    gl_FragColor = filterColorAlpha(gl_FragColor, gl_FragColor.a);
  } else {
    gl_FragColor = vec4(gl_FragColor.xyz, gl_FragColor.a * intensity);
    gl_FragColor = filterColor(gl_FragColor);
  }
}
