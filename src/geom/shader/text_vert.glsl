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
varying vec4 v_color;
uniform float u_activeId;
uniform vec4 u_activeColor;

void main(){
  mat4 matModelViewProjection=projectionMatrix*modelViewMatrix;
  vec4 cur_position=matModelViewProjection*vec4(position.xy,0,1);
  gl_Position=cur_position/cur_position.w+vec4((a_txtOffsets/2.+a_txtsize)/u_glSize*2.,0.,0.);
  //+vec4(abs(a_txtsize.x)/u_glSize.x *2.0, -abs(a_txtsize.y)/u_glSize.y* 2.0, 0.0, 0.0);
  highp float camera_to_anchor_distance=gl_Position.w;
  //  highp float perspective_ratio = clamp(
    //     0.5 + 0.5 * distance_ratio,
    //     0.0, // Prevents oversized near-field symbols in pitched/overzoomed tiles
  //     4.0);
  v_color=a_color;
  v_color.a=v_color.a*camera_to_anchor_distance;
  v_texcoord=uv/u_textSize;
   worldId = id_toPickColor(pickingId);
  
}
