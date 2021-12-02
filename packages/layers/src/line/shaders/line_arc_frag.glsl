#define LineTypeSolid 0.0
#define LineTypeDash 1.0
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
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ];

uniform float u_line_texture;
uniform sampler2D u_texture;
uniform vec2 u_textSize;

uniform float segmentNumber;
varying vec2 v_iconMapUV;

varying mat4 styleMappingMat; // 传递从片元中传递的映射数据

uniform float u_linearColor: 0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

#pragma include "picking"

void main() {
  float opacity = styleMappingMat[0][0];
  float animateSpeed = 0.0; // 运动速度
  float d_segmentIndex = styleMappingMat[3].r;   // 当前顶点在弧线中所处的分段位置
  float d_distance_ratio = styleMappingMat[3].b; // 当前顶点在弧线中所处的分段比例

  // 设置弧线的底色
  if(u_linearColor == 1.0) { // 使用渐变颜色
    gl_FragColor = mix(u_sourceColor, u_targetColor, d_segmentIndex/segmentNumber);
  } else { // 使用 color 方法传入的颜色
     gl_FragColor = v_color;
  }
  
  // float blur = 1.- smoothstep(u_blur, 1., length(v_normal.xy));
  // float blur = smoothstep(1.0, u_blur, length(v_normal.xy));
  gl_FragColor.a *= opacity;
  if(u_line_type == LineTypeDash) {
   float flag = 0.;
    float dashLength = mod(d_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
    if(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z)) {
      flag = 1.;
    }
    gl_FragColor.a *=flag;
  }

  if(u_aimate.x == Animate && u_line_texture != LineTexture) {
      animateSpeed = u_time / u_aimate.y;
      float alpha =1.0 - fract( mod(1.0- d_distance_ratio, u_aimate.z)* (1.0/ u_aimate.z) + u_time / u_aimate.y);
      alpha = (alpha + u_aimate.w -1.0) / u_aimate.w;
      // alpha = smoothstep(0., 1., alpha);
      alpha = clamp(alpha, 0.0, 1.0);
      gl_FragColor.a *= alpha;
  }

  // 当存在贴图时在底色上贴上贴图
  if(u_line_texture == LineTexture && u_line_type != LineTypeDash) { // while load texture
    float arcRadio = smoothstep( 0.0, 1.0, (d_segmentIndex / segmentNumber));
    // float arcRadio = smoothstep( 0.0, 1.0, d_distance_ratio);

    float count = styleMappingMat[3].g; // 贴图在弧线上重复的数量

    float time = 0.0;
    if(u_aimate.x == Animate) {
      time = u_time / u_aimate.y;
    }
    float redioCount = arcRadio * count;

    float u = fract(redioCount - time);
    float v = styleMappingMat[3].a; // 横向 v
    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;

    vec4 pattern = texture2D(u_texture, uv);

    if(u_aimate.x == Animate) {
      float currentPlane = floor(redioCount - time);
      float textureStep = floor(count * u_aimate.z);
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
  // gl_FragColor = filterColor(gl_FragColor);
}