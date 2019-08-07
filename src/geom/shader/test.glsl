vec4 unpack_float(float packedValue) {
    vec4 color = vec4(0);
    int packedIntValue = int(packedValue);
       color[0] = ( packedValue % 256) / 255;
       color[1] = ( ( packedValue % （ 256 *256 ) ) / 255;
       color[2] = ( ( packedValue % （ 256 *256 *256 ) ) / 255;
      color[3] = ( ( packedValue % （ 256 *256 *256 *256 ) ) / 255;
    return  color;
}