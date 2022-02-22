#define Animate 0.0
#define LineTexture 1.0
uniform float u_blur : 0.99;
uniform float u_opacity : 1.0;
uniform float u_textureBlend;

uniform float u_borderWidth: 0.0;
uniform vec4 u_borderColor;
varying vec4 v_color;

// line texture
uniform float u_line_texture;
uniform sampler2D u_texture;
uniform vec2 u_textSize;

varying vec2 v_iconMapUV;

#pragma include "picking"

uniform float u_time;
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ]; // 控制运动

varying mat4 styleMappingMat;
// [animate, duration, interval, trailLength],
void main() {
  float opacity = styleMappingMat[0][0];
  float animateSpeed = 0.0; // 运动速度
  float d_distance_ratio = styleMappingMat[3].r; // 当前点位距离占线总长的比例
  gl_FragColor = v_color;
  // anti-alias
  // float blur = 1.0 - smoothstep(u_blur, 1., length(v_normal.xy));
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

    // v = max(smoothstep(0.95, 1.0, v), v);
    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;
    
    // gl_FragColor = filterColor(gl_FragColor + texture2D(u_texture, vec2(u, v)));
    // gl_FragColor = filterColor(gl_FragColor + texture2D(u_texture, uv));
     vec4 pattern = texture2D(u_texture, uv);

    if(u_textureBlend == 0.0) { // normal
      pattern.a = 0.0;
      gl_FragColor += pattern;
    } else { // replace
        pattern.a *= opacity;
        if(gl_FragColor.a <= 0.0) {
          pattern.a = 0.0;
        }
        gl_FragColor = pattern;
    }
  } 

  float v = styleMappingMat[3].a;
  float borderWidth = min(0.5, u_borderWidth);
  // 绘制 border
  if(borderWidth > 0.01) {
    float borderOuterWidth = borderWidth/2.0;

    if(v >= 1.0 - borderWidth || v <= borderWidth) {
      if(v > borderWidth) {
        float linear = smoothstep(0.0, 1.0, (v - (1.0 - borderWidth))/borderWidth);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, u_borderColor.rgb, linear);
      } else if(v <= borderWidth) {
        float linear = smoothstep(0.0, 1.0, v/borderWidth);
        gl_FragColor.rgb = mix(u_borderColor.rgb, gl_FragColor.rgb, linear);
      }
    }

    if(v < borderOuterWidth) {
      gl_FragColor.a = mix(0.0, gl_FragColor.a, v/borderOuterWidth);
    } else if(v > 1.0 - borderOuterWidth) {
      gl_FragColor.a = mix(gl_FragColor.a, 0.0, (v - (1.0 - borderOuterWidth))/borderOuterWidth);
    }
  }

  gl_FragColor = filterColor(gl_FragColor);
}
