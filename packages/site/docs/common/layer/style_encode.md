#### 样式数据映射
默认样式配置为常量值，某些配置也支持数据映射，映射定义同 color、size参数一致。

- field: 映射字段
- value： 映射区间或者自定义回调函数

如：

```ts
layer.style({
    opacity:{
        field:'name'
        value:[0.1,0.5,1],

    }
})
```