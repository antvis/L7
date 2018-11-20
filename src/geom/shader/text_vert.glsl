precision mediump float;
attribute vec2 a_txtsize; 
attribute vec2 a_txtOffsets;
attribute vec4 a_color;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_scale;
uniform vec2 u_textSize;
uniform vec2 u_glSize;
varying vec2 v_texcoord;
varying vec4  v_color;

void main() {
     mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
      vec4 cur_position = matModelViewProjection * vec4(position.xy, 0, 1);
      gl_Position = cur_position / cur_position.w + vec4((a_txtOffsets + a_txtsize)/ u_glSize * 2.0,0.0, 0.0) +vec4(abs(a_txtsize.x)/u_glSize.x *2.0, -abs(a_txtsize.y)/u_glSize.y* 2.0, 0.0, 0.0);
    v_color = a_color;
    v_texcoord = uv / u_textSize;
    
}
