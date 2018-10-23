precision mediump float;

attribute float a_index;
uniform sampler2D u_particles;
uniform vec4 u_bbox;
uniform float u_particles_res;

varying vec2 v_particle_pos;
void main() {
    mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
    vec4 color = texture2D(u_particles, vec2(
        fract(a_index / u_particles_res),
        1.0 - floor(a_index / u_particles_res) / u_particles_res));
   
    // decode current particle position from the pixel's RGBA value
    v_particle_pos = vec2(
        color.r / 255.0 + color.b,
        1.0 - (color.g / 255.0 + color.a));
    vec2 xyrange = u_bbox.zw - u_bbox.xy;
    float x = u_bbox.x + v_particle_pos.x * xyrange.x;
    float y = u_bbox.w - v_particle_pos.y * xyrange.y;
    gl_PointSize = 1.0;
    //gl_Position =  matModelViewProjection * vec4(v_particle_pos, 0.0, 1.0);
    gl_Position = vec4(2.0 * v_particle_pos.x - 1.0, 1.0 - 2.0 * v_particle_pos.y, 0, 1);

}
