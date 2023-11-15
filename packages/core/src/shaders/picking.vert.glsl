layout(location = 2) in vec3 a_PickingColor;
out vec4 v_PickingResult;


layout(std140) uniform PickingUniforms {
  vec4 u_HighlightColor;
  vec4 u_SelectColor;
  vec3 u_PickingColor;
  float u_PickingStage;
  vec3 u_CurrentSelectedId;
  float u_PickingThreshold;
  float u_PickingBuffer;
  float u_shaderPick;
  float u_EnableSelect;
  float u_activeMix;
};

#define PICKING_NONE 0.0
#define PICKING_ENCODE 1.0
#define PICKING_HIGHLIGHT 2.0
#define COLOR_SCALE 1. / 255.

#define NORMAL 0.0
#define HIGHLIGHT 1.0
#define SELECT 2.0

bool isVertexPicked(vec3 vertexColor) {
  return
    abs(vertexColor.r - u_PickingColor.r) < u_PickingThreshold &&
    abs(vertexColor.g - u_PickingColor.g) < u_PickingThreshold &&
    abs(vertexColor.b - u_PickingColor.b) < u_PickingThreshold;
}

// 判断当前点是否已经被 select 选中
bool isVertexSelected(vec3 vertexColor) {
  return
    abs(vertexColor.r - u_CurrentSelectedId.r) < u_PickingThreshold &&
    abs(vertexColor.g - u_CurrentSelectedId.g) < u_PickingThreshold &&
    abs(vertexColor.b - u_CurrentSelectedId.b) < u_PickingThreshold;
}

void setPickingColor(vec3 pickingColor) {
  if(u_shaderPick < 0.5) {
    return;
  }
  // compares only in highlight stage

  v_PickingResult.a = float((u_PickingStage == PICKING_HIGHLIGHT) && isVertexPicked(pickingColor));

  // if (u_EnableSelect == 1.0 && u_PickingStage == PICKING_HIGHLIGHT && isVertexSelected(pickingColor)) {
  //   // 选中态
  //   v_PickingResult.a = SELECT;
  // } else if (u_PickingStage == PICKING_HIGHLIGHT && isVertexPicked(pickingColor)) {
  //   // 高亮态
  //   v_PickingResult.a = HIGHLIGHT;
  // } else {
  //   v_PickingResult.a = NORMAL;
  // }

  // Stores the picking color so that the fragment shader can render it during picking
  v_PickingResult.rgb = pickingColor * COLOR_SCALE;
}

float setPickingSize(float x) {
   return u_PickingStage == PICKING_ENCODE ? x + u_PickingBuffer : x;
}

float setPickingOrder(float z) {
   bool selected = bool(v_PickingResult.a);
   return selected ? z + 1. : 0.;
}
