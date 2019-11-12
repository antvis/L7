# IoC 容器、依赖注入与服务说明

在面向对象编程领域，[SOLID](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)) 、[“组合优于继承”](https://en.wikipedia.org/wiki/Composition_over_inheritance) 都是经典的设计原则。

IoC(Inversion of Control) 控制反转这种设计模式将对象的创建销毁、依赖关系交给容器处理，是以上设计原则的一种经典实践。其中它的一种实现 DI(Dependency Injection) 即依赖注入在工程领域应用十分广泛（下图来自 [Dependency-Injection-in-practice-CodeCAMP.pdf](http://www.mono.hr/Pdf/Dependency-Injection-in-practice-CodeCAMP.pdf)），最著名的当属 Spring：

![](./screenshots/di-containers.png)

而在 JavaScript 领域，[Angular](https://angular.io/guide/dependency-injection)、[NestJS](https://docs.nestjs.com/fundamentals/custom-providers) 也都实现了自己的 IoC 容器。

L7 选择了 [InversifyJS](https://github.com/inversify/InversifyJS/blob/master/wiki/oo_design.md) 作为轻量的 IoC 容器，统一管理各类复杂的服务，实现松耦合的代码结构，同时具有以下收益：
* 提供高扩展性。
    * 支持地图底图（高德、Mapbox）切换
    * 支持渲染引擎替换
    * 插件化
* 便于测试。测试用例中替换渲染引擎服务为基于 headless-gl 的渲染服务。

下图清晰的展示了切换引擎和底图时均不会影响核心代码：
![](./screenshots/packages.png)

## 多层次容器

L7 需要支持多场景(Scene)，每个场景中又包含了多个图层(Layer)。不同的服务可能隶属全局、Scene 和 Layer，因此对于容器也有层次化的要求。
试想如果我们只有一个全局容器，其中绑定的所有服务自然也都成了全局服务，在多场景下（页面中一个高德地图、一个 Mapbox）销毁高德地图的渲染服务，将影响到 Mapbox 的展示。

在 Angular 中也有[分层容器](https://angular.io/guide/hierarchical-dependency-injection)的应用。L7 使用的是 InversifyJS 提供的[层次化依赖注入功能](https://github.com/inversify/InversifyJS/blob/master/wiki/hierarchical_di.md)。

容器层次关系及数目如下：
```bash
RootContainer 1
  -> SceneContainer 1.*
    -> LayerContainer 1.*
``` 
其中每种容器包含不同类型的服务，这些服务有的是单例，有的是工厂方法。子容器应该能访问父容器中绑定的服务，即如果 RootContainer 已经绑定了全局日志服务，SceneContainer 不需要重复绑定也能注入。

下面详细介绍下每种容器中的服务。

### 全局容器

一些全局性服务不需要用户手动创建，也无需显式销毁。我们在全局容器中完成一次性的绑定，后续在所有场景、图层中都可以让容器注入这些服务的单例。类似 Angular 中的 [root ModuleInjector](https://angular.io/guide/hierarchical-dependency-injection#moduleinjector)。

例如日志、Shader 模块化服务应该是全局性的单例，我们在 `RootContainer` 完成依赖声明：
```typescript
// 在根容器中绑定日志服务为单例
rootContainer
  .bind<ILogService>(TYPES.ILogService)
  .to(LogService)
  .inSingletonScope();
```

目前 L7 中全局性服务说明如下：

* 日志服务。基于 `probe.gl` 实现，生产模式下应关闭。
* Shader 模块化服务。提供基本的 GLSL 模块化服务，基于字符串替换实现。
* 配置项校验服务。[详见](./ConfigSchemaValidation.md)

### Scene 容器

场景是

* 地图底图服务。每个场景有一个对应的地图底图。
* 渲染引擎服务。由于依赖 WebGL 上下文，基于 `regl` 实现。
* 图层管理服务。管理场景中所有的图层，负责图层的创建、销毁。
* PostProcessingPass。内置常用的后处理效果。

### Layer 容器

一个场景中可以有

## 参考资料

* [动态依赖注入](https://github.com/inversify/InversifyJS/issues/1088)