#define SHIFT_RIGHT2 0.25
#define SHIFT_RIGHT4 0.0625
#define SHIFT_RIGHT8 1.0 / 256.0
#define SHIFT_RIGHT10 1.0 / 1024.0
#define SHIFT_LEFT2 4.0
#define SHIFT_LEFT4 16.0
#define SHIFT_LEFT8 256.0
#define SHIFT_LEFT10 1024.0

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