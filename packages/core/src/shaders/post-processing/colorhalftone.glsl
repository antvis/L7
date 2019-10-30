varying vec2 v_UV;

uniform sampler2D u_Texture;
uniform vec2 u_ViewportSize: [1.0, 1.0];
uniform vec2 u_Center : [0.5, 0.5];
uniform float u_Angle : 0;
uniform float u_Size : 8;

#pragma include "common"

float scale = PI / u_Size;

float pattern(float u_Angle, vec2 texSize, vec2 texCoord) {
  float s = sin(u_Angle), c = cos(u_Angle);
  vec2 tex = texCoord * texSize - u_Center * texSize;
  vec2 point = vec2(
    c * tex.x - s * tex.y,
    s * tex.x + c * tex.y
  ) * scale;
  return (sin(point.x) * sin(point.y)) * 4.0;
}

// https://github.com/evanw/glfx.js/blob/master/src/filters/fun/colorhalftone.js
vec4 colorHalftone_filterColor(vec4 color, vec2 texSize, vec2 texCoord) {
  vec3 cmy = 1.0 - color.rgb;
  float k = min(cmy.x, min(cmy.y, cmy.z));
  cmy = (cmy - k) / (1.0 - k);
  cmy = clamp(
    cmy * 10.0 - 3.0 + vec3(
      pattern(u_Angle + 0.26179, texSize, texCoord),
      pattern(u_Angle + 1.30899, texSize, texCoord),
      pattern(u_Angle, texSize, texCoord)
    ),
    0.0,
    1.0
  );
  k = clamp(k * 10.0 - 5.0 + pattern(u_Angle + 0.78539, texSize, texCoord), 0.0, 1.0);
  return vec4(1.0 - cmy - k, color.a);
}

void main() {
  gl_FragColor = vec4(texture2D(u_Texture, v_UV));
  gl_FragColor = colorHalftone_filterColor(gl_FragColor, u_ViewportSize, v_UV);
}