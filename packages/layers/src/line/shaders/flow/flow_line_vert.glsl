layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in vec2 a_Size;
layout(location = ATTRIBUTE_LOCATION_INSTANCE) in vec4 a_Instance;
layout(location = ATTRIBUTE_LOCATION_INSTANCE_64LOW) in vec4 a_Instance64Low;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;

layout(std140) uniform commonUniorm {
  float u_gap_width: 1.0;
  float u_stroke_width: 1.0;
  float u_stroke_opacity: 1.0;
};

#pragma include "projection"
#pragma include "project"
#pragma include "picking"

out vec4 v_color;

vec2 project_pixel_offset(vec2 offsets) {
  vec2 data = project_pixel(offsets);

  return vec2(data.x, -data.y);
}

vec2 line_dir(vec2 target, vec2 source) {
  return normalize(ProjectFlat(target) - ProjectFlat(source));
}


void main() {
  // 透明度计算
  vec2 source_world = a_Instance.rg; // 起点
  vec2 target_world = a_Instance.ba; // 终点
  vec2 flowlineDir = line_dir(target_world, source_world);
  vec2 perpendicularDir = vec2(-flowlineDir.y, flowlineDir.x);

  vec2 position = mix(source_world, target_world, a_Position.x);
  vec2 position64Low = mix(a_Instance64Low.rg, a_Instance64Low.ba, a_Position.x);

  float lengthCommon = length(
    project_position(vec4(target_world, 0, 1)) - project_position(vec4(source_world, 0, 1))
  );
  vec2 offsetDistances = a_Size.x * project_pixel_offset(vec2(a_Position.y, a_Position.z)); // Mapbox || 高德
  vec2 limitedOffsetDistances = clamp(
    offsetDistances,
    project_pixel(-lengthCommon * 0.2),
    project_pixel(lengthCommon * 0.2)
  );

  float startOffsetCommon = project_pixel(offsets[0]);
  float endOffsetCommon = project_pixel(offsets[1]);
  float endpointOffset = mix(
    clamp(startOffsetCommon, 0.0, lengthCommon * 0.2),
    -clamp(endOffsetCommon, 0.0, lengthCommon * 0.2),
    a_Position.x
  );

  vec2 normalsCommon = u_stroke_width * project_pixel_offset(vec2(a_Normal.x, a_Normal.y));

  float gapCommon = -1. * project_pixel(u_gap_width);
  vec3 offsetCommon = vec3(
    flowlineDir * (limitedOffsetDistances[1] + normalsCommon.y + endpointOffset * 1.05) -
      perpendicularDir * (limitedOffsetDistances[0] + gapCommon + normalsCommon.x),
    0.0
  );

  vec4 project_pos = project_position(vec4(position.xy, 0, 1.0), position64Low);

  vec4 fillColor = vec4(a_Color.rgb, a_Color.a * opacity);
  v_color = mix(fillColor, vec4(u_stroke.xyz, u_stroke.w * fillColor.w * u_stroke_opacity), a_Normal.z);

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy +  offsetCommon.xy, 0., 1.0));

  setPickingColor(a_PickingColor);
}
