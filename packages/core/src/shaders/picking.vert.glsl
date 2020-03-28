attribute vec3 a_PickingColor;
varying vec4 v_PickingResult;

uniform vec3 u_PickingColor : [0, 0, 0];
uniform vec4 u_HighlightColor : [0, 0, 0, 0];
uniform float u_PickingStage : 0.0;
uniform float u_PickingThreshold : 1.0;
uniform float u_PickingBuffer: 0.0;

#define PICKING_NONE 0.0
#define PICKING_ENCODE 1.0
#define PICKING_HIGHLIGHT 2.0
#define COLOR_SCALE 1. / 255.

bool isVertexPicked(vec3 vertexColor) {
  return
    abs(vertexColor.r - u_PickingColor.r) < u_PickingThreshold &&
    abs(vertexColor.g - u_PickingColor.g) < u_PickingThreshold &&
    abs(vertexColor.b - u_PickingColor.b) < u_PickingThreshold;
}

void setPickingColor(vec3 pickingColor) {
  // compares only in highlight stage
  v_PickingResult.a = float((u_PickingStage == PICKING_HIGHLIGHT) && isVertexPicked(pickingColor));

  // Stores the picking color so that the fragment shader can render it during picking
  v_PickingResult.rgb = pickingColor * COLOR_SCALE;
}

float setPickingSize(float x) {
   return u_PickingStage == PICKING_ENCODE ? x + u_PickingBuffer : x;
}
