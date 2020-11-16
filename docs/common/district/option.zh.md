#### layerOption 图片配置

 下钻各个层级的配置项，可以独立配置，每一层级的样式，不设置和上一层就保持一致
  - joinBy: [string, string];
  - label: Partial<ILabelOption>;
  - bubble: Partial<IBubbleOption>;
  - fill: Partial<IFillOptions>;
   ⛔中国地图视角设置，省界，海岸线，宽度通过以下属性
  - chinaNationalStroke 中国国界线颜色 
  - chinaNationalWidth 中国国界线宽度 
  - coastlineStroke 海岸线颜色 
  - coastlineWidth 海岸线宽度 
  - nationalWidth 国界线 
  - nationalStroke 国界线 
  - provinceStroke 省界颜色 
  - provinceStrokeWidth 省界宽度 
