#extension GL_OES_standard_derivatives : enable
#define Animate 0.0
#define LineTexture 1.0
uniform float u_textureBlend;

uniform float u_strokeWidth: 0.0;

uniform vec3 u_blur;
varying vec4 v_color;
varying vec4 v_stroke;

// line texture
uniform float u_line_texture;
uniform sampler2D u_texture;
uniform vec2 u_textSize;
varying vec2 v_iconMapUV;
varying vec4 v_texture_data;


#pragma include "picking"

uniform float u_time;
uniform vec4 u_animate: [ 1, 2., 1.0, 0.2 ]; // 控制运动
// [animate, duration, interval, trailLength],
void main() {
  float animateSpeed = 0.0; // 运动速度
  float d_distance_ratio = v_texture_data.r; // 当前点位距离占线总长的比例
  gl_FragColor = v_color;
  // anti-alias
  // float blur = 1.0 - smoothstep(u_blur, 1., length(v_normal.xy));
  if(u_animate.x == Animate) {
      animateSpeed = u_time / u_animate.y;
       float alpha =1.0 - fract( mod(1.0- d_distance_ratio, u_animate.z)* (1.0/ u_animate.z) + animateSpeed);
      alpha = (alpha + u_animate.w -1.0) / u_animate.w;
      alpha = smoothstep(0., 1., alpha);
      gl_FragColor.a *= alpha;
  }

  if(u_line_texture == LineTexture) { // while load texture
    float aDistance = v_texture_data.g;      // 当前顶点的距离
    float d_texPixelLen = v_texture_data.b;  // 贴图的像素长度，根据地图层级缩放
    float u = fract(mod(aDistance, d_texPixelLen)/d_texPixelLen - animateSpeed);
    float v = v_texture_data.a;  // 线图层贴图部分的 v 坐标值

    // v = max(smoothstep(0.95, 1.0, v), v);
    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;
     vec4 pattern = texture2D(u_texture, uv);

    if(u_textureBlend == 0.0) { // normal
      pattern.a = 0.0;
      gl_FragColor += pattern;
    } else { // replace
        pattern.a *= v_color.a;
        if(gl_FragColor.a <= 0.0) {
          pattern.a = 0.0;
        }
        gl_FragColor = pattern;
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
        gl_FragColor.rgb = mix(gl_FragColor.rgb, v_stroke.rgb, linear);
      } else if(v <= strokeWidth) {
        float linear = smoothstep(0.0, 1.0, v/strokeWidth);
        gl_FragColor.rgb = mix(v_stroke.rgb, gl_FragColor.rgb, linear);
      }
    }

    if(v < borderOuterWidth) {
      gl_FragColor.a = mix(0.0, gl_FragColor.a, v/borderOuterWidth);
    } else if(v > 1.0 - borderOuterWidth) {
      gl_FragColor.a = mix(gl_FragColor.a, 0.0, (v - (1.0 - borderOuterWidth))/borderOuterWidth);
    }
  }

  // blur
  float blurV = v_texture_data.a;
  if(blurV < 0.5) {
    gl_FragColor.a *= mix(u_blur.r, u_blur.g, blurV/0.5);
  } else {
    gl_FragColor.a *= mix(u_blur.g, u_blur.b, (blurV - 0.5)/0.5);
  }
  
  gl_FragColor = filterColor(gl_FragColor);
}
