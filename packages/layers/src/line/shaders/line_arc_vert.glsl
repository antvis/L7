precision mediump float;
attribute vec3 a_Position;
attribute vec4 a_Instance;
attribute vec4 a_Color;
attribute float a_Size;


uniform mat4 u_ModelMatrix;
uniform float segmentNumber;
varying vec4 v_color;
#pragma include "projection"

float maps (float value, float start1, float stop1, float start2, float stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

float getSegmentRatio(float index) {
    return smoothstep(0.0, 1.0, index / (segmentNumber - 1.0));
}

float paraboloid(vec2 source, vec2 target, float ratio) {
    vec2 x = mix(source, target, ratio);
    vec2 center = mix(source, target, 0.5);
    float dSourceCenter = distance(source, center);
    float dXCenter = distance(x, center);
    return (dSourceCenter + dXCenter) * (dSourceCenter - dXCenter);
}

vec3 getPos(vec2 source, vec2 target, float segmentRatio) {
     float vertex_height = paraboloid(source, target, segmentRatio);

    return vec3(
    mix(source, target, segmentRatio),
    sqrt(max(0.0, vertex_height))
    );
}
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace);
  // rotate by 90 degrees
   dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);

  vec2 offset = dir_screenspace * offset_direction * a_Size / 2.0;

  return offset;
}


void main() {
     v_color = a_Color;
    vec2 source = project_position(vec4(a_Instance.rg, 0, 0)).xy;
    vec2 target = project_position(vec4(a_Instance.ba, 0, 0)).xy;
    float segmentIndex = a_Position.x;
    float segmentRatio = getSegmentRatio(segmentIndex);
    float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));

    float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);
    vec3 curr = getPos(source, target, segmentRatio);
    vec3 next = getPos(source, target, nextSegmentRatio);
    vec2 offset = getExtrusionOffset((next.xy - curr.xy) * indexDir, a_Position.y);

    // vec4 project_pos = project_position(vec4(curr, 1.0));

    gl_Position = project_common_position_to_clipspace(vec4(curr.xy + project_pixel(offset), curr.z, 1.0));

}
