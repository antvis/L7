
in vec4 v_PickingResult;

#pragma include "picking_uniforms"

#define PICKING_NONE 0.0
#define PICKING_ENCODE 1.0
#define PICKING_HIGHLIGHT 2.0
#define COLOR_SCALE 1. / 255.

#define HIGHLIGHT 1.0
#define SELECT 2.0

/*
 * Returns highlight color if this item is selected.
 */
vec4 filterHighlightColor(vec4 color, float weight) {
  // float selected = v_PickingResult.a;
  bool selected = bool(v_PickingResult.a);

  // if (selected == SELECT) {
  if (selected) {
  //   // 点击选中状态
  //   vec4 selectColor = u_SelectColor * COLOR_SCALE;
  //   return selectColor;
  // } else if (selected == HIGHLIGHT) {
  //   // hover 高亮状态
    vec4 highLightColor = u_HighlightColor * COLOR_SCALE;

    float highLightAlpha = highLightColor.a;
    float highLightRatio = highLightAlpha / (highLightAlpha + color.a * (1.0 - highLightAlpha));

    vec3 resultRGB = mix(color.rgb, highLightColor.rgb, highLightRatio);
    return vec4(mix(resultRGB * weight, color.rgb, u_activeMix), color.a);
  } else {
    return color;
  }
}

/*
 * Returns picking color if picking enabled else unmodified argument.
 */
vec4 filterPickingColor(vec4 color) {
  vec3 pickingColor = v_PickingResult.rgb;
  if (u_PickingStage == PICKING_ENCODE && length(pickingColor) < 0.001) {
    discard;
  }
  return u_PickingStage == PICKING_ENCODE ? vec4(pickingColor, step(0.001,color.a)): color;
}

/*
 * Returns picking color if picking is enabled if not
 * highlight color if this item is selected, otherwise unmodified argument.
 */
vec4 filterColor(vec4 color) {
  // 过滤多余的 shader 计算
  // return color;
  if(u_shaderPick < 0.5) {
    return color; // 暂时去除 直接取消计算在选中时拖拽地图会有问题
  } else {
    return filterPickingColor(filterHighlightColor(color, 1.0));
  }
  
}

vec4 filterColorAlpha(vec4 color, float alpha) {
  // 过滤多余的 shader 计算
  // return color;
  if(u_shaderPick < 0.5) {
    return color; // 暂时去除 直接取消计算在选中时拖拽地图会有问题
  } else {
    return filterPickingColor(filterHighlightColor(color, alpha));
  }
}

