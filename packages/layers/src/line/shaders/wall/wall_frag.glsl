#define Animate 0.0
#define LineTexture 1.0

// line texture

uniform sampler2D u_texture;
layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float u_icon_step: 100;
  float u_heightfixed;
  float u_linearColor: 0;
  float u_line_texture;
  float u_textureBlend;
  float u_iconStepCount;
  float u_time;
};


in vec2 v_iconMapUV;
in vec4 v_color;
in float v_blur;
in vec4 v_dataset;

out vec4 outputColor;

#pragma include "picking"

void main() {
  float animateSpeed = 0.0; // 运动速度
  float d_distance_ratio = v_dataset.r; // 当前点位距离占线总长的比例
  float v = v_dataset.a;

  if(u_linearColor == 1.0) { // 使用渐变颜色
    outputColor = mix(u_sourceColor, u_targetColor, v);
  } else { // 使用 color 方法传入的颜色
     outputColor = v_color;
  }

  outputColor.a *= v_color.a; // 全局透明度
  if(u_animate.x == Animate) {
      animateSpeed = u_time / u_animate.y;
       float alpha =1.0 - fract( mod(1.0- d_distance_ratio, u_animate.z)* (1.0/ u_animate.z) + animateSpeed);
      alpha = (alpha + u_animate.w -1.0) / u_animate.w;
      alpha = smoothstep(0., 1., alpha);
      outputColor.a *= alpha;
  }

  if(u_line_texture == LineTexture) { // while load texture
    float aDistance = v_dataset.g;      // 当前顶点的距离
    float d_texPixelLen = v_dataset.b;  // 贴图的像素长度，根据地图层级缩放
    float u = fract(mod(aDistance, d_texPixelLen)/d_texPixelLen - animateSpeed);
    float v = v_dataset.a;  // 线图层贴图部分的 v 坐标值

    // 计算纹理间隔 start
    float flag = 0.0;
    if(u > 1.0/u_iconStepCount) {
      flag = 1.0;
    }
    u = fract(u*u_iconStepCount);
    // 计算纹理间隔 end

    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;
    vec4 pattern = texture(SAMPLER_2D(u_texture), uv);

    // Tip: 判断纹理间隔
    if(flag > 0.0) {
      pattern = vec4(0.0);
    }

    if(u_textureBlend == 0.0) { // normal
      pattern.a = 0.0;
      outputColor = filterColor(outputColor + pattern);
    } else { // replace
        pattern.a *= v_color.a;
        if(outputColor.a <= 0.0) {
          pattern.a = 0.0;
        }
        outputColor = filterColor(pattern);
    }
  }


  // blur - AA
  if(v < v_blur) {
    outputColor.a = mix(0.0, outputColor.a, v/v_blur);
  } else if(v > 1.0 - v_blur) {
    outputColor.a = mix(outputColor.a, 0.0, (v - (1.0 - v_blur))/v_blur);
  }

  outputColor = filterColor(outputColor);
}
