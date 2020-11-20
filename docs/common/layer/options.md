### name
<description> _string_ **可选** _default:_ 自动数字编号</description>

设置图层名称,可根据 name 获取 layer;

### visible
<description> _bool_ **可选** _default:_ `true`</description>

图层是否可见

### zIndex
<description> _int_ **可选** _default:_ `0`</description>

图层绘制顺序，数值大绘制在上层，可以控制图层绘制的上下层级

### minZoom
<description> _number_ **可选** _default:_ `0`</description>

图层显示最小缩放等级，（0-18）   {number}  Mapbox （0-24） 高德 （3-18）

### maxZoom
<description> _number_ **可选** _default:_ `22`</description>
图层显示最大缩放等级 （0-18）   {number}  Mapbox （0-24） 高德 （3-18）

### autoFit
<description> _bool_ **可选** _default:_ `false`</description>

layer 初始化完成之后，是否自动缩放到图层范围 {bool } default false

### pickingBuffer

<description> _number_ **可选** _default:_ `0`</description>

图层拾取缓存机制，如 1px 宽度的线鼠标很难拾取(点击)到, 通过设置该参数可扩大拾取的范围 {number} default 0

### blend
<description> _string_ **可选** _default:_ `normal`</description>

图层元素混合效果

- normal 正常效果 默认
- additive 叠加模式
- subtractive 相减模式
- max 最大值
