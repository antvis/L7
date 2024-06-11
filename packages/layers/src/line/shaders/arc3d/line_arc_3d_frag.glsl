#define LineTypeSolid 0.0
#define LineTypeDash 1.0
#define Animate 0.0
#define LineTexture 1.0

uniform sampler2D u_texture;

layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_dash_array: [10.0, 5., 0, 0];
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float u_globel;
  float u_globel_radius;
  float u_global_height: 10;
  float segmentNumber;
  float u_line_type: 0.0;
  float u_icon_step: 100;
  float u_line_texture: 0.0;
  float u_textureBlend;
  float u_time;
  float u_linearColor: 0.0;
};

in vec4 v_color;
in vec4 v_dash_array;
in float v_segmentIndex;
in vec2 v_iconMapUV;
in vec4 v_line_data;

out vec4 outputColor;

#pragma include "picking"

void main() {
  float animateSpeed = 0.0; // 运动速度
  float d_distance_ratio = v_line_data.g; // 当前点位距离占线总长的比例
  outputColor = v_color;

  if(u_line_type == LineTypeDash) {
    float flag = 0.;
    float dashLength = mod(d_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
    if(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z)) {
      flag = 1.;
    }
    outputColor.a *=flag;
  }

  if(u_animate.x == Animate && u_line_texture != LineTexture) {
      animateSpeed = u_time / u_animate.y;
      float alpha =1.0 - fract( mod(1.0- d_distance_ratio, u_animate.z)* (1.0/ u_animate.z) + u_time / u_animate.y);

      alpha = (alpha + u_animate.w -1.0) / u_animate.w;
      // alpha = smoothstep(0., 1., alpha);
      alpha = clamp(alpha, 0.0, 1.0);
      outputColor.a *= alpha;

      // u_animate
      // x enable
      // y duration
      // z interval
      // w trailLength
  }

  if(u_line_texture == LineTexture && u_line_type != LineTypeDash) { // while load texture
    // float arcRadio = smoothstep( 0.0, 1.0, (v_segmentIndex / segmentNumber));
    float arcRadio = v_segmentIndex / (segmentNumber - 1.0);
    float count = v_line_data.b; // // 贴图在弧线上重复的数量

    float time = 0.0;
    if(u_animate.x == Animate) {
      time = u_time / u_animate.y;
    }
    float redioCount = arcRadio * count;

    float u = fract(redioCount - time);

    float v = v_line_data.a;  // 线图层贴图部分的 v 坐标值
    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;
    vec4 pattern = texture(SAMPLER_2D(u_texture), uv);

    if(u_animate.x == Animate) {
      float currentPlane = floor(redioCount - time);
      float textureStep = floor(count * u_animate.z);
      float a = mod(currentPlane, textureStep);
      if(a < textureStep - 1.0) {
        pattern = vec4(0.0);
      }
    }

    if(u_textureBlend == 0.0) { // normal
      pattern.a = 0.0;
      outputColor = filterColor(outputColor + pattern);
    } else { // replace
        pattern.a *= v_color.a;
        if(outputColor.a <= 0.0) {
          pattern.a = 0.0;
          discard;
        } else {
          outputColor = filterColor(pattern);
        }
    }

  } else {
    outputColor = filterColor(outputColor);
  }
}
