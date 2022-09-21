precision mediump float;
uniform float u_opacity: 1.0;
uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;
uniform float u_min;
uniform float u_max;
uniform vec2 u_domain;
uniform float u_noDataValue;
uniform bool u_clampLow: true;
uniform bool u_clampHigh: true;
varying vec2 v_texCoord;



// float getBlurIndusty() {
//   vec2 u_ViewportSize = vec2(1024);

//     float vW = 2.0/u_ViewportSize.x;
//     float vH = 2.0/u_ViewportSize.y;
//     vec2 vUv = v_texCoord;
//     float i11 = texture2D( u_texture, vec2( vUv.x - 1.0 * vW, vUv.y + 1.0 * vH) ).r;
//     float i12 = texture2D( u_texture, vec2( vUv.x - 0.0 * vW, vUv.y + 1.0 * vH) ).r;
//     float i13 = texture2D( u_texture, vec2( vUv.x + 1.0 * vW, vUv.y + 1.0 * vH) ).r;

//     float i21 = texture2D( u_texture, vec2( vUv.x - 1.0 * vW, vUv.y) ).r;
//     float i22 = texture2D( u_texture, vec2( vUv.x , vUv.y) ).r;
//     float i23 = texture2D( u_texture, vec2( vUv.x + 1.0 * vW, vUv.y) ).r;

//     float i31 = texture2D( u_texture, vec2( vUv.x - 1.0 * vW, vUv.y-1.0*vH) ).r;
//     float i32 = texture2D( u_texture, vec2( vUv.x - 0.0 * vW, vUv.y-1.0*vH) ).r;
//     float i33 = texture2D( u_texture, vec2( vUv.x + 1.0 * vW, vUv.y-1.0*vH) ).r;

//     return(
//         i11 + 
//         i12 + 
//         i13 + 
//         i21 + 
//         i21 + 
//         i22 + 
//         i23 + 
//         i31 + 
//         i32 + 
//         i33
//         )/9.0;
// }

void main() {

  float value = texture2D(u_texture,vec2(v_texCoord.x,v_texCoord.y)).r;

  // float value = getBlurIndusty();


  if (value == u_noDataValue)
    gl_FragColor = vec4(0.0, 0, 0, 0.0);
  else if ((!u_clampLow && value < u_domain[0]) || (!u_clampHigh && value > u_domain[1]))
    gl_FragColor = vec4(0, 0, 0, 0);
  else {
    float normalisedValue =(value - u_domain[0]) / (u_domain[1] -u_domain[0]);
    vec4 color = texture2D(u_colorTexture,vec2(normalisedValue, 0));
    gl_FragColor = color;
    gl_FragColor.a =  gl_FragColor.a * u_opacity ;
  }
}
