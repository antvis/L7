uniform sampler2D u_texture;
layout(std140) uniform commonUniforms {
  float u_speed;
  float u_time;
};

out vec4 outputColor;

in vec4 v_Color;
in vec2 v_uv;

float rand(vec2 n) {
  return 0.5 + 0.5 * fract(sin(dot(n.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float water(vec3 p) {
  float t = u_time * u_speed;
  p.z += t * 2.0;
  p.x += t * 2.0;
  vec3 c1 = texture(SAMPLER_2D(u_texture), p.xz / 30.0).xyz;
  p.z += t * 3.0;
  p.x += t * 0.52;
  vec3 c2 = texture(SAMPLER_2D(u_texture), p.xz / 30.0).xyz;
  p.z += t * 4.0;
  p.x += t * 0.8;
  vec3 c3 = texture(SAMPLER_2D(u_texture), p.xz / 30.0).xyz;
  c1 += c2 - c3;
  float z = (c1.x + c1.y + c1.z) / 3.0;
  return p.y + z / 4.0;
}

float map(vec3 p) {
  float d = 100.0;
  d = water(p);
  return d;
}

float intersect(vec3 ro, vec3 rd) {
  float d = 0.0;
  for (int i = 0; i <= 100; i++) {
    float h = map(ro + rd * d);
    if (h < 0.1) return d;
    d += h;
  }
  return 0.0;
}

vec3 norm(vec3 p) {
  float eps = 0.1;
  return normalize(
    vec3(
      map(p + vec3(eps, 0, 0)) - map(p + vec3(-eps, 0, 0)),
      map(p + vec3(0, eps, 0)) - map(p + vec3(0, -eps, 0)),
      map(p + vec3(0, 0, eps)) - map(p + vec3(0, 0, -eps))
    )
  );
}

float calSpc() {
  vec3 l1 = normalize(vec3(1, 1, 1));
  vec3 ro = vec3(-3, 20, -8);
  vec3 rc = vec3(0, 0, 0);
  vec3 ww = normalize(rc - ro);
  vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
  vec3 vv = normalize(cross(rc - ro, uu));
  vec3 rd = normalize(uu * v_uv.x + vv * v_uv.y + ww);
  float d = intersect(ro, rd);
  vec3 p = ro + rd * d;
  vec3 n = norm(p);
  float spc = pow(max(0.0, dot(reflect(l1, n), rd)), 30.0);
  return spc;
}

void main() {
  outputColor = v_Color;
  float spc = calSpc();
  outputColor += spc * 0.4;
}
