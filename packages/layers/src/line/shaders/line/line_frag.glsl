// #extension GL_OES_standard_derivatives : enable
#define Animate 0.0
#define LineTexture 1.0

uniform sampler2D u_texture;
layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_dash_array;
  vec4 u_blur;
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float u_icon_step: 100;
  float u_heightfixed: 0.0;
  float u_vertexScale: 1.0;
  float u_raisingHeight: 0.0;
  float u_strokeWidth: 0.0;
  float u_textureBlend;
  float u_line_texture;
  float u_linearDir: 1.0;
  float u_linearColor: 0;
  float u_time;
  float u_arrow: 0.0;
  float u_arrow_spacing: 20.0;
  float u_arrow_width: 1.0;
  float u_arrow_height: 1.0;
  float u_arrow_strokeWidth: 2.0;
};

in vec4 v_color;
in vec4 v_stroke;
// dash
in vec4 v_dash_array;
in float v_d_distance_ratio;
in vec2 v_iconMapUV;
in vec4 v_texture_data;

out vec4 outputColor;
#pragma include "picking"
#pragma include "projection"

// [animate, duration, interval, trailLength],
void main() {
  if(u_dash_array!=vec4(0.0)){
    float dashLength = mod(v_d_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
    if(!(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z))) {
      // 虚线部分
      discard;
    };
  }
  float animateSpeed = 0.0; // 运动速度
  float d_distance_ratio = v_texture_data.r; // 当前点位距离占线总长的比例
  if(u_linearDir < 1.0) {
    d_distance_ratio = v_texture_data.a;
  }
  if(u_linearColor == 1.0) { // 使用渐变颜色
    outputColor = mix(u_sourceColor, u_targetColor, d_distance_ratio);
    outputColor.a *= v_color.a;
  } else { // 使用 color 方法传入的颜色
     outputColor = v_color;
  }
  // anti-alias
  // float blur = 1.0 - smoothstep(u_blur, 1., length(v_normal.xy));
  if(u_animate.x == Animate) {
      animateSpeed = u_time / u_animate.y;
       float alpha =1.0 - fract( mod(1.0- d_distance_ratio, u_animate.z)* (1.0/ u_animate.z) + animateSpeed);
      alpha = (alpha + u_animate.w -1.0) / u_animate.w;
      alpha = smoothstep(0., 1., alpha);
      outputColor.a *= alpha;
  }

  if(u_line_texture == LineTexture) { // while load texture
    float aDistance = v_texture_data.g;      // 当前顶点的距离
    float d_texPixelLen = v_texture_data.b;  // 贴图的像素长度，根据地图层级缩放
    float u = fract(mod(aDistance, d_texPixelLen)/d_texPixelLen - animateSpeed);
    float v = v_texture_data.a;  // 线图层贴图部分的 v 坐标值

    // v = max(smoothstep(0.95, 1.0, v), v);
    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;
     vec4 pattern = texture(SAMPLER_2D(u_texture), uv);

    if(u_textureBlend == 0.0) { // normal
      pattern.a = 0.0;
      outputColor += pattern;
    } else { // replace
        pattern.a *= v_color.a;
        if(outputColor.a <= 0.0) {
          pattern.a = 0.0;
        }
        outputColor = pattern;
    }
  } 

  float v = v_texture_data.a;
  float strokeWidth = min(0.5, u_strokeWidth);
  // 绘制 border
  if(strokeWidth > 0.01) {
    float borderOuterWidth = strokeWidth / 2.0;


    if(v >= 1.0 - strokeWidth || v <= strokeWidth) {
      if(v > strokeWidth) { // 外侧
        float linear = smoothstep(0.0, 1.0, (v - (1.0 - strokeWidth))/strokeWidth);
        //  float linear = step(0.0, (v - (1.0 - borderWidth))/borderWidth);
        outputColor.rgb = mix(outputColor.rgb, v_stroke.rgb, linear);
      } else if(v <= strokeWidth) {
        float linear = smoothstep(0.0, 1.0, v/strokeWidth);
        outputColor.rgb = mix(v_stroke.rgb, outputColor.rgb, linear);
      }
    }

    if(v < borderOuterWidth) {
      outputColor.a = mix(0.0, outputColor.a, v/borderOuterWidth);
    } else if(v > 1.0 - borderOuterWidth) {
      outputColor.a = mix(outputColor.a, 0.0, (v - (1.0 - borderOuterWidth))/borderOuterWidth);
    }
  }

  // blur
  float blurV = v_texture_data.a;
  if(blurV < 0.5) {
    outputColor.a *= mix(u_blur.r, u_blur.g, blurV/0.5);
  } else {
    outputColor.a *= mix(u_blur.g, u_blur.b, (blurV - 0.5)/0.5);
  }
  
  // 绘制箭头
  if(u_arrow > 0.0) {
    // 使用地理距离来计算箭头分布
    float lineDistance = v_texture_data.g;
    float texV = v_texture_data.a; // [0, 1]
    
    // 计算像素到地理单位的转换系数 (从 zoom level 推导)
    float pixelToGeo = pow(2.0, 20.0 - u_Zoom);
    
    // 箭头参数 (将像素转换为地理单位)
    float spacing = u_arrow_spacing * pixelToGeo;
    float arrowLength = u_arrow_height * pixelToGeo;
    float arrowWidthPx = u_arrow_width;
    
    // 当前距离在周期内的位置
    float distInCycle = mod(lineDistance, spacing);
    
    // 如果在箭头长度范围内
    if(distInCycle < arrowLength) {
      // 归一化 U 坐标 [0, 1] (从箭头尾部到头部)
      float u = distInCycle / arrowLength;
      
      // 计算当前像素偏离中心的距离
      // texV 在 [0, 1] 范围,中心是 0.5
      // 我们需要将其转换为像素偏移
      // 方法: 利用箭头宽度作为参考
      // 假设箭头宽度对应 texV 的某个范围
      float vOffset = (texV - 0.5) * 2.0; // 归一化到 [-1, 1]
      
      // 箭头形状计算: > 形
      // 宽度随 u 线性减小: u=0 -> width=max, u=1 -> width=0
      float halfWidthAtU = (1.0 - u) * 0.5; // [0, 0.5]
      
      // 箭头线条粗细 (归一化单位,相对于箭头宽度)
      float strokeWidth = u_arrow_strokeWidth / arrowWidthPx;
      
      // 判断是否在箭头线条上
      float distToEdge = abs(abs(vOffset) - halfWidthAtU);
      
      // 使用 smoothstep 进行抗锯齿
      float alpha = smoothstep(strokeWidth * 0.5 + 0.01, strokeWidth * 0.5 - 0.01, distToEdge);
      
      if(alpha > 0.0) {
         // 混合箭头颜色 (白色)
         vec4 arrowColor = vec4(1.0, 1.0, 1.0, 1.0);
         outputColor = mix(outputColor, arrowColor, alpha);
      }
    }
  }
  
  outputColor = filterColor(outputColor);
}
