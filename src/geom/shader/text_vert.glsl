precision mediump float;
attribute vec4 a_position;
attribute vec2 a_uv;
uniform mat4 matModelViewProjection;
uniform mat4 u_model;
uniform mat4 u_view;


uniform mat4 u_projection;
uniform mat4 u_scale;
uniform vec2 u_textSize;
varying vec2 v_texcoord;

void main() {
    // vec4 mposition = vec4(a_position.zw * 100000.0, 0.0, 0.0) + u_view * u_model * vec4(a_position.xy, 0.0, 1.0);
    // vec4 mposition = u_model * u_projection 0*   vec4(a_position.xy, 0.0,1.0);
    // gl_Position = u_projection * mposition;
    
    //  mposition.xy += a_position.zw * u_size;
    //  gl_Position = u_projection *  mposition;
    //  gl_Position =   u_projection * u_model * u_view * vec4(a_position.xy, 0.0,1.0);
     vec4 p2 = vec4(a_position.xy, 0.0,1.0) + u_scale * vec4(a_position.zw, 0.0,1.0);
    gl_Position =  matModelViewProjection * vec4(p2.xy, 0.0,1.0);
    v_texcoord = a_uv / u_textSize;
    
}
