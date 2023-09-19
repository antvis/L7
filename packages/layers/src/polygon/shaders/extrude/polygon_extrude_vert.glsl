precision highp float;

#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute float a_Size;
attribute vec3 a_uvs;
uniform mat4 u_ModelMatrix;

uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;
uniform float u_linearColor: 0;

uniform float u_topsurface: 1.0;
uniform float u_sidesurface: 1.0;

varying vec4 v_Color;
uniform float u_heightfixed: 0.0; // 默认不固定
uniform float u_raisingHeight: 0.0;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
 
  float isSide = a_Position.z;
 float topU = a_uvs[0];
 float topV = 1.0 - a_uvs[1];
 float sidey = a_uvs[2];

  vec4 pos = vec4(a_Position.xy, a_Position.z * a_Size, 1.0);
  float lightWeight = calc_lighting(pos);

  vec4 project_pos = project_position(pos);

  if(u_heightfixed > 0.0) { // 判断几何体是否固定高度
    project_pos.z = a_Position.z * a_Size;
    project_pos.z += u_raisingHeight;

    if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
      project_pos.z *= mapboxZoomScale;
      project_pos.z += u_raisingHeight * mapboxZoomScale;
    }
  }


 gl_Position = project_common_position_to_clipspace_v2(vec4(project_pos.xyz, 1.0));

  // Tip: 部分机型 GPU 计算精度兼容
  if(isSide < 0.999) {
    // side face
    // if(u_sidesurface < 1.0) {
    //   discard;
    // }

    if(u_linearColor == 1.0) {
      vec4 linearColor = mix(u_targetColor, u_sourceColor, sidey);
      linearColor.rgb *= lightWeight;
      v_Color = linearColor;
    } else {
      v_Color = a_Color;
    }

  } else {
    v_Color = a_Color;
  }

  v_Color = vec4(v_Color.rgb * lightWeight, v_Color.w * opacity);


  setPickingColor(a_PickingColor);
}
