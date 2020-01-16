varying vec4 v_PickingResult;
uniform vec4 u_HighlightColor : [0, 0, 0, 0];
uniform float u_PickingStage : 0.0;

#define PICKING_NONE 0.0
#define PICKING_ENCODE 1.0
#define PICKING_HIGHLIGHT 2.0
#define COLOR_SCALE 1. / 255.

/*
 * Returns highlight color if this item is selected.
 */
vec4 filterHighlightColor(vec4 color) {
  bool selected = bool(v_PickingResult.a);

  if (selected) {
    vec4 highLightColor = u_HighlightColor * COLOR_SCALE;

    float highLightAlpha = highLightColor.a;
    float highLightRatio = highLightAlpha / (highLightAlpha + color.a * (1.0 - highLightAlpha));

    vec3 resultRGB = mix(color.rgb, highLightColor.rgb, highLightRatio);
    return vec4(resultRGB, color.a);
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
  return u_PickingStage == PICKING_ENCODE ? vec4(pickingColor, 1.0) : color;
}

/*
 * Returns picking color if picking is enabled if not
 * highlight color if this item is selected, otherwise unmodified argument.
 */
vec4 filterColor(vec4 color) {
  return filterPickingColor(filterHighlightColor(color));
}
