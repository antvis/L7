# L7 Large-scale WebGL-powered Geospatial Data Visualization

[L7官网](http://antv.alipay.com/zh-cn/l7/1.x/index.html)


## 安装
### 
### 加载高德地图

L7 目前底图采用高德地图，因此使用之前你还需要使用开发者 Key，你可以使用适用于『Web端』开发者 Key。如果没有可以点击 [这里申请](https://lbs.amap.com/dev/key/)。
申请开发者 Key 是免费的。如果指定错误的版本号和开发者 Key，将无法加载 L7。目前最新版本请参考[这里](https://lbs.amap.com/api/loca-api/changelog)，如果不指定版本号，则使用最新版本。
 在你的页面引入高德地图API
```html
<script src="https://webapi.amap.com/maps?v=1.4.8&key=您申请的key值"></script>
```


### HTML 引入 L7

既可以通过将脚本下载到本地也可以直接引入在线资源；

```html
<!-- 引入在线资源 -->
<script src="https://gw.alipayobjects.com/os/antv/pkg/_antv.l7-1.0.0/dist/l7.min.js"></script>
```
  
### 通过 npm 安装

我们提供了 L7  npm 包，通过下面的命令即可完成安装

```bash
npm i @antv/l7 --save
```

成功安装完成之后，即可使用 `import` 或 `require` 进行引用。

```javascript
import L7 from '@antv/l7';
// 新建Scene
```

[L7官网](http://antv.alipay.com/zh-cn/l7/1.x/index.html)



# L7


## Development

```bash
$ npm install

# run test case
$ npm run test-live

# build watching file changes and run demos
$ npm run start

# run demos
$ npm run demos
```


## How to Contribute
