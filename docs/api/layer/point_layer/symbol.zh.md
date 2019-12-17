---
title: 符号图
order: 4
---
在地理区域上放置不同图片作为符号，通常表示不同地理要素分布情况



## 使用

符号图 通过PointLayer对象实例化，将shape设置成图片符号

### shape

通过scene addImage 方法

addImage()
 参数：
 - id 图片的id,
 - url 图片的url
 
 ```javascript
 scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg'
  );

⚠️ 符号图的ID不能与点图层已有shape名称相同，比如不能设置 circle

```

符号图需要把shape设置成图片的id，同样符号图shape也支持数据映射

```javascript
const scatter = 
new PointLayer()
    .source(data)
    .shape('00')
    .size(5)
    .color('red')
    .style({
      opacity: 0.3,
      strokeWidth: 1
    })
```
## 相关demo
