precision mediump float;
attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec4 a_Instance;
attribute float a_Size;
uniform mat4 u_ModelMatrix;
uniform float segmentNumber;
varying vec4 v_color;
varying vec2 v_normal;
#pragma include "projection"

float bezier3(vec3 arr, float t) {
  float ut = 1. - t;
  return (arr.x * ut + arr.y * t) * ut + (arr.y * ut + arr.z * t) * t;
}
vec2 midPoint(vec2 source, vec2 target) {
  vec2 center = target - source;
  float r = length(center);
  float theta = atan(center.y, center.x);
  float thetaOffset = 0.314;
  float r2 = r / 2.0 / cos(thetaOffset);
  float theta2 = theta + thetaOffset;
  vec2 mid = vec2(r2*cos(theta2) + source.x, r2*sin(theta2) + source.y);
  return mid;
}
float getSegmentRatio(float index) {
    return smoothstep(0.0, 1.0, index / (segmentNumber - 1.));
}
vec2 interpolate (vec2 source, vec2 target, float t) {
  // if the angularDist is PI, linear interpolation is applied. otherwise, use spherical interpolation
  vec2 mid = midPoint(source, target);
  vec3 x = vec3(source.x, mid.x, target.x);
  vec3 y = vec3(source.y, mid.y, target.y);
  return vec2(bezier3(x ,t), bezier3(y,t));
}
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace);
  // rotate by 90 degrees
   dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
  vec2 offset = dir_screenspace * offset_direction * a_Size / 2.0;
  return offset * vec2(1.0, -1.0);
}
vec2 getNormal(vec2 line_clipspace, float offset_direction) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace);
  // rotate by 90 degrees
   dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
   return reverse_offset_normal(vec3(dir_screenspace,1.0)).xy * sign(offset_direction);
}

void main() {
    v_color = a_Color;
    vec2 source = a_Instance.rg;
    vec2 target =  a_Instance.ba;
    float segmentIndex = a_Position.x;
    float segmentRatio = getSegmentRatio(segmentIndex);
    float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));
    float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);

    vec4 curr = project_position(vec4(interpolate(source, target, segmentRatio), 0.0, 1.0));
    vec4 next = project_position(vec4(interpolate(source, target, nextSegmentRatio), 0.0, 1.0));
    v_normal = getNormal((next.xy - curr.xy) * indexDir, a_Position.y);
    vec2 offset = project_pixel(getExtrusionOffset((next.xy - curr.xy) * indexDir, a_Position.y));

     gl_Position = project_common_position_to_clipspace(vec4(curr.xy + offset, 0, 1.0));
}
