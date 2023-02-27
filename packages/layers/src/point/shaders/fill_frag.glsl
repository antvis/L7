uniform float u_additive;

varying mat4 styleMappingMat; // 传递从片元中传递的映射数据

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;

#pragma include "sdf_2d"
#pragma include "picking"


void main() {
  int shape = int(floor(v_data.w + 0.5));

  vec4 textrueStroke = vec4(
    styleMappingMat[1][0],
    styleMappingMat[1][1],
    styleMappingMat[1][2],
    styleMappingMat[1][3]
  );

  float opacity = styleMappingMat[0][0];
  float stroke_opacity = styleMappingMat[0][1];
  float strokeWidth = styleMappingMat[0][2];
  vec4 strokeColor = textrueStroke == vec4(0) ? v_color : textrueStroke;

  lowp float antialiasblur = v_data.z;
  float r = v_radius / (v_radius + strokeWidth);

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

  float opacity_t = smoothstep(0.0, antialiasblur, outer_df);

  float color_t = strokeWidth < 0.01 ? 0.0 : smoothstep(
    antialiasblur,
    0.0,
    inner_df
  );

  if(strokeWidth < 0.01) {
    gl_FragColor = vec4(v_color.rgb, v_color.a * opacity);
  } else {
    gl_FragColor = mix(vec4(v_color.rgb, v_color.a * opacity), strokeColor * stroke_opacity, color_t);
  }

  if(u_additive > 0.0) {
    gl_FragColor *= opacity_t;
    gl_FragColor = filterColorAlpha(gl_FragColor, gl_FragColor.a);
  } else {
    gl_FragColor.a *= opacity_t;
    gl_FragColor = filterColor(gl_FragColor);
  }
   // 作为 mask 模板时需要丢弃透明的像素
  if(gl_FragColor.a < 0.01) {
    discard;
  } 
}
