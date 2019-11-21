#define SPREAD 8.00
#define MAX_DIR_LIGHTS 0
#define MAX_POINT_LIGHTS 0
#define MAX_SPOT_LIGHTS 0
#define MAX_HEMI_LIGHTS 0
#define MAX_SHADOWS 0
#define GAMMA_FACTOR 2

uniform mat4 viewMatrix;
uniform vec3 cameraPosition;

uniform vec2 resolution;
uniform float time;
uniform sampler2D texture;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  float v = texture2D( texture, uv ).x;

  if (v == 1000.) discard;
  v = sqrt(v);

  gl_FragColor = vec4( vec3( 1. - v / SPREAD ), 1.0 );
}
