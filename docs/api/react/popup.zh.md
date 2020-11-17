---
title: Popup 组件
order: 4
---

`markdown:docs/common/style.md`

## Popup Props

| prop name | Type              | Default | Description      |
| --------- | ----------------- | ------- | ---------------- |
| option    | `string`          | `null`  | popup 配置项     |
| lnglat    | `Array | Object`  | `null`  | popup 经纬度位置 |
| children  | `React.ReactNode` | `null`  | 子组件           |

### option

| prop name    | Type         | Default | Description                                                                    |
| ------------ | ------------ | ------- | ------------------------------------------------------------------------------ |
| closeButton  | `string`     | `true`  | 是否显示关闭按钮                                                               |
| closeOnClick | `string`     | `blue`  | 点击是否关闭 popup                                                             |
| anchor       | `string`     | `null`  | center, top, top-left, top-right, bottom, bottom-left,bottom-right,left, right |
| offsets      | `Array[x,y]` | `null`  | popup 位置偏移                                                                 |
| className    | `string`     | `null`  | 样式名称                                                                       |

```jsx
import { Popup } from '@antv/l7-react';

<Popup option={{
  closeOnClick: false;// 如果Popup内需要响应Dom事件需设置成false,否则事件不生效
}} lnglat={[]} />;
```

[popup 使用完整 demo](../../../examples/react/covid#covid_bubble)
