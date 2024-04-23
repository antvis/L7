// attribute vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

// attribute vec2 a_Extrude;
// attribute float a_Size;
// attribute float a_Shape;

layout(std140) uniform commonUniforms {
	vec4 u_sunLight: [1.0, -10.5, 12.0,0.0];
	float u_ambientRatio : 0.5;
	float u_diffuseRatio : 0.3;
	float u_specularRatio : 0.2;
};

#pragma include "scene_uniforms"

out vec2 v_texCoord;
out float v_lightWeight;

float calc_lighting(vec4 pos) {

	vec3 worldPos = vec3(pos * u_ModelMatrix);

	vec3 worldNormal = a_Normal;

	// cal light weight
	vec3 viewDir = normalize(u_CameraPosition - worldPos);

	vec3 lightDir = normalize(u_sunLight.xyz);

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
