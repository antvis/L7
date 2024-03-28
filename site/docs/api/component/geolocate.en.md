---
title: GeoLocate
order: 6
---

using browser environment`nagigator`of`getlocation`Method, use the browser to turn on the location sensing capability to obtain the longitude and latitude of the current user.

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BOsBRJyYeMEAAAAAAAAAAAAAARQnAQ" width="400"/>

## illustrate

[Example](/examples/component/control#geolocate)

**Notice:**

- When using this capability, the user will be required to authenticate the browser to enable location awareness.
- The coordinates currently obtained by the browser are`WGS84`The geographical coordinate system will be biased when used on the Gaode map, so it can be used`transform`Configure the coordinate system conversion.

## use

```ts
import { Scene, GeoLocate } from '@antv/l7';
import gcoord from 'gcoord';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  const geoLocate = new GeoLocate({
    transform: (position) => {
      //Convert the coordinates obtained based on the WGS84 geographical coordinate system into the GCJ02 coordinate system
      return gcoord.transform(position, gcoord.WGS84, gcoord.GCJ02);
    },
  });
  scene.addControl(geoLocate);
});
```

## Configuration

| name      | illustrate                                                                                                                              | type                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| transform | Format passed`getlocation`The function of the obtained longitude and latitude can be used to convert the geographical coordinate system | `(position: [number, number]) => [number, number]` |

<embed src="@/docs/api/common/control/btn-api.en.md"></embed>

<embed src="@/docs/api/common/control/api.en.md"></embed>

## method

| name           | illustrate                                                    | type                              |
| -------------- | ------------------------------------------------------------- | --------------------------------- |
| getGeoLocation | Get the latitude and longitude of the current user's location | `() => Promise<[number, number]>` |

<embed src="@/docs/api/common/control/method.en.md"></embed>

## event

<embed src="@/docs/api/common/control/event.en.md"></embed>
