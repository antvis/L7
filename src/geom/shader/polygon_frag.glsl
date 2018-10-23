precision highp float;
uniform float u_opacity;
uniform sampler2D u_texture;
varying vec2 v_texCoord;
varying  vec4 v_color;
varying float vlightWeight;
void main() {
   #ifdef TEXCOORD_0
     if(v_texCoord.x == -1.0) {
        gl_FragColor = vec4(v_color.xyz , v_color.w * u_opacity);
     }else {
      vec4 color = texture2D(u_texture,v_texCoord) * v_color;
      color = vec4(color.rgb * vlightWeight, color.w);
      gl_FragColor = color;
     }
   #else
       gl_FragColor = vec4(v_color.xyz , v_color.w * u_opacity);
    #endif
 
}