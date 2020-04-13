# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.1.12](https://github.com/antvis/L7/compare/v2.1.11...v2.1.12) (2020-04-10)


### Bug Fixes

* 采用非偏移坐标系坐标系解决高德地图中国区域抖动的问题 ([124a1d2](https://github.com/antvis/L7/commit/124a1d27aa97c9a6af1de6d041785c420f02ce4c))
* **heatmap:** 修复热力图某些设备上黑色 fix [#278](https://github.com/antvis/L7/issues/278) ([b8f5899](https://github.com/antvis/L7/commit/b8f58992d1fce38fdaac9d82ebfbec14e35298bd))





## [2.1.11](https://github.com/antvis/L7/compare/v2.1.10...v2.1.11) (2020-04-07)

**Note:** Version bump only for package @antv/l7-layers





## [2.1.8](https://github.com/antvis/L7/compare/v2.1.7...v2.1.8) (2020-03-26)


### Bug Fixes

* 3d 热力图抖动问题 fixes [#138](https://github.com/antvis/L7/issues/138) [#263](https://github.com/antvis/L7/issues/263) ([d56e8d6](https://github.com/antvis/L7/commit/d56e8d6205942ca12fa7ac3dfd226aecbb850ed2))





## [2.1.7](https://github.com/antvis/L7/compare/v2.1.6...v2.1.7) (2020-03-26)


### Bug Fixes

* 修复颜色纹理取色问题 & 图片标注默认颜色问题 ([9d6b198](https://github.com/antvis/L7/commit/9d6b198f76b44c55ce0a094c6649c9e4130a398b))





## [2.1.5](https://github.com/antvis/L7/compare/v2.1.4...v2.1.5) (2020-03-20)

**Note:** Version bump only for package @antv/l7-layers





## [2.1.3](https://github.com/antvis/L7/compare/v2.0.36...v2.1.3) (2020-03-17)


### Bug Fixes

* fix build layer opactiy ([5a58ab8](https://github.com/antvis/L7/commit/5a58ab8f86ec969ca384e984784355c2c91b1a47))
* merge conflict ([89c8cb2](https://github.com/antvis/L7/commit/89c8cb2c0250eb5a28d96d82c87b804bf3db4c30))
* 图层不可见,取消拾取 ([f4abe6a](https://github.com/antvis/L7/commit/f4abe6a6b91d9d568573018ed4cad6cf01c592d3))





## [2.1.2](https://github.com/antvis/L7/compare/v2.0.36...v2.1.2) (2020-03-15)


### Bug Fixes

* merge conflict ([89c8cb2](https://github.com/antvis/L7/commit/89c8cb2c0250eb5a28d96d82c87b804bf3db4c30))
* 图层不可见,取消拾取 ([f4abe6a](https://github.com/antvis/L7/commit/f4abe6a6b91d9d568573018ed4cad6cf01c592d3))





## [2.1.1](https://github.com/antvis/L7/compare/v2.0.36...v2.1.1) (2020-03-15)

**Note:** Version bump only for package @antv/l7-layers





## [2.0.34](https://github.com/antvis/L7/compare/v2.0.32...v2.0.34) (2020-03-02)

**Note:** Version bump only for package @antv/l7-layers





# [2.0.0-beta.28](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.28) (2020-01-02)


### Bug Fixes

* **pointlayer:** point amimate ([fd66d90](https://github.com/antvis/L7/commit/fd66d90c1dad1925d1b8a3c99e89172a16bb9f60))
* animate time ([d2b8041](https://github.com/antvis/L7/commit/d2b8041ebe77753f5687383ce690950b745f748c))
* layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
* 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
* **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
* **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))


### Features

* add raster layer ([2b28380](https://github.com/antvis/L7/commit/2b2838015198b8586b0c30fdc154116252a76f29))
* point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
* polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
* **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
* **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
* **layer:** add setSelect setActive 方法 & refactor color  util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
* **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
* scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
* **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
* **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))





# [2.0.0-beta.27](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.27) (2020-01-01)


### Bug Fixes

* **pointlayer:** point amimate ([fd66d90](https://github.com/antvis/L7/commit/fd66d90c1dad1925d1b8a3c99e89172a16bb9f60))
* animate time ([d2b8041](https://github.com/antvis/L7/commit/d2b8041ebe77753f5687383ce690950b745f748c))
* layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
* 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
* **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
* **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))


### Features

* point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
* polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
* **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
* **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
* **layer:** add setSelect setActive 方法 & refactor color  util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
* **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
* scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
* **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
* **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))





# [2.0.0-alpha.28](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-alpha.28) (2020-01-01)


### Bug Fixes

* animate time ([d2b8041](https://github.com/antvis/L7/commit/d2b8041ebe77753f5687383ce690950b745f748c))
* layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
* 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
* **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
* **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))


### Features

* point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
* polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
* **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
* **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
* **layer:** add setSelect setActive 方法 & refactor color  util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
* **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
* scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
* **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
* **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))





# [2.0.0-alpha.27](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-alpha.27) (2019-12-31)


### Bug Fixes

* animate time ([d2b8041](https://github.com/antvis/L7/commit/d2b8041ebe77753f5687383ce690950b745f748c))
* layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
* 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
* **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
* **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))


### Features

* point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
* polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
* **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
* **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
* **layer:** add setSelect setActive 方法 & refactor color  util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
* **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
* scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
* **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
* **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))





# [2.0.0-beta.26](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.26) (2019-12-30)


### Bug Fixes

* animate time ([d2b8041](https://github.com/antvis/L7/commit/d2b8041ebe77753f5687383ce690950b745f748c))
* layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
* 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
* **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
* **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))


### Features

* point text add overlap ([98869d8](https://github.com/antvis/L7/commit/98869d876b0e98dd9258c97b9be9f5a69c0a1612))
* polygon 支持text ([f5a1546](https://github.com/antvis/L7/commit/f5a15465e230e6f58c92bec5f12b132bc9a9ae91))
* **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
* **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
* **layer:** add setSelect setActive 方法 & refactor color  util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
* **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
* scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
* **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
* **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))





# [2.0.0-beta.25](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.25) (2019-12-27)


### Bug Fixes

* 高德地图底图模式,事件交互注册顺序的问题导致不生效 ([2ad4289](https://github.com/antvis/L7/commit/2ad4289e75519f956a9cb1b44a7231b1151c88fb))
* layer style storkeColor->stroke ([27f66a9](https://github.com/antvis/L7/commit/27f66a9918a3568f7f591af161953ac498d2dcba))
* **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
* **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))


### Features

* **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
* **layer:** add citybuildinglayer & add line add animate ([d657286](https://github.com/antvis/L7/commit/d657286d58c795ba968ae930eb382ca422bdbd08))
* **layer:** add setSelect setActive 方法 & refactor color  util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
* **layer:** pointLayer add text model ([84a9193](https://github.com/antvis/L7/commit/84a9193e3a8a311bb52bbedabc8847eabba7dc9a))
* scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
* **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
* **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))





# [2.0.0-beta.24](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.24) (2019-12-23)


### Bug Fixes

* **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
* **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))


### Features

* **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
* **layer:** add setSelect setActive 方法 & refactor color  util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
* scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
* **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
* **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))





# [2.0.0-beta.23](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.23) (2019-12-23)


### Bug Fixes

* **layer:** fix default model config ([2301419](https://github.com/antvis/L7/commit/2301419aadf00a887fc22728b9797e6c1149bead))
* **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))


### Features

* **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
* **layer:** add setSelect setActive 方法 & refactor color  util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
* scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
* **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
* **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))





# [2.0.0-beta.21](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.21) (2019-12-18)


### Bug Fixes

* **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))


### Features

* **layer:** add blend 效果配置支持 normal,additive ([e0ab4cd](https://github.com/antvis/L7/commit/e0ab4cd386f53ba4e93aaebfb1fa05b6e438710e))
* **layer:** add setSelect setActive 方法 & refactor color  util ([5c27d66](https://github.com/antvis/L7/commit/5c27d66a6401192f5e0406a2f4c3e0983dc2867c))
* scene 实例化支持传入地图实例 & 更新文档 ([cb1d4b6](https://github.com/antvis/L7/commit/cb1d4b6c7d0e65a5e15138ae01adb56cd1b6ee43))
* **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
* **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))





# [2.0.0-beta.20](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.20) (2019-12-12)


### Bug Fixes

* **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))


### Features

* **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))
* **source render:** source transfrom, layer event ([27a09a7](https://github.com/antvis/L7/commit/27a09a7a7a79b50598af22a0de18b062d60afcac))





# [2.0.0-beta.19](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.19) (2019-12-08)


### Bug Fixes

* **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))


### Features

* **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))





# [2.0.0-beta.18](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.18) (2019-12-08)


### Bug Fixes

* **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))


### Features

* **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))





# [2.0.0-beta.17](https://github.com/antvis/L7/compare/v2.0.0-beta.16...v2.0.0-beta.17) (2019-12-08)


### Bug Fixes

* **scene:** contianer resize ([1c3be82](https://github.com/antvis/L7/commit/1c3be82711999b70a802a7f0c24ff9ccf76e2d94))


### Features

* **source:** wip cluster ([3203959](https://github.com/antvis/L7/commit/320395942499b4123de2155d20ff6cecec6100b9))





# [2.0.0-beta.16](https://github.com/antvis/L7/compare/v2.0.0-beta.15...v2.0.0-beta.16) (2019-11-29)

**Note:** Version bump only for package @antv/l7-layers





# [2.0.0-beta.15](https://github.com/antvis/L7/compare/v2.0.0-beta.14...v2.0.0-beta.15) (2019-11-29)

**Note:** Version bump only for package @antv/l7-layers





# [2.0.0-beta.14](https://github.com/antvis/L7/compare/v2.0.0-beta.13...v2.0.0-beta.14) (2019-11-28)

**Note:** Version bump only for package @antv/l7-layers





# [2.0.0-beta.13](https://github.com/antvis/L7/compare/v2.0.0-beta.12...v2.0.0-beta.13) (2019-11-28)

**Note:** Version bump only for package @antv/l7-layers





# [2.0.0-beta.12](https://github.com/antvis/L7/compare/v2.0.0-beta.11...v2.0.0-beta.12) (2019-11-28)


### Bug Fixes

* **component:** fix marker ([14d4818](https://github.com/antvis/L7/commit/14d48184a1579241b077110ed51a8358de25e010))





# 2.0.0-beta.11 (2019-11-28)


### Bug Fixes

* **demo:** bugs ([5a857f9](https://github.com/antvis/L7/commit/5a857f9c1b707c91cbc07b0fc4878be3fe56011b))
* **demo:** demo ([a4e49a6](https://github.com/antvis/L7/commit/a4e49a6f6b25f585ba224f6d92fafd5cb5e0113f))
* **demo:** gatsby ([5faac23](https://github.com/antvis/L7/commit/5faac2306c34ac8f3a02fdc61ad18337a4df7f49))
* **demo:** gatsby ([b6a1785](https://github.com/antvis/L7/commit/b6a1785a0ba432134495f6d9ac65f92ecc045fe8))
* **demo:** update demo ([3ae610f](https://github.com/antvis/L7/commit/3ae610f81421fb2720966dde76f5988dac8acc02))
* **doc:** file name lowercase ([3cbdc9c](https://github.com/antvis/L7/commit/3cbdc9c7f1d9be34e9c917f05531323946993eb4))
* **fix confilict:** conflict ([8a09ae2](https://github.com/antvis/L7/commit/8a09ae24bef7ba845e5b16759b3ecac210e472c5))
* **fix css:** fix css png ([f7e5376](https://github.com/antvis/L7/commit/f7e5376b7d6c64b2b078dca8f2a230f4fce14c68))
* **layer:** fix merge conflict ([6f33e5f](https://github.com/antvis/L7/commit/6f33e5f72bc9e72202db12a059dcd6c88da41084))
* **layers:** heatmap 3d effect ([38d1736](https://github.com/antvis/L7/commit/38d173610fbf729dfc3a6fae94ad27bb68f33cb8))
* **layers:** heatmap 3d effect ([c99bb27](https://github.com/antvis/L7/commit/c99bb27d94ad9b6b1e85b7b153953dd2a7455db8))
* **layerservice:** fix init bugs in layer service ([8cbbf7b](https://github.com/antvis/L7/commit/8cbbf7b28d63f4df16f061a4ae21726f243e7108))
* **layerservice:** fix init bugs in layer service ([8844243](https://github.com/antvis/L7/commit/8844243050f619b28043c4e9ed1942fe172f561e))
* **map:** use P20 offset coordinates ([393e891](https://github.com/antvis/L7/commit/393e891a22098db3bcfb036a7182a45238ca6a73)), closes [#94](https://github.com/antvis/L7/issues/94)
* **master:** merge master branch fix conflict ([2ea903e](https://github.com/antvis/L7/commit/2ea903ee3f17bfdb670abfb1d252de8b6222b19f))
* **merge:** fix conflict ([07e8505](https://github.com/antvis/L7/commit/07e85059ebd40506623253feb624ee3083f393ae))
* **merge:** merge next branch ([30597d9](https://github.com/antvis/L7/commit/30597d9a45a728dac230f30ad18c787c7beb4163))
* **merge branch:** fix confilt ([e7a46a6](https://github.com/antvis/L7/commit/e7a46a691d9e67a03d733fd565c6b152ee8715b6))
* **packages:** remove sub modules node_modules ([132b99e](https://github.com/antvis/L7/commit/132b99e4d2bef7ec5565a0b18c5659e8b246944b))
* **raster layer:** raster layer triangle ([cce659a](https://github.com/antvis/L7/commit/cce659aaa1fda8e6964bc6c839b875fa05a89c7d))
* **raster layer:** update raster triangle ([b0f6265](https://github.com/antvis/L7/commit/b0f6265cd3b16c6ff39d0a6693788a25fca7bda2))
* **rm cache:** rm cache ([51ea07e](https://github.com/antvis/L7/commit/51ea07ea664229f775b7c191cfde68299cc8c2d5))
* **site:** megre conflict ([1b5619b](https://github.com/antvis/L7/commit/1b5619b3945e97919e0c616a48ba2265a2a95c22))
* **stories:** conflict ([f7be720](https://github.com/antvis/L7/commit/f7be720db1753b1b3643c0f3669c40d4b712f37b))
* **tslint:** fix tslint error ([aed5e9e](https://github.com/antvis/L7/commit/aed5e9e51b5dd214cc19baece7dd0138b336a5d5))


### Features

* **add l7 site:** add websites ([0463ff8](https://github.com/antvis/L7/commit/0463ff874eab1c484b593e8c02f73c85a02c000c))
* **add point demo:** add demo ([90f6945](https://github.com/antvis/L7/commit/90f6945feb4818842c6231f5b5683db6cda15a73))
* **component:** add layer control ([7f4646e](https://github.com/antvis/L7/commit/7f4646efd3b0004fde4e9f6860e618c7668af1a7))
* **component:** add scale ,zoom, popup, marker map method ([a6baef4](https://github.com/antvis/L7/commit/a6baef4954c11d9c6582c27de2ba667f18538460))
* **core:** add map method ([853c190](https://github.com/antvis/L7/commit/853c1901fbb8559a9d3bdb3631ec13a7dcaf0ea7))
* **demo:** add point chart demo ([8c2e4a8](https://github.com/antvis/L7/commit/8c2e4a82bf7a49b29004d5e261d8e9c46cd0bd9d))
* **layer:** 新增sourceplugin, attribute 增加类型判断 ([2570b8c](https://github.com/antvis/L7/commit/2570b8c242af29bae07640b1ec7eaadfb04ec9d6))
* **layer:** add arc2d layer ([420459c](https://github.com/antvis/L7/commit/420459ce5aee91dc8d6f770a2a2078c7e5bca4bf))
* **layer:** add imagelayer ([a995815](https://github.com/antvis/L7/commit/a995815284652ca5d6e013c547b617fa52039ddc))
* **layer:** add point line polygon image layer ([54f28be](https://github.com/antvis/L7/commit/54f28be495af94a39313b7840c69725be16dc1e2))
* **layer:** point layer ([3da72c8](https://github.com/antvis/L7/commit/3da72c83ff0577455a29ba98df4bb7cd8838328a))
* **layers:** add arclayer ([7e499fd](https://github.com/antvis/L7/commit/7e499fdc877d9715000c138a5d3505924ebd083e))
* **layers:** add girdheatmap  add raster imagelayer ([ddd1d0e](https://github.com/antvis/L7/commit/ddd1d0ef38cc44767d2ec5329eb844c31d847938))
* **layers:** add heatmap 3d layer ([cd8409e](https://github.com/antvis/L7/commit/cd8409e4cb234f850f2d46dd68b35f4848daf74b))
* **layers:** add heatmap layer ([e04b3b2](https://github.com/antvis/L7/commit/e04b3b268b9fdc4bea150d2db1fdaae227f51fc8))
* **layers:** add polygon3d , pointimagelayer ([75f2eaa](https://github.com/antvis/L7/commit/75f2eaa083064ff21c8bbe13f5f6770682c23241))
* **layers:** add polygon3d , pointimagelayer ([bda6b6c](https://github.com/antvis/L7/commit/bda6b6cfb06193f6ae83e505a9c8667811d80a2f))
* **multi-pass:** support TAA(Temporal Anti-Aliasing) ([2cf0824](https://github.com/antvis/L7/commit/2cf082439ad04eb84b96b2922e45082476452aec))
* **picking:** support advanced picking API: `layer.pick({x, y})` ([3e22f21](https://github.com/antvis/L7/commit/3e22f21a5c658e4ade31c0506bd77ae787ec2fcc))
* **picking:** support PixelPickingPass and highlight the picked feature ([ff0ffa0](https://github.com/antvis/L7/commit/ff0ffa057e2f533dc6ac92f40d3892f9dd57fafb))
* **point image:** add point image ([89b2513](https://github.com/antvis/L7/commit/89b25133a17f308c3e884c49baebcd3cc7a9470a))
* **post-processing:** add some post processing effects ([1d8e15c](https://github.com/antvis/L7/commit/1d8e15cec11abc62785bc68c8281550732550839))
* **scene:** scene service inTransientScope ([ccf1ff4](https://github.com/antvis/L7/commit/ccf1ff464e1b220650e61c0999846725b075ef3a))
* **schema-validation:** support validation for layer's options ([9c5766d](https://github.com/antvis/L7/commit/9c5766d0e37958d67f7072d465f51e2aa3d53939))
