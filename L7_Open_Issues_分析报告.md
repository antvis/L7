# L7 Open Issues 分析报告

生成时间: 2026-03-17 16:27:17

## 统计概览

- **总 Open Issues 数**: 100

### 按类别分布

| 类别            | 数量 |
| --------------- | ---- |
| Bug             | 7    |
| Feature Request | 1    |
| Question        | 1    |
| Documentation   | 0    |
| Help Wanted     | 2    |
| PR              | 2    |
| Other           | 87   |
| **建议关闭**    | 7    |

## 详细分析

### BUG (7 个)

- **#2606** [2024-08-30] @guzicheng90
  - 标题: PolygonLayer mousemove 闪烁 变黑
  - 标签: bug

- **#2605** [2024-08-30] @soulmate126
  - 标题: 使用GoogleMap 作为底图，Marker和Popup绘制报错
  - 标签: bug

- **#2600** [2024-08-28] @ljz779848255
  - 标题: 使用MapTheme和LayerSwitch控件时事件穿透
  - 标签: bug

- **#2595** [2024-08-20] @qrh919
  - 标题: 地图标注物拖拽会变黑
  - 标签: bug

- **#2583** [2024-08-05] @wo-de-ping-er
  - 标题: 蜂窝热力绘制大小，与所设置的值不符？
  - 标签: bug

- **#2569** [2024-07-18] @luojunbang
  - 标题: [LineLayer][greatcircle]当两个点距离太近的时候，会出现折线
  - 标签: bug, help wanted

- **#2555** [2024-06-27] @seanzb
  - 标题: Bubble 图层Style 中 stroke 属性设置成一个透明度为0的rgba颜色时，所有的bubble 会被画成黑色
  - 标签: bug, help wanted

### FEATURE (1 个)

- **#2558** [2024-06-29] @Cannylcn
  - 标题: 官方示例3D地图没有内外发光
  - 标签: help wanted, feature request

### QUESTION (1 个)

- **#2575** [2024-07-23] @gx304419380
  - 标题: 2.22.0版本的高德地图与自建的图层存在偏差
  - 标签: question

### HELP_WANTED (2 个)

- **#2570** [2024-07-18] @luojunbang
  - 标题: [LineLayer][texture]-当 zoom 放大到 12+ 时候，lineLayer.shape('arc')的路径贴图会消失和渲染不完全
  - 标签: help wanted

- **#2567** [2024-07-11] @gongzemin
  - 标题: 腾讯地图scene.on('mouseover')事件不会触发
  - 标签: help wanted

### PR (2 个)

- **#2817** [2026-02-25] @Copilot
  - 标题: fix: correct coordinate rendering offset at maximum zoom via fp64 viewport cente
  - 标签: pr(bugfix)

- **#2796** [2025-12-21] @wujighostking
  - 标题: docs: remove the redundant semicolons
  - 标签: pr(documentation)

### OTHER (87 个)

- **#2810** [2026-01-31] @LiuJianhuo
  - 标题: drawPolygon绘制，光标位置和渲染的点位置偏移严重，
  - 标签: 无标签

- **#2794** [2025-12-05] @hxyAhut
  - 标题: drawPolygon绘制组件在图片上的绘制问题
  - 标签: 无标签

- **#2793** [2025-12-03] @Nickersbb
  - 标题: 图表演示里的圆形扫光城市案例，效果丢失
  - 标签: fixed

- **#2792** [2025-11-25] @lzxue
  - 标题: Feat arrow line
  - 标签: 无标签

- **#2753** [2025-08-22] @yby233
  - 标题: GeoJSON-Vt显示异常
  - 标签: 无标签

- **#2752** [2025-08-19] @liwensai
  - 标题: 官方给的图表演示-栅格图层-Raster image，当放大到一定程度时候，图会向下移动。
  - 标签: 无标签

- **#2751** [2025-08-19] @jony666666
  - 标题: TencentMap 今天开始突然无法自动响应 resize 事件
  - 标签: 无标签

- **#2748** [2025-08-04] @cshmei
  - 标题: 图层click事件获取不到数据？
  - 标签: 无标签

- **#2745** [2025-07-19] @WoodMind
  - 标题: 第三方地图资源配置：使用高德/百度地图（非公网地图资源）
  - 标签: 无标签

- **#2733** [2025-07-04] @xunzhaoliuxingluo
  - 标题: 栅格图层Raster Data在某些位置放大到一定级别会出现错位问题
  - 标签: 无标签

## 建议关闭的 Issue (7 个)

### #2697: cylinder 在 mapbox 高度错误且 heightfixed 失效

- **原因**: 标题表明已解决，建议关闭
- **作者**: @KINGZSY
- **创建日期**: 2025-04-17
- **标签**: 无

**内容摘要**:

```
### 问题描述

cylinder 在 mapbox 高度错误且 heightfixed 失效

### 重现链接

_No response_

### 重现步骤

_No response_

### 预期行为

_No response_

### 平台

- 操作系统: [macOS, Windows, Linux, React Native ...]
- 网页浏览器: [Google ...
```

### #2575: 2.22.0版本的高德地图与自建的图层存在偏差

- **原因**: 过时的问题，建议关闭
- **作者**: @gx304419380
- **创建日期**: 2024-07-23
- **标签**: question

**内容摘要**:

```
### 问题描述

新版本的高德地图与自建的图层存在偏差：
![image](https://github.com/user-attachments/assets/023934d8-1b16-480a-a1b2-ac5772a9d663)
老版本没有这个问题

### 重现链接

_No response_

### 重现步骤

_No response_

### 预期行为

_No res...
```

### #2570: [LineLayer][texture]-当 zoom 放大到 12+ 时候，lineLayer.shape('arc'

- **原因**: 过时的帮助请求，建议关闭
- **作者**: @luojunbang
- **创建日期**: 2024-07-18
- **标签**: help wanted

**内容摘要**:

```
### 问题描述

[例子1](https://l7.antv.antgroup.com/examples/gallery/animate/#animate_path_texture)

当 shape 修改为 arc 时候，动画消失

[例子2](https://l7.antv.antgroup.com/zh/examples/line/animate/#plane_animate2)
...
```

### #2569: [LineLayer][greatcircle]当两个点距离太近的时候，会出现折线

- **原因**: 过时的帮助请求，建议关闭
- **作者**: @luojunbang
- **创建日期**: 2024-07-18
- **标签**: bug, help wanted

**内容摘要**:

````
### 问题描述

```import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: ...
````

### #2567: 腾讯地图scene.on('mouseover')事件不会触发

- **原因**: 过时的帮助请求，建议关闭
- **作者**: @gongzemin
- **创建日期**: 2024-07-11
- **标签**: help wanted

**内容摘要**:

```
### 问题描述

腾讯地图scene.on('mouseover')事件不会触发，高德地图可以。packages/maps/src/tmap/map.ts，    this.map.on(eventName, handleProxy); this.map执行到这里为undefined.
<img width="893" alt="image" src="https://github.com/a...
```

### #2558: 官方示例3D地图没有内外发光

- **原因**: 过时的帮助请求，建议关闭
- **作者**: @Cannylcn
- **创建日期**: 2024-06-29
- **标签**: help wanted, feature request

**内容摘要**:

```
### 问题描述

<img width="1187" alt="WechatIMG217" src="https://github.com/antvis/L7/assets/29397178/1ece884f-ff83-4012-a2a8-5131ea46ad4f">
在官网的示例中看到添加了atomLayer和bloomLayer，但是也没看到发光效果

### 重现链接

_No resp...
```

### #2555: Bubble 图层Style 中 stroke 属性设置成一个透明度为0的rgba颜色时，所有的bubble 会被画成黑

- **原因**: 过时的帮助请求，建议关闭
- **作者**: @seanzb
- **创建日期**: 2024-06-27
- **标签**: bug, help wanted

**内容摘要**:

```
### 问题描述

Bubble 图层Style 中 stroke 属性设置成一个透明度为0的rgba颜色时，所有的bubble 会被画成黑色
![image](https://github.com/antvis/L7/assets/173980036/7b00ae4c-5cc2-4e62-8916-960386ca6aba)


### 重现链接

https://codesandbox.i...
```
