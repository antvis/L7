uniform float u_blur : 0;
uniform float u_opacity : 1;
uniform float u_stroke_width : 1;
uniform vec4 u_stroke_color : [0, 0, 0, 0];
uniform float u_stroke_opacity : 1;

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;

#pragma include "sdf_2d"
#pragma include "picking"

void main() {
  int shape = int(floor(v_data.w + 0.5));

  lowp float antialiasblur = v_data.z;
  float antialiased_blur = -max(u_blur, antialiasblur);
  float r = v_radius / (v_radius + u_stroke_width);

  float outer_df;
  float inner_df;
  // 'circle', 'triangle', 'square', 'pentagon', 'hexagon', 'octogon', 'hexagram', 'rhombus', 'vesica'
  if (shape == 0) {
    outer_df = sdCircle(v_data.xy, 1.0);
    inner_df = sdCircle(v_data.xy, r);
  } else if (shape == 1) {
    outer_df = sdEquilateralTriangle(1.1 * v_data.xy);
    inner_df = sdEquilateralTriangle(1.1 / r * v_data.xy);
  } else if (shape == 2) {
    outer_df = sdBox(v_data.xy, vec2(1.));
    inner_df = sdBox(v_data.xy, vec2(r));
  } else if (shape == 3) {
    outer_df = sdPentagon(v_data.xy, 0.8);
    inner_df = sdPentagon(v_data.xy, r * 0.8);
  } else if (shape == 4) {
    outer_df = sdHexagon(v_data.xy, 0.8);
    inner_df = sdHexagon(v_data.xy, r * 0.8);
  } else if (shape == 5) {
    outer_df = sdOctogon(v_data.xy, 1.0);
    inner_df = sdOctogon(v_data.xy, r);
  } else if (shape == 6) {
    outer_df = sdHexagram(v_data.xy, 0.52);
    inner_df = sdHexagram(v_data.xy, r * 0.52);
  } else if (shape == 7) {
    outer_df = sdRhombus(v_data.xy, vec2(1.0));
    inner_df = sdRhombus(v_data.xy, vec2(r));
  } else if (shape == 8) {
    outer_df = sdVesica(v_data.xy, 1.1, 0.8);
    inner_df = sdVesica(v_data.xy, r * 1.1, r * 0.8);
  }

  float opacity_t = smoothstep(0.0, antialiased_blur, outer_df);
  if(u_stroke_width <0.01 ) {
     gl_FragColor = v_color * opacity_t;
     return;
  }
  float color_t = u_stroke_width < 0.01 ? 0.0 : smoothstep(
    antialiased_blur,
    0.0,
    inner_df
  );
  vec4 strokeColor = u_stroke_color == vec4(0) ? v_color : u_stroke_color;

  gl_FragColor = opacity_t * mix(vec4(v_color.rgb, v_color.a * u_opacity), strokeColor * u_stroke_opacity, color_t);

  gl_FragColor = filterColor(gl_FragColor);
}
