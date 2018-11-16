varying float v_lineU;
uniform float u_opacity;
uniform float u_dashSteps;
uniform float u_dashSmooth;
uniform float u_dashDistance;
varying vec4 v_color;
void main() {
    float lineUMod = mod(v_lineU, 1.0/u_dashSteps) * u_dashSteps;
    float dash = smoothstep(u_dashDistance, u_dashDistance+u_dashSmooth, length(lineUMod-0.5));
    gl_FragColor = vec4(v_color.xyz * vec3(dash), v_color.a*u_opacity * dash);
}