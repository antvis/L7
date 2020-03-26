precision highp float;
uniform float u_intensity;
varying float v_weight;
varying vec2 v_extrude;
#define GAUSS_COEF  0.3989422804014327
void main(){
    float d = -0.5 * 3.0 * 3.0 * dot(v_extrude, v_extrude);
    float val = v_weight * u_intensity * GAUSS_COEF * exp(d);
    gl_FragColor = vec4(val, 1., 1., 1.);
}
