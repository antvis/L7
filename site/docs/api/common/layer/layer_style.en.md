### style

The style method is usually used to describe the specific style of a layer. Most layers will support some more general properties, such as the opacity property. At the same time, each layer will also have properties that are only supported by this layer, such as only
The windowColor attribute supported by CityBuildingLayer. Please check the detailed documentation of each layer for how to configure the attribute for each layer.

- opacity sets transparency, supported by most layers

- stroke line fill color only supported by point layer

- strokeWidth The width of the line. Only supported by point layers.

```javascript
layer.style({
  opacity: 0.8,
  stroke: 'white',
});
```

- Style data mapping🌟\
  Under normal circumstances, the style parameters will apply to all graphics on a layer. For example, if there are ten points in a PointLayer, we set opacity = 0.5, so that the transparency of the ten points is 0.5.\
  In special cases, we may need to set a transparency for each point. In this case, directly setting the opacity value of the style method in the original way cannot meet the needs. For this reason, we need to provide a special assignment method.\
  Usually we will set separate values ​​for each graphic of the layer based on the data passed into the layer, so we call it "style data mapping".\
  We support several ways of setting parameters in style to dynamically obtain values ​​from source data.

```javascript
//Set the transparency of each point of the point layer based on the value of the v field in the data
const data = [
  {
    lng: 120,
    lat: 30,
    v: 0.5
  },
  ...
]
const layer = new PointLayer()
  .source(data, {
    parser: {
      x: 'lng',
      y: 'lat'
    }
  })
  .shape('circle')
  .color('#f00')
  .size({
    // The first way to write is to get the value directly from data based on the field.
    opacity: 'v'// opacity = 0.5
  });
scene.addLayer(layer);
```

[Online case](/examples/point/text#stylemap)

from`L7 2.5`Starting from the beginning, each layer style will gradually support style data mapping. Currently, all layer styles support style data mapping.`style`The parameters are as follows:

| layer type/shape       | Supported style fields                               | Remark                                             |
| ---------------------- | ---------------------------------------------------- | -------------------------------------------------- |
| pointLayer/fill        | opacity、strokeOpacity、strokeWidth、stroke、offsets | shape circle、triangle...                          |
| pointLayer/image       | opacity、offsets                                     | offsets latitude and longitude offsets             |
| pointLayer/normal      | opacity、offsets                                     |                                                    |
| pointLayer/text        | opacity、strokeWidth、stroke、textOffset             | textOffset offset relative to text canvas position |
| pointLayer/extrude     | opacity                                              |                                                    |
| polygonLayer/fill      | opacity                                              |                                                    |
| polygonLayer/extrude   | opacity                                              |                                                    |
| lineLayer/line         | opacity                                              |                                                    |
| lineLayer/arc          | opacity、thetaOffset                                 | thetaOffset the curvature of the arc               |
| lineLayer/arc3d        | opacity                                              |                                                    |
| lineLayer/great_circle | opacity                                              |                                                    |

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*iz3ERZdg2SkAAAAAAAAAAAAAARQnAQ'>

[Online case](/examples/point/scatter#scatterstylemap)
