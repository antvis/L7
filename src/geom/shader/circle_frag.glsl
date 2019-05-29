uniform float u_blur : 0;
uniform float u_opacity : 1;
uniform float u_stroke_width : 1;
uniform vec4 u_stroke_color : [1, 1, 1, 1];
uniform float u_stroke_opacity : 1;

varying vec3 v_data;
varying vec4 v_color;
varying float v_radius;

void main() {
  float extrude_length = length(v_data.xy);

  lowp float antialiasblur = v_data.z;
  float antialiased_blur = -max(u_blur, antialiasblur);

  float opacity_t = smoothstep(0.0, antialiased_blur, extrude_length - 1.0);

  float color_t = u_stroke_width < 0.01 ? 0.0 : smoothstep(
    antialiased_blur,
    0.0,
    extrude_length - v_radius / (v_radius + u_stroke_width)
  );

  gl_FragColor = opacity_t * mix(v_color * u_opacity, u_stroke_color * u_stroke_opacity, color_t);
}