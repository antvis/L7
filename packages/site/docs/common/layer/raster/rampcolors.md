### rampColors 颜色色带
- type 类型 支持 `linear','quantize','custom','cat'
- colors  颜色数组
- positions 数据分段区间，可选，quantize 不需要设置 position，position 为原始数据值

⚠️ 2.13 新增特性

#### cat 枚举类型色带

枚举类型色带只支持 0 -255 的整数类型，positions 用来设置枚举
```tsx
{
  type:'cat',
  colors:['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00'],
  positions:[1,20,101,102,200],
}
```

#### quantize 等间距分类色带

等间距只根据数据的区间 domain 进行均匀分段，如 domain [0,10000]，如果分 5 段，每段间距 2000。
等间距不需要设置 positions，只需要设置colors，根据colors 的长度设置分段数

```tsx
rampColors: {
  type:'quantize',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac']
}
```
#### linear 线性连续色带

linear 为现有连续类型的加强版，positions 支持设置源数据，不需要转换成 0-1

```tsx
rampColors: {
  type:'linear',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'],
  positions [0,200,1000,4000,8000]
}

⚠️ 兼容 2.13.0 之前版本，未设置type 时，position 值域为 0-1。



```

#### custom 自定义分段色带

自定义分段色带区别等间距色带，用户自定义分段间隔。
自定义 positions 的长度需要比 colors 的长度多1个，同时poisitions 

```tsx
rampColors: {
  type:'custom',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'],
  positions [0,200,1000,4000,8000,10000]
}
```



配置值域映射颜色的色带，值域的范围为 `[0 - 1]`, 对应的我们需要为每一个 `position` 位置设置一个颜色值。

⚠️ colors, positions 的长度要相同

```javascript
layer.style({
  rampColors: {
    colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'],
    positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  },
});