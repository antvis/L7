
#define Animate 0.0
#define LineTexture 1.0

uniform float u_opacity;
uniform float u_textureBlend;
uniform float u_blur : 0.9;
uniform float u_line_type: 0.0;
// varying vec2 v_normal;
varying vec4 v_dash_array;
varying vec4 v_color;

uniform float u_time;
uniform vec4 u_animate: [ 1., 2., 1.0, 0.2 ];

uniform float u_line_texture;
uniform sampler2D u_texture;
uniform vec2 u_textSize;

uniform float segmentNumber;
varying vec2 v_iconMapUV;

varying mat4 styleMappingMat; // 传递从片元中传递的映射数据

#pragma include "picking"

void main() {
  float opacity = styleMappingMat[0][0];
  float animateSpeed = 0.0; // 运动速度
  float d_segmentIndex = styleMappingMat[3].r;   // 当前顶点在弧线中所处的分段位置
  float d_distance_ratio = styleMappingMat[3].b; // 当前顶点在弧线中所处的分段比例

  gl_FragColor = v_color;
  
  gl_FragColor.a *= opacity;

  if(u_animate.x == Animate && u_line_texture != LineTexture) {
      animateSpeed = u_time / u_animate.y;
      float alpha =1.0 - fract( mod(1.0- d_distance_ratio, u_animate.z)* (1.0/ u_animate.z) + u_time / u_animate.y);
      alpha = (alpha + u_animate.w -1.0) / u_animate.w;
      // alpha = smoothstep(0., 1., alpha);
      alpha = clamp(alpha, 0.0, 1.0);
      gl_FragColor.a *= alpha;
  }

  // 当存在贴图时在底色上贴上贴图
  if(u_line_texture == LineTexture) { // while load texture
    float arcRadio = smoothstep( 0.0, 1.0, (d_segmentIndex / segmentNumber));
    // float arcRadio = smoothstep( 0.0, 1.0, d_distance_ratio);

    float count = styleMappingMat[3].g; // 贴图在弧线上重复的数量

    float time = 0.0;
    if(u_animate.x == Animate) {
      time = u_time / u_animate.y;
    }
    float redioCount = arcRadio * count;

    float u = fract(redioCount - time);
    float v = styleMappingMat[3].a; // 横向 v
    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;

    vec4 pattern = texture2D(u_texture, uv);

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
      gl_FragColor = filterColor(gl_FragColor + pattern);
    } else { // replace
        pattern.a *= opacity;
        if(gl_FragColor.a <= 0.0) {
          pattern.a = 0.0;
        }
        gl_FragColor = filterColor(pattern);
    }
    
  } else {
     gl_FragColor = filterColor(gl_FragColor);
  }
}