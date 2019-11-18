
uniform sampler2D u_texture;
varying vec4 v_color;
varying vec2 v_uv;
uniform vec2 u_textSize;
uniform float u_stroke_width : 1;
uniform vec4 u_stroke_color : [1, 1, 1, 1];
uniform float u_stroke_opacity : 1;
uniform float u_opacity : 1;

varying float v_size;
void main(){
vec2 pos= v_uv / u_textSize + gl_PointCoord / u_textSize * 64.;
vec2 fragmentPosition = 2.0*gl_PointCoord - 1.0;
float distance = length(fragmentPosition);
float distanceSqrd = distance * distance;
float radius = 1.;
float r = 1.0 - smoothstep(radius-(radius*0.01),
                         radius+(radius*0.01),
                         distanceSqrd);
  vec4 textureColor=texture2D(u_texture,pos);
  if(v_color == vec4(0.)){
        gl_FragColor= vec4(textureColor.xyz, textureColor.w * r);
  }else {
        gl_FragColor= step(0.01, textureColor.x) * v_color;
  }
  return;
}
