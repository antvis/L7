#define LineTypeSolid 0.0
#define LineTypeDash 1.0
#define Animate 0.0
#define LineTexture 1.0

uniform float u_opacity;
uniform float u_textureBlend;
uniform float u_blur : 0.9;
uniform float u_line_type: 0.0;
varying vec2 v_normal;
varying vec4 v_dash_array;
varying float v_distance_ratio;
varying vec4 v_color;

uniform float u_line_texture: 0.0;
uniform sampler2D u_texture;
uniform vec2 u_textSize;
varying float v_segmentIndex;
uniform float segmentNumber;
varying float v_arcDistrance;
varying float v_pixelLen;
varying float v_a;
varying vec2 v_offset;
varying vec2 v_iconMapUV;

uniform float u_time;
uniform vec4 u_aimate: [ 0, 2., 1.0, 0.2 ];

uniform float u_linearColor: 0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

#pragma include "picking"

void main() {
  float animateSpeed = 0.0; // 运动速度
  // gl_FragColor = v_color;

  if(u_linearColor == 1.0) { // 使用渐变颜色
    gl_FragColor = mix(u_sourceColor, u_targetColor, v_segmentIndex/segmentNumber);
  } else { // 使用 color 方法传入的颜色
     gl_FragColor = v_color;
  }

  // float blur = 1.- smoothstep(u_blur, 1., length(v_normal.xy));
  // float blur = smoothstep(1.0, u_blur, length(v_normal.xy));
  gl_FragColor.a *= u_opacity;
  if(u_line_type == LineTypeDash) {
   float flag = 0.;
    float dashLength = mod(v_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
    if(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z)) {
      flag = 1.;
    }
    gl_FragColor.a *=flag;
  }

  if(u_aimate.x == Animate) {
      animateSpeed = u_time / u_aimate.y;
      float alpha =1.0 - fract( mod(1.0- v_distance_ratio, u_aimate.z)* (1.0/ u_aimate.z) + u_time / u_aimate.y);

      alpha = (alpha + u_aimate.w -1.0) / u_aimate.w;
      // alpha = smoothstep(0., 1., alpha);
      alpha = clamp(alpha, 0.0, 1.0);
      gl_FragColor.a *= alpha;
  }

  if(u_line_texture == LineTexture && u_line_type != LineTypeDash) { // while load texture
    // float arcRadio = smoothstep( 0.0, 1.0, (v_segmentIndex / segmentNumber));
    float arcRadio = v_segmentIndex / (segmentNumber - 1.0);
    float count = floor(v_arcDistrance/v_pixelLen);

    float u = fract(arcRadio * count - animateSpeed * count);
 
    if(u_aimate.x == Animate) {
      u = gl_FragColor.a/u_opacity;
    }
    float v = length(v_offset)/(v_a); // 横向

    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;
    vec4 pattern = texture2D(u_texture, uv);

    if(u_textureBlend == 0.0) { // normal
      pattern.a = 0.0;
      gl_FragColor = filterColor(gl_FragColor + pattern);
    } else { // replace
        pattern.a *= u_opacity;
        if(gl_FragColor.a <= 0.0) {
          pattern.a = 0.0;
        }
        gl_FragColor = filterColor(pattern);
    }
    

    // gl_FragColor = filterColor(gl_FragColor + pattern);

  } else {
    gl_FragColor = filterColor(gl_FragColor);
  }

  // gl_FragColor = filterColor(gl_FragColor);
}
