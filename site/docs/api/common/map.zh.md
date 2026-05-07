## options

### zoom 初始化缩放等级

<description> _number_ </description>

地图初始显示级别 {number} Mapbox （0-24） 高德 （2-19）

### center 地图中心

地图初始中心经纬度 {Lnglat}

### pitch 地图倾角

地图初始俯仰角度 {number} default 0

### bearing 地图偏转角

地图初始旋转角度（相对于正北方向顺时针偏转的度数） {number} default 0

### minZoom 最小缩放等级

地图最小缩放等级 {number} default 0 Mapbox 0-24） 高德 （2-19）

### maxZoom 最大缩放等级

地图最大缩放等级 {number} default 22 Mapbox（0-24） 高德 （2-19）

### minPitch 最小倾角

地图最小俯仰角 {number} default 0

### maxPitch 最大倾角

地图最大俯仰角 {number} default 60

### rotateEnable 是否允许旋转

地图是否可旋转 {Boolean} default true

### interactive 是否允许交互

<description> _boolean_ **optional** _default:_ true</description>

是否允许地图交互（包括鼠标、触摸、键盘等），设为 `false` 后地图变为静态展示状态

### scrollZoom 是否允许滚轮缩放

<description> _boolean_ **optional** _default:_ true</description>

是否启用滚轮缩放交互

### boxZoom 是否允许框选缩放

<description> _boolean_ **optional** _default:_ true</description>

是否启用框选缩放交互（按住 Shift 拖拽）

### dragRotate 是否允许拖拽旋转

<description> _boolean_ **optional** _default:_ true</description>

是否启用拖拽旋转交互

### dragPan 是否允许拖拽平移

<description> _boolean_ **optional** _default:_ true</description>

是否启用拖拽平移交互

### keyboard 是否允许键盘控制

<description> _boolean_ **optional** _default:_ true</description>

是否启用键盘快捷键控制地图

### doubleClickZoom 是否允许双击缩放

<description> _boolean_ **optional** _default:_ true</description>

是否启用双击缩放交互

### touchZoomRotate 是否允许触摸缩放旋转

<description> _boolean_ **optional** _default:_ true</description>

是否启用双指捏合缩放旋转交互

### renderWorldCopies 是否渲染世界副本

<description> _boolean_ **optional** _default:_ true</description>

超出 -180 和 180 经度范围时，是否在两侧重复渲染地图

### maxBounds 地图最大边界范围

限制地图可视范围在指定的地理范围内

### bearingSnap 北向吸附阈值

<description> _number_ **optional** _default:_ 7</description>

当用户旋转地图接近正北方向时，自动吸附到正北方向的角度阈值（度数）

## 地图事件

Scene 统一代理，见 [Scene 文档](/api/scene)

或者

scene.map 直接调用 map 实例方法
