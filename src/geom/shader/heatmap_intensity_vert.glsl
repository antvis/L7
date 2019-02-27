precision highp float;
attribute float a_weight;
attribute vec2 a_dir;
uniform float u_intensity;
uniform float u_radius;
uniform float u_zoom;
varying vec2 v_extrude;
varying float v_weight;

void main(){
    v_weight = a_weight;
    float GAUSS_COEF = 0.3989422804014327;
    float ZERO = 1.0 / 255.0 / 16.0;
    float extrude_x = a_dir.x * 2.0 -1.0;
    float extrude_y = a_dir.y * 2.0 -1.0;
    vec2 extrude_dir = normalize(vec2(extrude_x,extrude_y));
    float S = sqrt(-2.0 * log(ZERO / a_weight / u_intensity / GAUSS_COEF)) / 3.0;
    v_extrude = extrude_dir * S;
    vec2 extrude =  v_extrude * u_radius * pow(2.0,20.0-min(u_zoom,9.0)); 
    vec4 pos = vec4( position.xy+ extrude, 0.0, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * pos;
}