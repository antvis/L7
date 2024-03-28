## options

### zoom 初始化缩放等级

<description> _number_ </description>

地图初始显示级别 {number} Mapbox （0-24） 高德 （2-19）

### center 地图中心

地图初始中心经纬度 {Lnglat}

### pitch 地图倾角

地图初始俯仰角度 {number}  default 0

### minZoom 最小缩放等级

地图最小缩放等级 {number}  default 0 Mapbox 0-24） 高德 （2-19）

### maxZoom 最大缩放等级

地图最大缩放等级 {number}  default 22 Mapbox（0-24） 高德 （2-19）

### rotateEnable 是否允许旋转

地图是否可旋转 {Boolean} default true

## 地图事件

Scene 统一代理，见 [Scene 文档](/api/scene)

或者

scene.map 直接调用 map 实例方法
