#define SHIFT_RIGHT18 1.0 / 262144.0
#define SHIFT_RIGHT20 1.0 / 1048576.0
#define SHIFT_LEFT18 262144.0
#define SHIFT_LEFT20 1048576.0

vec2 unpack_float(const float packedValue) {
  int packedIntValue = int(packedValue);
  int v0 = packedIntValue / 256;
  return vec2(v0, packedIntValue - v0 * 256);
}

vec4 decode_color(const vec2 encodedColor) {
  return vec4(
    unpack_float(encodedColor[0]) / 255.0,
    unpack_float(encodedColor[1]) / 255.0
  );
}