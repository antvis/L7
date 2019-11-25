# L7's Collection of Layers

## Installation

```bash
yarn add @antv/l7-layers
```

## Getting Started

Use built-in layers directly:
```typescript
import { PointLayer } from '@antv/l7-layers';

const layer = new PointLayer({
  // ...initialization options
});
```

Create a custom layer with the help of `BaseLayer`:
```typescript
import { BaseLayer } from '@antv/l7-layers';

class MyCustomLayer extends BaseLayer {
  // ...override methods
}

const layer = new MyCustomLayer({
  // ...initialization options
});
```

## Current Built-in Layers

* PointLayer
* PolygonLayer
* LineLayer
* HeatmapLayer
* RasterLayer
