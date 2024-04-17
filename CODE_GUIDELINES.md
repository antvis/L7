## 代码风格

### 导入类型

`import` 类型前置加 type 关键字

```typescript
// src/a.ts
import type { Attribute } from './b';
```

不推荐这样：

```typescript
// src/a.ts
import { Attribute } from './b';
```

库入口文件，类型导出需加 type 关键字

```typescript
// src/index.ts
import type { Attribute } from './a';

type MapView = {};

export type { Attribute };
```

### 声明类型

优先使用 type 声明类型

```typescript
type Attribute = {
  color: string;
  size: number;
};
```

不推荐这样：

```typescript
interface IAttribute {
  color: string;
  size: number;
}
```

interface 适用于系统共用接口定义

```typescript
interface IBaseMap {
  color: string;
  size: number;
}

class AMap imimplements IBaseMap {}

class BMap imimplements IBaseMap {}
```

### 文件命名

两个词以上的命名采用`小驼峰加中划线`格式命名，比如：`extrude-polyline.ts`，项目里所有文件命名采用统一格式。

不推荐：

- extrude_polyline.ts
- extrudePolyline.ts

### 变量处理

从参数中声明的变量，变量声明时就处理特殊情况

```typescript
const { attributes = [] } = options;

// or
const attributes = options.attributes ?? [];
```

不推荐：

```typescript
const { attributes } = options;
// or
const attributes = getAttributes();

caculateScales(attributes || []);
```

### 常量命名

常量都采用大写并词以`_`分隔开

```typescript
const DEFAULT_UNIFORM_STYLE = {
  opacity: 1,
  stroke: [1, 0, 0, 1],
  offsets: [0, 0],
  rotation: 0,
  extrusionBase: 0,
  strokeOpacity: 1,
  thetaOffset: 0.314,
};
```

不推荐：

```typescript
const DefaultUniformStyle = {
  opacity: 1,
  stroke: [1, 0, 0, 1],
  offsets: [0, 0],
  rotation: 0,
  extrusionBase: 0,
  strokeOpacity: 1,
  thetaOffset: 0.314,
};

const scaleMap = {};
```

### 类的属性与方法

对用户暴露的属性与方法尽量收敛，代码里对用户不暴露的属性与方法，加上 `private` 关键字

```typescript
class ALayer {
  private contetx: Object;

  private setOptionsAttr() {}
}
```

对用户使用的实验性的属性或方法，可加上`_` 前缀，表示不稳定的属性或方法，下一个版本可能或变动

```typescript
class ALayer {
  public _debug: bool;
}
```

### 代码空格

import 和代码间自动增加空格；注释和文字间自动增加空格

```typescript
import _ from 'lodash';
import get from 'lodash/get';

const Map = () => {};
// 我是注释
```

不推荐：

```typescript
import _ from 'lodash';
import get from 'lodash/get';
const Map = () => {};
//我是注释
```

成员变量/函数自动增加空格

```typescript
class A {
  private a = 1;

  public b() {}

  public c() {}
}
```

不推荐这样

```typescript
class A {
  private a = 1;
  public b() {}
  public c() {}
}
```

## 注释

### 多行注释注释使用标准 JSDoc 注释

给方法添加注释使用多行注释 `/** */`

```typescript
/**
 * 我是干什么的
 * 我还能干什么
 */
function getMapCenter() {}
```

给属性添加多行注释

```typescript
class ALayer {
  /**
   * 我是干什么的
   * 我还能干什么
   */
  public contetx: Object;
}
```

对多行注释统一使用标准 [JSDoc](https://github.com/jsdoc/jsdoc) 注释, 这样还有一个好处, 结合编辑器有更好的代码提示。

不推荐这样：

```typescript
// 我是干什么的
// 我还能干什么
function getMapCenter() {}

class ALayer {
  // 我是干什么的
  // xxx
  public contetx: Object;
}
```

### 使用标签标记不建议使用的方法

已不建议使用的方法

```typescript
/**
 * @deprecated
 * 描述替代 API 方案
 */
function getMapCenter() {}
```

不推荐这样：

```typescript
/**
 * 不建议使用，请使用 getView().center
 */
function getMapCenter() {}
```
