uniform float u_blur : 0;
uniform float u_opacity : 1;
uniform float u_strokeWidth : 1;
uniform vec4 u_stroke : [1, 1, 1, 1];
uniform float u_strokeOpacity : 1;

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;

 #pragma include "sdf_2d"

void main() {
  // int shape = int(floor(v_data.w + 0.5));
   int shape = int(v_data.w);

  lowp float antialiasblur = v_data.z;
  float antialiased_blur = -max(u_blur, antialiasblur);
  float r = v_radius / (v_radius + u_strokeWidth);

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

  float color_t = u_strokeWidth < 0.01 ? 0.0 : smoothstep(
    antialiased_blur,
    0.0,
    inner_df
  );
  gl_FragColor = opacity_t * mix(v_color * u_opacity, u_stroke * u_strokeOpacity * v_color.a, color_t);
  #pragma include "pick"
}
