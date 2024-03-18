---
title: BaseLayer
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

The L7 Layer interface design follows graphics syntax, and all layers inherit from the base class (baseLayer).

Syntax example

```javascript
const layer = new BaseLayer(option) // option - the parameter object passed into the constructor, providing the initial state of the layer
  .source(...) // Pass in the data required by the layer and related parsers
  .filter() //data filtering method
  .shape(...) // Specify a specific shape for the layer, such as: circle/triangle, etc.
  .color(...) //Specify the color configuration of the layer
  .texture(...) //Specify the texture referenced by the layer
  .size(...) //Set the size of layer elements
  .animate(...) //Set the animation mode of layer elements
  .active(...) //Specify whether the layer element supports swipe selection
  .select(...) //Specify whether the layer element supports click selection
  .style(...); // Specify the configuration of the layer's custom style

scene.addLayer(layer);
```

<embed src="@/docs/api/common/layer/base.en.md"></embed>
