#define LineTypeSolid 0.0
#define Animate 0.0
#define LineTexture 1.0

uniform float u_opacity : 1.0;
uniform float u_textureBlend;
uniform float u_iconStepCount;

varying vec4 v_color;

// line texture
uniform float u_line_texture;
uniform sampler2D u_texture;
uniform vec2 u_textSize;

// dash
uniform float u_dash_offset : 0.0;
uniform float u_dash_ratio : 0.1;

varying vec2 v_iconMapUV;
varying float v_blur;

uniform float u_linearColor: 0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

#pragma include "picking"

uniform float u_time;
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ]; // 控制运动

varying mat4 styleMappingMat;
// [animate, duration, interval, trailLength],
void main() {
  float opacity = styleMappingMat[0][0];
  float animateSpeed = 0.0; // 运动速度
  float d_distance_ratio = styleMappingMat[3].r; // 当前点位距离占线总长的比例
  float v = styleMappingMat[3].a;

  if(u_linearColor == 1.0) { // 使用渐变颜色
    gl_FragColor = mix(u_sourceColor, u_targetColor, v);
  } else { // 使用 color 方法传入的颜色
     gl_FragColor = v_color;
  }

  gl_FragColor.a *= opacity; // 全局透明度
  if(u_aimate.x == Animate) {
      animateSpeed = u_time / u_aimate.y;
       float alpha =1.0 - fract( mod(1.0- d_distance_ratio, u_aimate.z)* (1.0/ u_aimate.z) + animateSpeed);
      alpha = (alpha + u_aimate.w -1.0) / u_aimate.w;
      alpha = smoothstep(0., 1., alpha);
      gl_FragColor.a *= alpha;
  }

  if(u_line_texture == LineTexture) { // while load texture
    float aDistance = styleMappingMat[3].g;      // 当前顶点的距离
    float d_texPixelLen = styleMappingMat[3].b;  // 贴图的像素长度，根据地图层级缩放
    float u = fract(mod(aDistance, d_texPixelLen)/d_texPixelLen - animateSpeed);
    float v = styleMappingMat[3].a;  // 线图层贴图部分的 v 坐标值

    // 计算纹理间隔 start
    float flag = 0.0;
    if(u > 1.0/u_iconStepCount) {
      flag = 1.0;
    }
    u = fract(u*u_iconStepCount);
    // 计算纹理间隔 end

    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;
    vec4 pattern = texture2D(u_texture, uv);

    // Tip: 判断纹理间隔
    if(flag > 0.0) {
      pattern = vec4(0.0);
    }

    if(u_textureBlend == 0.0) { // normal
      pattern.a = 0.0;
      gl_FragColor = filterColor(gl_FragColor + pattern);
    } else { // replace
        pattern.a *= opacity;
        if(gl_FragColor.a <= 0.0) {
          pattern.a = 0.0;
        }
        gl_FragColor = filterColor(pattern);
    }
  }
  

  // blur - AA
  if(v < v_blur) {
    gl_FragColor.a = mix(0.0, gl_FragColor.a, v/v_blur);
  } else if(v > 1.0 - v_blur) {
    gl_FragColor.a = mix(gl_FragColor.a, 0.0, (v - (1.0 - v_blur))/v_blur);
  }

  gl_FragColor = filterColor(gl_FragColor);

    
  
  
}
