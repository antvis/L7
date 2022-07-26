---
title: Use Offline
order: 0
---
`markdown:docs/common/style.md`
目前L7 支持高德和Mapbox两种底图，高德地图由于使用在线API不能做的离线部署，如果你有离线部署的需求可以采用MapBox做底图。L7 在接口层统一了不同底图直接的差异，一套可视化代码可以运行在L7 支持的任意底图上。本文主要介绍如何离线使用，国内加速使用MapBox，同时也提供了在线的字体服务，你也可也下载到本地使用。

### L7 如何引入Mapbox

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'dark',
    center: [ 103.83735604457024, 1.360253881403068 ],
    pitch: 4.00000000000001,
    zoom: 10.210275860702593,
    rotation: 19.313180925794313,
    token:'xxxx'
  })
});

```


### 为什么离线化

- 离线部署
- 国内加速
- 不使用mapbox token

### 如何离线化使用MapBox
你只要不使用MapBox的数据底图服务就可以离线使用，mapbox所有数据服务资源都是在style里面配置的。除了数据服务以外还有一些静态资源，这些主要是图片标注，文字标注的时候使用。

mapbox本身数据资源在国外如果在国内单独部署使用，加载速度体验还是很好的

我们先了解一下MapBox样式包含哪些配置项。

#### Mapbox样式参数

- version：JS SDK对应版本必须为8，
- name：样式的命名，
- sprite：雪碧图，将一个地图涉及到的所有零星图标图片都包含到一张大图中。
- glyphs：.pbf格式的字体样式，例如微软雅黑等字体库。
- sources：图层的资源文件，可以支持矢量切片、栅格、dem栅格、图片、geojson、视频等格式
- layers：是对每个图层样式的描述，这里就是对地图样式渲染的关键，可以做定制化地图样式。

具体参数及其api可以参考mapbox官网

如果做到本地化只需要 sprite，glyphs 本地化就可以了，地图服务可以加载其他服务。

如果你不需要使用MapBox数据服务，可视化层完成用L7渲染那就更简单了

你只需要将MapBox的地图样式设置 `blank`

```javascript
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'blank',
    center: [ 103.83735604457024, 1.360253881403068 ],
    pitch: 4.00000000000001,
    zoom: 10.210275860702593,
    rotation: 19.313180925794313
  })
});
```

blank 样式以为无底图样式，这种样式下就不需要使用mapbox服务，也不需要使用mapbox的token了


#### 本地化雪碧图
如果你需要使用mapbox字段的图片标注，你需要本地化雪碧图资源<br />只需要下载两个文件即可<br />sprite.json 主要记录每个图表在大图上位置<br />sprite.png  每个小图标组成的大图

在线雪碧图服务地址:<br />[https://lzxue.github.io/font-glyphs/sprite/sprite](https://lzxue.github.io/font-glyphs/sprite/sprite)



#### 本地化字体
 如果需要使用mapbox文章标注功能需要本地化，如果你的渲染能力都是用L7实现的，这个过程也是不需要的。

L7 提供了在线字体服务<br /> 目前支持4种字

- 阿里巴巴普惠体
- noto
- opensan
- roboto

_如果你有新的字体需求可提PR，帮你自动生成在线可用的字体服务，你可以在线使用，也可以下载到本地使用。_

字体服务下载：[gh-pages分支](https://github.com/lzxue/font-glyphs/tree/gh-pages) 你可以clone下来直接使用。

**你也可以使用在线服务**<br />**<br />github服务<br />[https://lzxue.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf](https://lzxue.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf)<br />蚂蚁CDN：<br />[https://gw.alipayobjects.com/os/antvdemo/assets/mapbox/glyphs/{fontstack}/{range}.pbf](https://gw.alipayobjects.com/os/antvdemo/assets/mapbox/glyphs/{fontstack}/{range}.pbf)

#### 地图服务本地化
1.加载[第三方底图](https://github.com/htoooth/Leaflet.ChineseTmsProviders)，栅格瓦片图层做底图，如天地图，高德，google的栅格瓦片都可以<br />2.下载[opensteetmap ](https://openmaptiles.com/downloads/planet/)矢量瓦片地图做底图<br />3.自己业务数据发布底图服务，或者矢量瓦片服务。

**这里还有个更完备的解决方案**<br /> [https://jingsam.github.io/foxgis-server-lite/#/](https://jingsam.github.io/foxgis-server-lite/#/)

#### 
所有的服务资源已经准备好了，这样我们就可以独立使用mapbox服务，不需要再申请mapbox的token了

```javascript
 
import { Scene, LineLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: {
        "version": 8,
          "name": "blank",
          "sprite": "https://lzxue.github.io/font-glyphs/sprite/sprite",
          "glyphs": "https://gw.alipayobjects.com/os/antvdemo/assets/mapbox/glyphs/{fontstack}/{range}.pbf",
           "sources": {},
           "layers": [
             {
               id: 'background',
               type: 'background',
               paint: {
                 'background-color': 'white',
               },
             },
           ]
         },
    center: [ 103.83735604457024, 1.360253881403068 ],
    pitch: 4.00000000000001,
    zoom: 10.210275860702593,
    rotation: 19.313180925794313,
    token:'xxxx'
  })
});
```

[d离线，无token使用mapbox demo](https://codesandbox.io/embed/frosty-architecture-tv6uv?fontsize=14&hidenavigation=1&theme=dark)<br />
