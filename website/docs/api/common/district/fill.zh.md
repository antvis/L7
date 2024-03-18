### fill  填充图样式
  - color 图层填充颜色，支持常量和数据映射
      常量：统一设置成一样的颜色
      数据映射
      - field 填充映射字段
      - values  映射值，同color方法第二个参数数组，回调函数
  - filter 图层过滤方法，支持常量和数据映射 同layer.filter方法
      数据映射
          - field 填充映射字段
          - values  回调函数 `false` 返回值将会被过滤掉
  - style 同 polygonLayer的style方法
  - activeColor 鼠标滑过高亮颜色,  `string | boolean` 如果设置为 `false`取消高亮
