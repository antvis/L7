#define COORDINATE_SYSTEM_LNGLAT 1.0        // mapbox
#define COORDINATE_SYSTEM_LNGLAT_OFFSET 2.0 // mapbox offset
#define COORDINATE_SYSTEM_VECTOR_TILE 3.0
#define COORDINATE_SYSTEM_IDENTITY 4.0
#define COORDINATE_SYSTEM_P20 5.0           // amap
#define COORDINATE_SYSTEM_P20_OFFSET 6.0    // amap offset
#define COORDINATE_SYSTEM_METER_OFFSET 7.0

#define COORDINATE_SYSTEM_P20_2 8.0         // amap2.0
uniform float u_CoordinateSystem;
varying vec4 v_color;
uniform float u_arrow: 0.0;
uniform float u_linearColor: 0;
uniform vec4 u_sourceColor;
uniform vec4 u_targetColor;

#pragma include "picking"

varying mat4 styleMappingMat;
void main() {
  float distanceAndIndex = styleMappingMat[0][3];
  float miter = styleMappingMat[0][2];

  float opacity = styleMappingMat[0][0];
  float d_distance_ratio = styleMappingMat[3].r; // 当前点位距离占线总长的比例


  if(u_arrow > 0.0 && distanceAndIndex < 2.0) { // arrow
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20 || u_CoordinateSystem == COORDINATE_SYSTEM_P20_OFFSET) { 
      if(cross(vec3(styleMappingMat[1].rg, 0.0), vec3(styleMappingMat[1].ba, 0.0)).z < 0.0) { // amap
        discard;
      }
    } else { // amap2 mapbox map
      if(cross(vec3(styleMappingMat[1].rg, 0.0), vec3(styleMappingMat[1].ba, 0.0)).z > 0.0) { 
        discard;
      }
    }
  } else { // line body
    if(miter < 0.0) {
      discard;
    }
  }


  if(u_linearColor == 1.0) { // 使用渐变颜色
    gl_FragColor = mix(u_sourceColor, u_targetColor, d_distance_ratio);
  } else { // 使用 color 方法传入的颜色
    gl_FragColor = v_color;
  }

  gl_FragColor.a *= opacity; // 全局透明度
  gl_FragColor = filterColor(gl_FragColor);
}
