---
title: Size
order: 5
---

`markdown:docs/common/style.md`

### size

线图层 不仅可以设置宽度，还可以设置线的高度

- size 类型为 number 则表示 line 的宽度
- size 类型为 [number , number] 分别表示宽度和高度

```javascript
lineLayer.size(1); // 线的宽度为 1
lineLayer.size([1, 2]); // 宽度为1，高度2
```
