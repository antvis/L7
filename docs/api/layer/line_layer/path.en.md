---
title: Path
order: 1
---
用一组首尾不闭合的点坐标对来定位的线图层，通常用来表示轨迹，线路，道路等

## 使用

### shape
shape 设置成line即可绘制路线图
- line 

### size
路径图线的size支持两个维度

- width 宽度
- height 高度

```javascript
 layer.size([2,10]) // 绘制宽度为2，高度为10的路径
 
 layer.size('height',[])
```
### animate

#### 开启关闭动画

```javascript
layer.animate(true)
layer.animate(false)
```

#### 设置动画参数

- duration 动画时间 单位(s)秒
- interval 轨迹间隔, 取值区间 0 - 1
- trailLength 轨迹长度 取值区间 0 - 1

```javascript
layer.animate({
  duration: 4,
  interval: 0.2,
  trailLength: 0.1
  
})
```



