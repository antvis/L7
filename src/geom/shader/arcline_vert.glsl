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
  vec2 offset = dir_screenspace * offset_direction * a_size * pow(2.0,20.0-u_zoom) / 2.0;
  return offset;
}


void main() {
    mat4 matModelViewProjection = projectionMatrix * modelViewMatrix;
    vec2 source = a_instance.rg;
    vec2 target = a_instance.ba;
    float segmentIndex = position.x;
    float segmentRatio = getSegmentRatio(segmentIndex);
    float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));
    float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);
    vec3 curr = getPos(source, target, segmentRatio);
    vec3 next = getPos(source, target, nextSegmentRatio);
    vec2 offset = getExtrusionOffset((next.xy - curr.xy) * indexDir, position.y);
    #ifdef ANIMATE
      v_distance_ratio = segmentIndex / segmentNumber;
    #endif
    gl_Position =matModelViewProjection * vec4(vec3(curr + vec3(offset, 0.0)),1.0);
    v_color = a_color;
      // picking
    if(pickingId == u_activeId) {
        v_color = u_activeColor;
    }
   #ifdef PICK
    worldId = id_toPickColor(pickingId);
   #endif

}