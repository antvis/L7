vec2 interpolate (vec2 source, vec2 target, float t) {
  // if the angularDist is PI, linear interpolation is applied. otherwise, use spherical interpolation
  vec2 mid = midPoint(source, target);
  vec3 x = vec3(source.x, mid.x, target.x);
  vec3 y = vec3(source.y, mid.y, target.y)
  return vec2(bezier3(x ,t), bezier3(y,t));
}
float bezier3(vec3 arr, float t) {
  float ut = 1 - t
  return (arr.x * ut + arr.y * t) * ut + (arr.y * ut + arr.z * t) * t
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
