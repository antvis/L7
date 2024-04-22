layout(location = ATTRIBUTE_LOCATION_PICKING_COLOR) in vec3 a_PickingColor;
out vec4 v_PickingResult;

#pragma include "picking_uniforms"

#define PICKING_NONE 0.0
#define PICKING_ENCODE 1.0
#define PICKING_HIGHLIGHT 2.0
#define COLOR_SCALE 1. / 255.

#define NORMAL 0.0
#define HIGHLIGHT 1.0
#define SELECT 2.0

bool isVertexPicked(vec3 vertexColor) {
  return distance(vertexColor,u_PickingColor.rgb) < 0.01;
}

// 判断当前点是否已经被 select 选中
bool isVertexSelected(vec3 vertexColor) {
  return distance(vertexColor,u_CurrentSelectedId.rgb) < 0.01;
}

void setPickingColor(vec3 pickingColor) {
  if(u_shaderPick < 0.5) {
    return;
  }
  // compares only in highlight stage

  if(u_PickingStage == PICKING_HIGHLIGHT) {
    if(isVertexPicked(pickingColor)) {
       v_PickingResult = vec4(pickingColor.rgb * COLOR_SCALE,HIGHLIGHT);
       return;
    }
    if(isVertexSelected(pickingColor)) {
     v_PickingResult = vec4(u_CurrentSelectedId.rgb * COLOR_SCALE,SELECT);
      return;
    }

  } else {
      v_PickingResult= vec4(pickingColor.rgb * COLOR_SCALE,NORMAL);
      return;
  }

  // // v_PickingResult.a = float((u_PickingStage == PICKING_HIGHLIGHT) && (isVertexPicked(pickingColor) || isVertexPicked(u_CurrentSelectedId)));

  // // Stores the picking color so that the fragment shader can render it during picking
  // v_PickingResult.rgb = pickingColor * COLOR_SCALE;
}

float setPickingSize(float x) {
   return u_PickingStage == PICKING_ENCODE ? x + u_PickingBuffer : x;
}

float setPickingOrder(float z) {
   bool selected = bool(v_PickingResult.a);
   return selected ? z + 1. : 0.;
}
