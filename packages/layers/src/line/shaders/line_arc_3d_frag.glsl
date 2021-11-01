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

uniform float u_line_texture: 0.0;
uniform sampler2D u_texture;
uniform vec2 u_textSize;
varying float v_segmentIndex;
uniform float segmentNumber;

varying vec2 v_iconMapUV;

uniform float u_time;
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ];

uniform float u_linearColor: 0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

varying mat4 styleMappingMat;

#pragma include "picking"

void main() {
  float opacity = styleMappingMat[0][0];
  float animateSpeed = 0.0; // 运动速度
  float d_distance_ratio = styleMappingMat[3].g; // 当前点位距离占线总长的比例

  if(u_linearColor == 1.0) { // 使用渐变颜色
    gl_FragColor = mix(u_sourceColor, u_targetColor, v_segmentIndex/segmentNumber);
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

  if(u_aimate.x == Animate) {
      animateSpeed = u_time / u_aimate.y;
      float alpha =1.0 - fract( mod(1.0- d_distance_ratio, u_aimate.z)* (1.0/ u_aimate.z) + u_time / u_aimate.y);

      alpha = (alpha + u_aimate.w -1.0) / u_aimate.w;
      // alpha = smoothstep(0., 1., alpha);
      alpha = clamp(alpha, 0.0, 1.0);
      gl_FragColor.a *= alpha;
  }

  if(u_line_texture == LineTexture && u_line_type != LineTypeDash) { // while load texture
    // float arcRadio = smoothstep( 0.0, 1.0, (v_segmentIndex / segmentNumber));
    float arcRadio = v_segmentIndex / (segmentNumber - 1.0);
    float count = styleMappingMat[3].b; // // 贴图在弧线上重复的数量

    float u = fract(arcRadio * count - animateSpeed * count);
 
    if(u_aimate.x == Animate) {
      u = gl_FragColor.a/opacity;
    }

    float v = styleMappingMat[3].a;  // 线图层贴图部分的 v 坐标值
    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;
    vec4 pattern = texture2D(u_texture, uv);

    if(u_textureBlend == 0.0) { // normal
      pattern.a = 0.0;
      gl_FragColor = filterColor(gl_FragColor + pattern);
    } else { // replace
        pattern.a *= opacity;
        if(gl_FragColor.a <= 0.0) {
          pattern.a = 0.0;
          discard;
        } else {
          gl_FragColor = filterColor(pattern);
        }
    }

  } else {
    gl_FragColor = filterColor(gl_FragColor);
  }

  // gl_FragColor = filterColor(gl_FragColor);
}
