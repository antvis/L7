precision highp float;
attribute vec3 a_Position;
attribute float a_Size;
attribute vec2 a_Dir;
uniform float u_intensity;
uniform float u_radius;
varying vec2 v_extrude;
varying float v_weight;
uniform mat4 u_ModelMatrix;


#define GAUSS_COEF  0.3989422804014327

#pragma include "projection"

void main(){
    v_weight = a_Size;
    float ZERO = 1.0 / 255.0 / 16.0;
    float extrude_x = a_Dir.x * 2.0 -1.0;
    float extrude_y = a_Dir.y * 2.0 -1.0;
    vec2 extrude_dir = normalize(vec2(extrude_x,extrude_y));
    float S = sqrt(-2.0 * log(ZERO / a_Size / u_intensity / GAUSS_COEF)) / 2.5;
    v_extrude = extrude_dir * S;

    vec2 offset = project_pixel(v_extrude * u_radius);
    vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));

    // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));

    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
        gl_Position = u_Mvp * (vec4(project_pos.xy + offset, 0.0, 1.0));
    } else {
        gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));
    }
}
