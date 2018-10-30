precision highp float;
uniform vec4 u_extent;
uniform sampler2D u_texture;
uniform float u_size;
uniform sampler2D u_colorTexture;
uniform float u_min;
uniform float u_max;
varying vec2 v_texCoord;
varying vec4 v_color;
void main() {
   mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
   float value = texture2D(u_texture,uv)[0];
    v_texCoord = uv;
   value = clamp(value,u_min,u_max);
   vec2 range = u_extent.zw - u_extent.xy;
   gl_Position =  matModelViewProjection * vec4(position.xy, value*100.0, 1.0);

}