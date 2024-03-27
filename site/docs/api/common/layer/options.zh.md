### name

<description> _string_ **optional** _default:_ 自动数字编号</description>

设置图层名称,可根据 name 获取 layer

```javascript
scene.getLayerByName(name);
```

### visible

<description> _bool_ **optional** _default:_ true</description>

图层是否可见

### zIndex

<description> _int_ **optional** _default:_ 0</description>

图层绘制顺序，数值大绘制在上层，可以控制图层绘制的上下层级

L7 采用队列渲染的机制，所有的图层在内部保存在一个数组中，每一帧的渲染会将图层数组按照 zIndex 的值进行排序，然后遍历数组，将符合条件的图层渲染到场景中

### minZoom

<description> _number_ **optional** _default:_ Mapbox （0-24） 高德 （2-19)</description>

图层显示最小缩放等级

### maxZoom

<description> _number_ **optional** _default:_ Mapbox （0-24） 高德 （2-19)</description>

图层显示最大缩放等级

### autoFit

<description> _bool_ **optional** _default:_ false</description>

layer 初始化完成之后，地图是否自动缩放到图层范围

### pickingBuffer

<description> _bool_ **optional** _default:_ 0</description>

图层拾取缓存机制，如 1px 宽度的线鼠标很难拾取(点击)到, 通过设置该参数可扩大拾取的范围（放大图层对象的尺寸）

### blend

<description> _string_ **optional** _default:_ 'normal'</description>

图层元素混合效果

- normal 正常效果 默认 发生遮挡的时候，只会显示前面的图层的颜色
- additive 叠加模式 发生遮挡的时候，显示前后图层颜色的叠加
- subtractive 相减模式 发生遮挡的时候，显示前后图层颜色的相减
- max 最大值 发生遮挡的时候，显示图层颜色 rgb 的最大值

### enablePropagation

<description> _boolean_ **optional** _default:_ 'false'</description>
图层事件，默认只响应最上层图层，设置为true 将允许事件透传

<embed src="@/docs/api/common/layer/mask_options.zh.md"></embed>
