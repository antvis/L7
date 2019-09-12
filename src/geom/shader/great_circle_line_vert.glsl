#define PI 3.1415926535
precision mediump float;
attribute vec4 a_color;
attribute vec4 a_instance;
attribute float a_size;
uniform float u_zoom;
uniform float u_time;
uniform float u_activeId : 0;
uniform vec4 u_activeColor : [ 1.0, 0, 0, 1.0 ];
uniform mat4 matModelViewProjection;
uniform float segmentNumber;  
varying vec4 v_color;
#ifdef ANIMATE
varying float v_distance_ratio;
#endif
#pragma include "project"
float maps (float value, float start1, float stop1, float start2, float stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

float getSegmentRatio(float index) {
    return smoothstep(0.0, 1.0, index / (segmentNumber - 1.));
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
  vec2 offset = dir_screenspace * offset_direction * a_size * pow(2.0,20.0-u_zoom) / 2.0;
  return offset;
}
float getAngularDist (vec2 source, vec2 target) {
  vec2 delta = source - target;
  vec2 sin_half_delta = sin(delta / 2.0);
  float a =
    sin_half_delta.y * sin_half_delta.y +
    cos(source.y) * cos(target.y) *
    sin_half_delta.x * sin_half_delta.x;
  return 2.0 * atan(sqrt(a), sqrt(1.0 - a));
}
vec2 interpolate (vec2 source, vec2 target, float angularDist, float t) {
  // if the angularDist is PI, linear interpolation is applied. otherwise, use spherical interpolation
  if(abs(angularDist - PI) < 0.001) {
    return (1.0 - t) * source + t * target;
  }
  float a = sin((1.0 - t) * angularDist) / sin(angularDist);
  float b = sin(t * angularDist) / sin(angularDist);
  vec2 sin_source = sin(source);
  vec2 cos_source = cos(source);
  vec2 sin_target = sin(target);
  vec2 cos_target = cos(target);
  float x = a * cos_source.y * cos_source.x + b * cos_target.y * cos_target.x;
  float y = a * cos_source.y * sin_source.x + b * cos_target.y * sin_target.x;
  float z = a * sin_source.y + b * sin_target.y;
  return vec2(atan(y, x), atan(z, sqrt(x * x + y * y)));
}

void main() {
    mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
    vec2 source = radians(unProjectFlat(a_instance.rg));
    vec2 target = radians(unProjectFlat(a_instance.ba));
    float angularDist = getAngularDist(source, target);
    float segmentIndex = position.x;
    float segmentRatio = getSegmentRatio(segmentIndex);
    float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));
    float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);
     #ifdef ANIMATE
      v_distance_ratio = segmentIndex / segmentNumber;
    #endif
    vec3 curr = vec3(degrees(interpolate(source, target, angularDist, segmentRatio)), 0.0);
    vec3 next = vec3(degrees(interpolate(source, target, angularDist, nextSegmentRatio)), 0.0);
    vec2 offset = getExtrusionOffset((ProjectFlat(next.xy) - ProjectFlat(curr.xy)) * indexDir, position.y);
    gl_Position =matModelViewProjection * vec4(vec3(vec3(ProjectFlat(curr.xy),2.) + vec3(offset, 0.0)),1.0);
    v_color = a_color;
      // picking
    if(pickingId == u_activeId) {
        v_color = u_activeColor;
    }
   #ifdef PICK
    worldId = id_toPickColor(pickingId);
   #endif

}