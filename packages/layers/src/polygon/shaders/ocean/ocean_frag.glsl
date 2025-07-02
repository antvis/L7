layout(std140) uniform commonUniforms {
  vec4 u_watercolor;
  vec4 u_watercolor2;
  float u_time;
};

in vec2 v_uv;
in float v_opacity;
out vec4 outputColor;

float coast2water_fadedepth = 0.1;
float large_waveheight = 0.75; // change to adjust the "heavy" waves
float large_wavesize = 3.4; // factor to adjust the large wave size
float small_waveheight = 0.6; // change to adjust the small random waves
float small_wavesize = 0.5; // factor to ajust the small wave size
float water_softlight_fact = 15.0; // range [1..200] (should be << smaller than glossy-fact)
float water_glossylight_fact = 120.0; // range [1..200]
float particle_amount = 70.0;

vec3 water_specularcolor = vec3(1.3, 1.3, 0.9); // specular Color (RGB) of the water-highlights
#define light (vec3(-0.0, sin(u_time * 0.5) * 0.5 + 0.35, 2.8)) // position of the sun

uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform sampler2D u_texture3;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

// 2d noise function
float noise1(vec2 x) {
  vec2 p = floor(x);
  vec2 f = smoothstep(0.0, 1.0, fract(x));
  float n = p.x + p.y * 57.0;
  return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
}

float noise(vec2 p) {
  return texture(SAMPLER_2D(u_texture2), p * vec2(1.0 / 256.0)).x;
}

vec4 highness(vec2 p) {
  vec4 t = texture(SAMPLER_2D(u_texture1), fract(p));
  float clipped =
    -2.0 -
    smoothstep(3.0, 10.0, t.a) * 6.9 -
    smoothstep(10.0, 100.0, t.a) * 89.9 -
    smoothstep(0.0, 10000.0, t.a) * 10000.0;
  return clamp(t, 0.0, 3.0) + clamp(t / 3.0 - 1.0, 0.0, 1.0) + clamp(t / 16.0 - 1.0, 0.0, 1.0);
}

float height_map(vec2 p) {
  vec4 height = highness(p);
  /*
    height = -0.5+
        0.5*smoothstep(-100.,0.,-height)+
        2.75*smoothstep(0.,2.,height)+
        1.75*smoothstep(2.,4.,height)+
        2.75*smoothstep(4.,16.,height)+
        1.5*smoothstep(16.,1000.,height);
    */

  mat2 m = mat2(0.9563 * 1.4, -0.2924 * 1.4, 0.2924 * 1.4, 0.9563 * 1.4);
  //p = p*6.;
  float f = 0.6 * noise1(p);
  p = m * p * 1.1 * 6.0;
  f += 0.25 * noise(p);
  p = m * p * 1.32;
  f += 0.1666 * noise(p);
  p = m * p * 1.11;
  f += 0.0834 * noise(p);
  p = m * p * 1.12;
  f += 0.0634 * noise(p);
  p = m * p * 1.13;
  f += 0.0444 * noise(p);
  p = m * p * 1.14;
  f += 0.0274 * noise(p);
  p = m * p * 1.15;
  f += 0.0134 * noise(p);
  p = m * p * 1.16;
  f += 0.0104 * noise(p);
  p = m * p * 1.17;
  f += 0.0084 * noise(p);
  f = 0.25 * f + dot(height, vec4(-0.03125, -0.125, 0.25, 0.25)) * 0.5;
  const float FLAT_LEVEL = 0.92525;
  //f = f*0.25+height*0.75;
  if (f < FLAT_LEVEL) f = f;
  else f = pow((f - FLAT_LEVEL) / (1.0 - FLAT_LEVEL), 2.0) * (1.0 - FLAT_LEVEL) * 2.0 + FLAT_LEVEL; // makes a smooth coast-increase
  return clamp(f, 0.0, 10.0);
}

vec3 plasma_quintic(float x) {
  x = clamp(x, 0.0, 1.0);
  vec4 x1 = vec4(1.0, x, x * x, x * x * x); // 1 x x2 x3
  vec4 x2 = x1 * x1.w * x; // x4 x5 x6 x7
  return vec3(
    dot(x1.xyzw, vec4(+0.063861086, +1.992659096, -1.023901152, -0.490832805)) +
      dot(x2.xy, vec2(+1.308442123, -0.914547012)),
    dot(x1.xyzw, vec4(+0.04971859, -0.791144343, +2.892305078, +0.811726816)) +
      dot(x2.xy, vec2(-4.686502417, +2.717794514)),
    dot(x1.xyzw, vec4(+0.513275779, +1.58025506, -5.164414457, +4.559573646)) +
      dot(x2.xy, vec2(-1.916810682, +0.570638854))
  );
}

vec4 color(vec2 p) {
  vec4 c1 = vec4(1.7, 1.6, 0.9, 1);
  vec4 c2 = vec4(0.2, 0.94, 0.1, 1);
  vec4 c3 = vec4(0.3, 0.2, 0.0, 1);
  vec4 c4 = vec4(0.99, 0.99, 1.6, 1);
  vec4 v = highness(p);
  float los = smoothstep(0.1, 1.1, v.b);
  float his = smoothstep(3.5, 6.5, v.b);
  float ces = smoothstep(1.0, 5.0, v.a);
  vec4 lo = mix(c1, c2, los);
  vec4 hi = mix(c3, c4, his);
  vec4 ce = mix(lo, hi, ces);

  return vec4(plasma_quintic(ces), 1).ragb;
}

vec3 terrain_map(vec2 p) {
  return color(p).rgb * 0.75 +
  0.25 * vec3(0.7, 0.55, 0.4) +
  texture(SAMPLER_2D(u_texture3), fract(p * 5.0)).rgb * 0.5; // test-terrain is simply 'sandstone'
}

const mat2 m = mat2(
   0.72, -1.6 ,
   1.6 ,  0.72
);

float water_map(vec2 p, float height) {
  vec2 p2 = p * large_wavesize;
  vec2 shift1 = 0.001 * vec2(u_time * 160.0 * 2.0, u_time * 120.0 * 2.0);
  vec2 shift2 = 0.001 * vec2(u_time * 190.0 * 2.0, -u_time * 130.0 * 2.0);

  // coarse crossing 'ocean' waves...
  float f = 0.6 * noise(p);
  f += 0.25 * noise(p * m);
  f += 0.1666 * noise(p * m * m);
  float wave =
    sin(p2.x * 0.622 + p2.y * 0.622 + shift2.x * 4.269) * large_waveheight * f * height * height;

  p *= small_wavesize;
  f = 0.0;
  float amp = 1.0,
    s = 0.5;
  for (int i = 0; i < 9; i++) {
    p = m * p * 0.947;
    f -= amp * abs(sin((noise(p + shift1 * s) - 0.5) * 2.0));
    amp = amp * 0.59;
    s *= -1.329;
  }

  return wave + f * small_waveheight;
}

float nautic(vec2 p) {
  p *= 18.0;
  float f = 0.0;
  float amp = 1.0,
    s = 0.5;
  for (int i = 0; i < 3; i++) {
    p = m * p * 1.2;
    f += amp * abs(smoothstep(0.0, 1.0, noise(p + u_time * s)) - 0.5);
    amp = amp * 0.5;
    s *= -1.227;
  }
  return pow(1.0 - f, 5.0);
}

float particles(vec2 p) {
  p *= 200.0;
  float f = 0.0;
  float amp = 1.0,
    s = 1.5;
  for (int i = 0; i < 3; i++) {
    p = m * p * 1.2;
    f += amp * noise(p + u_time * s);
    amp = amp * 0.5;
    s *= -1.227;
  }
  return pow(f * 0.35, 7.0) * particle_amount;
}

float test_shadow(vec2 xy, float height) {
  vec3 r0 = vec3(xy, height);
  vec3 rd = normalize(light - r0);

  float hit = 1.0;
  float t = 0.001;
  for (int j = 1; j < 25; j++) {
    vec3 p = r0 + t * rd;
    float h = height_map(p.xy);
    float height_diff = p.z - h;
    if (height_diff < 0.0) {
      return 0.0;
    }
    t += 0.01 + height_diff * 0.02;
    hit = min(hit, 2.0 * height_diff / t); // soft shaddow
  }
  return hit;
}

vec3 CalcTerrain(vec2 uv, float height) {
  vec3 col = terrain_map(uv);
  vec2 iResolution = vec2(512.0);
  float h1 = height_map(uv - vec2(0.0, 0.5) / iResolution.xy);
  float h2 = height_map(uv + vec2(0.0, 0.5) / iResolution.xy);
  float h3 = height_map(uv - vec2(0.5, 0.0) / iResolution.xy);
  float h4 = height_map(uv + vec2(0.5, 0.0) / iResolution.xy);
  vec3 norm = normalize(vec3(h3 - h4, h1 - h2, 1.0));
  vec3 r0 = vec3(uv, height);
  vec3 rd = normalize(light - r0);
  float grad = dot(norm, rd);
  col *= grad + pow(grad, 8.0);
  float terrainshade = test_shadow(uv, height);
  col = mix(col * 0.25, col, terrainshade);
  return col;
}

void main() {
  vec3 watercolor = u_watercolor.rgb;
  vec3 watercolor2 = u_watercolor2.rgb;
  vec2 uv = v_uv;
  float WATER_LEVEL = 0.84; // Water level (range: 0.0 - 2.0)
  float deepwater_fadedepth = 0.4 + coast2water_fadedepth;
  float height = height_map(uv);
  vec3 col;

  float waveheight = clamp(WATER_LEVEL * 3.0 - 1.5, 0.0, 1.0);
  float level = WATER_LEVEL + 0.2 * water_map(uv * 15.0 + vec2(u_time * 0.1), waveheight);
  if (height > level) {
    col = CalcTerrain(uv, height);
  }
  if (height <= level) {
    vec2 dif = vec2(0.0, 0.01);
    vec2 pos = uv * 15.0 + vec2(u_time * 0.01);
    float h1 = water_map(pos - dif, waveheight);
    float h2 = water_map(pos + dif, waveheight);
    float h3 = water_map(pos - dif.yx, waveheight);
    float h4 = water_map(pos + dif.yx, waveheight);
    vec3 normwater = normalize(vec3(h3 - h4, h1 - h2, 0.125)); // norm-vector of the 'bumpy' water-plane
    uv += normwater.xy * 0.002 * (level - height);

    col = CalcTerrain(uv, height);

    float coastfade = clamp((level - height) / coast2water_fadedepth, 0.0, 1.0);
    float coastfade2 = clamp((level - height) / deepwater_fadedepth, 0.0, 1.0);
    float intensity = col.r * 0.2126 + col.g * 0.7152 + col.b * 0.0722;
    watercolor = mix(watercolor * intensity, watercolor2, smoothstep(0.0, 1.0, coastfade2));

    vec3 r0 = vec3(uv, WATER_LEVEL);
    vec3 rd = normalize(light - r0); // ray-direction to the light from water-position
    float grad = dot(normwater, rd); // dot-product of norm-vector and light-direction
    float specular = pow(grad, water_softlight_fact); // used for soft highlights
    float specular2 = pow(grad, water_glossylight_fact); // used for glossy highlights
    float gradpos = dot(vec3(0.0, 0.0, 1.0), rd);
    float specular1 = smoothstep(0.0, 1.0, pow(gradpos, 5.0)); // used for diffusity (some darker corona around light's specular reflections...)
    float watershade = test_shadow(uv, level);
    watercolor *= 2.2 + watershade;
    watercolor += (0.2 + 0.8 * watershade) * ((grad - 1.0) * 0.5 + specular) * 0.25;
    watercolor /= 1.0 + specular1 * 1.25;
    watercolor += watershade * specular2 * water_specularcolor;
    watercolor +=
      watershade *
      coastfade *
      (1.0 - coastfade2) *
      (vec3(0.5, 0.6, 0.7) * nautic(uv) + vec3(1.0, 1.0, 1.0) * particles(uv));

    col = mix(col, watercolor, coastfade);
  }

  outputColor = vec4(col, v_opacity);
}
