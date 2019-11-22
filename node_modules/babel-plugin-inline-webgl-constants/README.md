# babel-plugin-inline-webgl-constants

Replaces `gl.<constant>` or `GL.<constant>` references with the corresponding OpenGL constant value.

When used on luma.gl applications, also removes any import of the `GL` namespace.


## Example

#### in

```js
const max = gl.MAX_VERTEX_ATTRIBS;
```

#### out

```js
const max = 34921;
```


#### in

```js
import GL from '@luma.gl/constants';
...
const max = GL.MAX_VERTEX_ATTRIBS;
```

#### out

```js
...
const max = 34921;
```



## Installation

```sh
$ npm install --save-dev babel-plugin-inline-webgl-constants
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["inline-webgl-constants"]
}
```

### Via CLI

```sh
$ babel --plugins inline-webgl-constants script.js
```

### Via Node API

```js
require("babel-core").transform("code", {
  plugins: ["inline-webgl-constants"]
});
```