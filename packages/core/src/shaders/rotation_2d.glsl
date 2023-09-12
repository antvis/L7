vec2 rotate_matrix(vec2 v, float a) {
    float b = a / 180.0 * 3.1415926535897932384626433832795;
    float s = sin(b);
    float c = cos(b);
    mat2 m = mat2(c, s, -s, c);
    return m * v;
}