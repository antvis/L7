# GLSL minifier

[![npm version](https://badge.fury.io/js/glsl-minifier.svg)](https://www.npmjs.com/package/glsl-minifier)
[![dependencies](https://david-dm.org/timvanscherpenzeel/glsl-minifier.svg)](https://david-dm.org/timvanscherpenzeel/glsl-minifier)
[![devDependencies](https://david-dm.org/timvanscherpenzeel/glsl-minifier/dev-status.svg)](https://david-dm.org/timvanscherpenzeel/glsl-minifier#info=devDependencies)

CLI tool for optimizing and minifying GLSL using [aras-p/glsl-optimizer](https://github.com/aras-p/glsl-optimizer) and [stackgl/glsl-min-stream](https://github.com/stackgl/glsl-min-stream). Optimizations include function inlining, dead code removal, copy propagation, constant folding, constant propagation, arithmetic optimizations and so on. Minifications includes variable rewriting and whitespace trimming.

## Installation

```sh
$ npm install -g --save glsl-minifier
```

## Example

```sh
$ node ./bin/glsl-minifier.js -i ./example/example.frag -o ./example/example.min.frag
```

Turns this:

```
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
```

Into this:

```
uniform highp vec2 resolution;uniform sampler2D texture;void main(){highp vec2 a;a=(gl_FragCoord.xy/resolution);lowp vec4 b;b=texture2D(texture,a);if((b.x==1000.0)){discard;}lowp vec4 c;c.w=1.0;c.xyz=vec3((1.0-(sqrt(b.x)/8.0)));gl_FragColor=c;}
```

## Flags

### Default

    -v, --version [print version number]
    -h, --help [print help]

### Required

    -i, --input [example: ./example/example.vert] [required]
    -o, --output [example: ./example/example.min.vert] [required]

### Optional

    -sT, --shaderType [vertex / fragment, default: fragment] (vertex shader / fragment shader) [not required]
    -sV, --shaderVersion [2 / 3, default: 2] (OpenGL ES 2.0 (WebGL1) / OpenGL ES 3.0 (WebGL2)) [not required]

## Licence

My work is released under the [MIT license](https://raw.githubusercontent.com/TimvanScherpenzeel/glsl-minifier/master/LICENSE).

This repository distributes the compiled ASM.js file from Joshua Koo's Emscripten port [zz85/glsl-optimizer](https://github.com/zz85/glsl-optimizer) of the original [aras-p/glsl-optimizer](https://github.com/aras-p/glsl-optimizer) source. This in itself is based on the GLSL optimizer of [Mesa](https://cgit.freedesktop.org/mesa/mesa/log/).
