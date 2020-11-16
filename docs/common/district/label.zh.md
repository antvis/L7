### labelOption 标注配置项
  文本标注配置项，目前只支持常量配置，不支持数据映射
  - enable `boolean` 是否显示标注
      - color 标注字体颜色 常量
      - field 标注字段 常量
      - size 标注大小 常量
      - stroke 文字描边颜色
      - strokeWidth 文字描边宽度
      - textAllowOverlap 是否允许文字压盖
      - opacity 标注透明度
      - spacing:  `number` 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
      - padding:  `[number, number]`  文本相对锚点的偏移量 [x, y]
      其他包括 text [style 的配置](../layer/point_layer/text#style)
