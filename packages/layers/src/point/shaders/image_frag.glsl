
uniform sampler2D u_texture;
varying vec4 v_color;
varying vec2 v_uv;
uniform vec2 u_textSize;
uniform float u_opacity : 1;

varying mat4 styleMappingMat; // 传递从片元中传递的映射数据

#pragma include "picking"
void main(){
      float opacity = styleMappingMat[0][0];
      vec2 pos= v_uv / u_textSize + gl_PointCoord / u_textSize * 64.;
      vec4 textureColor=texture2D(u_texture,pos);
      if(all(lessThan(v_color, vec4(1.0+0.00001))) && all(greaterThan(v_color, vec4(1.0-0.00001))) || v_color==vec4(1.0)){
            gl_FragColor= textureColor;
      }else {
            gl_FragColor= step(0.01, textureColor.z) * v_color;
      }
      // gl_FragColor.a =gl_FragColor.a * u_opacity;
      gl_FragColor.a =gl_FragColor.a * opacity;
      gl_FragColor = filterColor(gl_FragColor);
}
