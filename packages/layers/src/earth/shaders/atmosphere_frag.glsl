
uniform float u_opacity;
uniform vec3 u_CameraPosition;

varying vec3 vVertexNormal;
varying float v_offset;
varying vec4 v_Color;
void main() {
    
    
    // float intensity = pow(0.5 + dot(normalize(vVertexNormal), normalize(u_CameraPosition)), 3.0);
    float intensity = pow(v_offset + dot(normalize(vVertexNormal), normalize(u_CameraPosition)), 3.0);
    // 去除背面
    if(intensity > 1.0) intensity = 0.0;

    gl_FragColor = vec4(v_Color.rgb, v_Color.a * intensity * u_opacity);
}
