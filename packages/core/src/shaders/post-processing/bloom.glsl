varying vec2 v_UV;

uniform sampler2D u_Texture;

uniform vec2 u_ViewportSize: [1.0, 1.0];
uniform float u_radius: 5.0;

// https://github.com/Jam3/glsl-fast-gaussian-blur/blob/master/9.glsl
vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}

void main() {
  float r = sqrt(u_radius);

  vec4 c1 = blur9(u_Texture, v_UV, u_ViewportSize, vec2(u_radius, 0.0));
  vec4 c2 = blur9(u_Texture, v_UV, u_ViewportSize, vec2(0.0, u_radius));
  vec4 c3 = blur9(u_Texture, v_UV, u_ViewportSize, vec2(r, r));
  vec4 c4 = blur9(u_Texture, v_UV, u_ViewportSize, vec2(r, -r));
  vec4 inbloomColor = c1 * 0.25 + c2 * 0.25 + c3 * 0.25 + c4 * 0.25;



  float h = 0.01;
  vec4 baseColor = texture2D(u_Texture, v_UV);

  vec4 color11 = texture2D( u_Texture, vec2( v_UV.x - 1.0 * h, v_UV.y + 1.0 * h) );
  vec4 color12 = texture2D( u_Texture, vec2( v_UV.x - 0.0 * h, v_UV.y + 1.0 * h) );
  vec4 color13 = texture2D( u_Texture, vec2( v_UV.x + 1.0 * h, v_UV.y + 1.0 * h) );

  vec4 color21 = texture2D( u_Texture, vec2( v_UV.x - 1.0 * h, v_UV.y) );
  vec4 color23 = texture2D( u_Texture, vec2( v_UV.x + 1.0 * h, v_UV.y) );

  vec4 color31 = texture2D( u_Texture, vec2( v_UV.x - 1.0 * h, v_UV.y-1.0*h) );
  vec4 color32 = texture2D( u_Texture, vec2( v_UV.x - 0.0 * h, v_UV.y-1.0*h) );
  vec4 color33 = texture2D( u_Texture, vec2( v_UV.x + 1.0 * h, v_UV.y-1.0*h) );

  vec4 bloomColor =
    color11 + 
    color12 + 
    color13 + 
    color21 + 
    color21 + 
    color23 + 
    color31 + 
    color32 + 
    color33;

    if(baseColor.a > 0.0) {
      
      gl_FragColor.r = min(bloomColor.r, baseColor.r);
      gl_FragColor.g = min(bloomColor.g, baseColor.g);
      gl_FragColor.b = min(bloomColor.b, baseColor.b);
      gl_FragColor.a = min(bloomColor.a, baseColor.a);

      gl_FragColor = mix(inbloomColor, gl_FragColor, 0.7);
    } else {
      gl_FragColor = bloomColor/9.0;
    } 
}