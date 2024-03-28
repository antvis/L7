#### style data mapping

The default style configuration is a constant value. Some configurations also support data mapping. The mapping definition is the same as the color and size parameters.

- field: mapping field
- value: mapping interval or custom callback function

like:

```ts
layer.style({
    opacity:{
        field:'name'
        value:[0.1,0.5,1],

    }
})
```
