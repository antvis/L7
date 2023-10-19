layout(location = 0) in vec3 a_Position;
layout(location = 7) in vec3 a_Normal;
layout(location = 8) in vec2 a_Uv;

out vec2 v_texCoord;
out float v_lightWeight;

layout(std140) uniform ModelUniforms {
  vec3 u_sunLight;
  float u_ambientRatio;
  float u_diffuseRatio;
  float u_specularRatio;
};

#pragma include "projection"
#pragma include "picking"

float calc_lighting(vec4 pos) {

    vec3 worldPos = vec3(pos * u_ModelMatrix);

    vec3 worldNormal = a_Normal;

    // cal light weight
    vec3 viewDir = normalize(u_CameraPosition - worldPos);

    vec3 lightDir = normalize(u_sunLight);

    vec3 halfDir = normalize(viewDir+lightDir);
    // lambert
    float lambert = dot(worldNormal, lightDir);
    // specular
    float specular = pow(max(0.0, dot(worldNormal, halfDir)), 32.0);
    //sum to light weight
    float lightWeight = u_ambientRatio + u_diffuseRatio * lambert + u_specularRatio * specular;

    return lightWeight;
}

void main() {

  v_texCoord = a_Uv;

  float lightWeight = calc_lighting(vec4(a_Position, 1.0));
  v_lightWeight = lightWeight;

  gl_Position = u_ViewProjectionMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
}
