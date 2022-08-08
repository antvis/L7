### bubble 气泡配置项
  - enable
   `boolean` 是否显示气泡 `true`
  - shape: 
   AttributeType; 气泡形状支持数据映射
  - size:
    AttributeType; 气泡大小支持数据映射
  - color: 
    AttributeType; 气泡颜色支持数据映射
  - scale: { // 数字度量
    field: string; 度量字段
    type: ScaleTypeName; 度量字段
  };
  - style: {
    opacity: number; 透明度
    stroke: string; 填充色
    strokeWidth: number; 填充宽度
  };
