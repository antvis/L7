#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2


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
    float lightWeight = ambientRatio + diffuseRatio * lambert + specularRatio * specular;

    return lightWeight;
}
