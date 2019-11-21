# ConfigSchemaValidation 设计

用户在使用 L7 的 Scene/Layer API 时，由于参数配置项众多难免会误传。需要在运行时通过校验提前发现并给出友好的提示。
另外由于 L7 允许用户自定义 Layer 与 LayerPlugin，规范化参数配置项也能提升易用性和质量。

这方面 Webpack 做的很好，使用 [schema-utils](https://github.com/webpack/schema-utils) 基于 JSON Schema 对 Plugin 和 Loader 进行校验。如果传入了错误的配置项，会给出友好的提示：
```
Invalid configuration object. MyPlugin has been initialised using a configuration object that does not match the API schema.
 - configuration.optionName should be a integer.
```

和 Webpack 一样，我们也选择 [ajv](https://github.com/epoberezkin/ajv) 作为 JSON Schema 校验器。
目前我们只在 Layer 初始阶段进行校验，一旦校验失败会中断后续初始化插件的处理，并在控制台给出校验失败信息。后续需要在属性更新时同样进行校验。

## Layer 基类配置项 Schema

目前在基类中我们声明了如下属性及其对应的校验规则：

```javascript
export default {
  properties: {
    // 开启拾取
    enablePicking: {
      type: 'boolean',
    },
    // 开启高亮
    enableHighlight: {
      type: 'boolean',
    },
    // 高亮颜色：例如 [0, 0, 1, 1] 或者 '#ffffff'
    highlightColor: {
      oneOf: [
        {
          type: 'array',
          items: {
            type: 'number',
            minimum: 0,
            maximum: 1,
          },
        },
        {
          type: 'string',
        },
      ],
    },
  },
};
```

如果传入了错误的配置项则会在控制台给出提示。

## Layer 子类配置项 Schema

Layer 子类可以通过重载 `getConfigSchema()` 方法定义自身的特有属性。例如 `PolygonLayer` 需要定义透明度：

```javascript
protected getConfigSchema() {
  return {
    properties: {
      opacity: {
        type: 'number',
        minimum: 0,
        maximum: 1,
      },
    },
  };
}
```
