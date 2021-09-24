// attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute vec2 a_Uv;
varying vec2 v_texCoord;

// attribute vec2 a_Extrude;
// attribute float a_Size;
// attribute float a_Shape;

uniform vec3 u_CameraPosition;
uniform mat4 u_ViewProjectionMatrix;
uniform mat4 u_ModelMatrix;
uniform float u_ambientRatio : 0.5;
uniform float u_diffuseRatio : 0.3;
uniform float u_specularRatio : 0.2;



float calc_lighting(vec4 pos) {

    vec3 worldPos = vec3(pos * u_ModelMatrix);

    vec3 worldNormal = a_Normal;
      // //cal light weight
    vec3 viewDir = normalize(u_CameraPosition - worldPos);

    vec3 lightDir = normalize(vec3(1, -10.5, 12));

    vec3 halfDir = normalize(viewDir+lightDir);
      // //lambert
    float lambert = dot(worldNormal, lightDir);
        //specular
    float specular = pow(max(0.0, dot(worldNormal, halfDir)), 32.0);
        //sum to light weight
    float lightWeight = u_ambientRatio + u_diffuseRatio * lambert + u_specularRatio * specular;

    return lightWeight;
}


varying vec4 v_color;
void main() {

    v_texCoord = a_Uv;
    vec4 color = vec4(1.0, 0.0, 0.0, 1.0);

    float lightWeight = calc_lighting(vec4(a_Position, 1.0));

    v_color = vec4(color.rgb * lightWeight, color.w);
    // v_color = vec4(color.rgb * 0.5, color.w);

    // gl_Position = vec4(0.5, 0.0, 0.0, 1.0);

    gl_Position = u_ViewProjectionMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
}
