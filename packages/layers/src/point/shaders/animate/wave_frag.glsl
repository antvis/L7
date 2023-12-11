
layout(std140) uniform commonUniforms {
  vec3 u_blur_height_fixed;
  float u_stroke_width;
  float u_additive;
  float u_stroke_opacity;
  float u_size_unit;
  float u_time;
   vec4 u_animate;   
};


in vec4 v_data;
in vec4 v_color;
in float v_radius;

#pragma include "sdf_2d"
#pragma include "picking"
out vec4 outputColor;
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

  outputColor = v_color;

  float d = length(v_data.xy);
  if(d > 0.5) {
    discard;
  }
  float intensity = clamp(cos(d * PI), 0.0, 1.0) * clamp(cos(2.0 * PI * (d * 2.0 * u_animate.z - u_animate.y * u_time)), 0.0, 1.0);
  
  // 根据叠加模式选择效果
  if(u_additive > 0.0) {
    outputColor *= intensity;
  } else {
    outputColor = vec4(outputColor.xyz, outputColor.a * intensity);
  }
  outputColor = filterColor(outputColor);
}
