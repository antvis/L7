
uniform sampler2D u_texture;
varying vec4 v_color;
varying vec2 v_uv;
uniform vec2 u_textSize;
uniform float u_opacity : 1;

varying mat4 styleMappingMat; // 传递从片元中传递的映射数据

#pragma include "picking"

void main(){
      float opacity = styleMappingMat[0][0];
      float size = styleMappingMat[1][0];
      vec2 pos = v_uv / u_textSize + gl_PointCoord / u_textSize * 64.;
      vec4 textureColor;

      // Y = 0.299R + 0.587G + 0.114B // 亮度提取
      // if(size < 13.0) { // 尺寸过小时使用 bloom 卷积模糊采样
      //       float h = 1.0/ 512.0;
      //       vec4 color11 = texture2D( u_texture, vec2( pos.x - 1.0 * h, pos.y + 1.0 * h) );
      //       vec4 color12 = texture2D( u_texture, vec2( pos.x - 0.0 * h, pos.y + 1.0 * h) );
      //       vec4 color13 = texture2D( u_texture, vec2( pos.x + 1.0 * h, pos.y + 1.0 * h) );

      //       vec4 color21 = texture2D( u_texture, vec2( pos.x - 1.0 * h, pos.y) );
      //       vec4 color22 = texture2D( u_texture, vec2( pos.x , pos.y) );
      //       vec4 color23 = texture2D( u_texture, vec2( pos.x + 1.0 * h, pos.y) );

      //       vec4 color31 = texture2D( u_texture, vec2( pos.x - 1.0 * h, pos.y-1.0*h) );
      //       vec4 color32 = texture2D( u_texture, vec2( pos.x - 0.0 * h, pos.y-1.0*h) );
      //       vec4 color33 = texture2D( u_texture, vec2( pos.x + 1.0 * h, pos.y-1.0*h) );

      //       vec4 bloomPixels = (
      //       1.0*color11 + 
      //       1.0*color12 + 
      //       1.0*color13 + 
      //       1.0*color21 + 
      //       1.0*color21 + 
      //       2.0*color22 + 
      //       1.0*color23 + 
      //       1.0*color31 + 
      //       1.0*color32 + 
      //       1.0*color33
      //       )/10.0;
      //       // luma 去除黑点
      //       float bloomluma = 0.299 * bloomPixels.r + 0.587 * bloomPixels.g + 0.114 * bloomPixels.b;
      //       // 弥补透明度
      //       bloomPixels.a *= bloomluma * 1.5;
      //       textureColor = bloomPixels;
      // } else {
      //       textureColor = texture2D(u_texture, pos);
      // }

      textureColor = texture2D(u_texture, pos);
      

      if(all(lessThan(v_color, vec4(1.0+0.00001))) && all(greaterThan(v_color, vec4(1.0-0.00001))) || v_color==vec4(1.0)){
            gl_FragColor= textureColor;
      }else {
            gl_FragColor= step(0.01, textureColor.z) * v_color;
      }

      gl_FragColor.a = gl_FragColor.a * opacity;
      gl_FragColor = filterColor(gl_FragColor);
}
