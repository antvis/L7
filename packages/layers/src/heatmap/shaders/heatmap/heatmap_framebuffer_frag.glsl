layout(std140) uniform commonUniforms {
  float u_radius;
  float u_intensity;
  float u_common_uniforms_padding1;
  float u_common_uniforms_padding2;
};

in vec2 v_extrude;
in float v_weight;
out vec4 outputColor;
#define GAUSS_COEF  0.3989422804014327

void main(){
    float d = -0.5 * 3.0 * 3.0 * dot(v_extrude, v_extrude);
    float val = v_weight * u_intensity * GAUSS_COEF * exp(d);
    outputColor = vec4(val, 1., 1., 1.);
}
