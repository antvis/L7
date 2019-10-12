uniform sampler2D u_texture;
varying vec4 v_color;
void main(){
  vec2 pos=v_uv+gl_PointCoord / 512.*64.;
   pos.y=1.-pos.y;
  vec4 textureColor=texture2D(u_texture,pos);
  if(v_color == vec4(0.)){
        gl_FragColor= textureColor; 
  }else {
        gl_FragColor= step(0.01, textureColor.x) * v_color;
  }
  return;
}