// @ts-ignore
import { Scene, PolygonLayer, PointLayer, Source } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import { Protocol } from "pmtiles";
const protocol = new Protocol();
Scene.addProtocol('pmtiles',protocol.tile);
const scene = new Scene({
    id: 'map',
    map: new Map({
      center: [11.2438, 43.7799],
      zoom: 12,
    }),
  });

  


  const source = new Source('pmtiles://https://mdn.alipayobjects.com/afts/file/A*HYvHSZ-wQmIAAAAAAAAAAAAADrd2AQ/protomaps(vector)ODbL_firenze.bin', {
      parser: {
        type: 'mvt',
        tileSize: 256,
        maxZoom: 14,
        extent: [-180, -85.051129, 179, 85.051129],
      },
    })


  const layer = new PolygonLayer({
  //   featureId: 'COLOR',
    sourceLayer: 'earth', // woods hillshade contour ecoregions ecoregions2 city
  });
  layer
    .source(source)
    .color('#f7f7f7')

    .style({
      opacity: 0.5
    });
    const boundaries = new PolygonLayer({
      //   featureId: 'COLOR',
        sourceLayer: 'boundaries', // woods hillshade contour ecoregions ecoregions2 city
      })
        .source(source)
        .color('#ffffbf')
        .shape('line')
        .size(1)
        .style({
          opacity: 1
        });

    const buildings = new PolygonLayer({
      //   featureId: 'COLOR',
        sourceLayer: 'buildings', // woods hillshade contour ecoregions ecoregions2 city
      })
        .source(source)
        .color('#f1b6da')
        .shape('fill')
        .style({
          opacity: 1
        });

        const natural = new PolygonLayer({
          //   featureId: 'COLOR',
            sourceLayer: 'natural', // woods hillshade contour ecoregions ecoregions2 city
          })
            .source(source)
            .color('#e6f5d0')
            .shape('fill')
      
            .style({
              opacity: 1
            });
          
            const water = new PolygonLayer({
              //   featureId: 'COLOR',
                sourceLayer: 'water', // woods hillshade contour ecoregions ecoregions2 city
              })
                .source(source)
                .color('#92c5de')
                .shape('fill')
          
                .style({
                  opacity: 1
                });
            const roads = new PolygonLayer({
              //   featureId: 'COLOR',
                  sourceLayer: 'roads', // woods hillshade contour ecoregions ecoregions2 city
              })
                  .source(source)
                  .color('#bababa')
                  .shape('line')
                  .size(0.5)
                  .style({
                  opacity: 1
                  });
          const transit = new PolygonLayer({
          //   featureId: 'COLOR',
              sourceLayer: 'transit', // woods hillshade contour ecoregions ecoregions2 city
          })
              .source(source)
              .color('#542788')
              .shape('line')
              .size(0.5)
              .style({
              opacity: 1
              });

              const point = new PointLayer({
                  //   featureId: 'COLOR',
                      sourceLayer: 'places', // woods hillshade contour ecoregions ecoregions2 city
                  })
                  .source(source)
                  .color('#542788')
                  .shape('circle')
                  .size(5)
                  .style({
                  opacity: 1
                  });
  
  scene.on('loaded', () => {
    scene.addLayer(layer);
    scene.addLayer(boundaries);
    scene.addLayer(natural);
    scene.addLayer(buildings);
    scene.addLayer(transit);
    scene.addLayer(roads);
    scene.addLayer(water);
    scene.addLayer(point);
  });