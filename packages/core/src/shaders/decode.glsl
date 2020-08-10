#define SHIFT_RIGHT17 1.0 / 131072.0
#define SHIFT_RIGHT18 1.0 / 262144.0
#define SHIFT_RIGHT19 1.0 / 524288.0
#define SHIFT_RIGHT20 1.0 / 1048576.0
#define SHIFT_RIGHT21 1.0 / 2097152.0
#define SHIFT_RIGHT22 1.0 / 4194304.0
#define SHIFT_RIGHT23 1.0 / 8388608.0
#define SHIFT_RIGHT24 1.0 / 16777216.0

#define SHIFT_LEFT17 131072.0
#define SHIFT_LEFT18 262144.0
#define SHIFT_LEFT19 524288.0
#define SHIFT_LEFT20 1048576.0
#define SHIFT_LEFT21 2097152.0
#define SHIFT_LEFT22 4194304.0
#define SHIFT_LEFT23 8388608.0
#define SHIFT_LEFT24 16777216.0

vec2 unpack_float(float packedValue) {
  int packedIntValue = int(packedValue);
  int v0 = packedIntValue / 256;
  return vec2(v0, packedIntValue - v0 * 256);
}

vec4 decode_color(vec2 encodedColor) {
  return vec4(
    unpack_float(encodedColor[0]) / 255.0,
    unpack_float(encodedColor[1]) / 255.0
  );
}
