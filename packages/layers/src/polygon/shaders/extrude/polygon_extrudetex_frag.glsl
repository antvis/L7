layout(std140) uniform ModelUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_linearColor;
  float u_topsurface;
  float u_sidesurface;
  float u_heightfixed;
  float u_raisingHeight;
};

uniform sampler2D u_texture;

in vec4 v_Color;
in vec3 v_uvs;
in vec2 v_texture_data;

out vec4 outputColor;

#pragma include "picking"

void main() {
  float opacity = u_opacity;
  float isSide = v_texture_data.x;
  float lightWeight = v_texture_data.y;
  float topU = v_uvs[0];
  float topV = 1.0 - v_uvs[1];
  float sidey = v_uvs[2];
  // Tip: 部分机型 GPU 计算精度兼容
  if(isSide < 0.999) {// 是否是边缘
    // side face
    if(u_sidesurface < 1.0) {
      discard;
    }

    if(u_linearColor == 1.0) {
      vec4 linearColor = mix(u_targetColor, u_sourceColor, sidey);
      linearColor.rgb *= lightWeight;
      outputColor = linearColor;
    } else {
      outputColor = v_Color;
    }
  } else {

     // top face
    if(u_topsurface < 1.0) {
      discard;
    }

    outputColor = texture(SAMPLER_2D(u_texture), vec2(topU, topV));
    // outputColor = vec4(1.0, 0., 0., 1.0);
  }

  outputColor.a *= opacity;
  outputColor = filterColor(outputColor);
}
