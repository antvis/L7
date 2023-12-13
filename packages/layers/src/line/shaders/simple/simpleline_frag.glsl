
layout(std140) uniform commonUniorm {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec4 u_dash_array;
  float u_vertexScale: 1.0;
  float u_linearColor: 0;
};
in float v_distanceScale;
in vec4 v_color;
//dash
in vec4 v_dash_array;

out vec4 outputColor;
void main() {
  if(u_dash_array!=vec4(0.0)){
    float dashLength = mod(v_distanceScale, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
    if(!(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z))) {
      // 虚线部分
      discard;
    };
  }
  if(u_linearColor==1.0){
    outputColor = mix(u_sourceColor, u_targetColor, v_distanceScale);
    outputColor.a *= v_color.a; // 全局透明度
  }
  else{
    outputColor = v_color;
  }
}
