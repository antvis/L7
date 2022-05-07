// @ts-ignore
import { PointLayer, Scene, LineLayer, PolygonLayer, ILayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox, Map } from '@antv/l7-maps';
import * as React from 'react';
import * as turf from '@turf/turf';
var VectorTile = require('@mapbox/vector-tile').VectorTile;
var VectorTileFeature = require('@mapbox/vector-tile').VectorTileFeature;
var VectorTileLayer = require('@mapbox/vector-tile').VectorTileLayer;
var Protobuf = require('pbf');
var zlib = require('zlib');

const aspaceLnglat = [120.11, 30.264701434772807] as [number, number];
export default class GaodeMapComponent extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    // console.log('zlib', zlib)

    //   zlib.gunzip('http://localhost:3000/file.mbtiles/7/99/52.pbf', function(err, buffer) {
    //     // var tile = new VectorTile(new Protobuf(buffer));
    //     console.log(new Protobuf(buffer))
    // });

    // console.log(new Protobuf('http://localhost:3000/file.mbtiles/7/99/52.pbf'))
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: aspaceLnglat,
        // pitch: 0,
        // pitch: 40,
        // style: 'dark',
        zoom: 14,
        // dragEnable: false
      }),
    });

    this.scene = scene;

    var replacer = function(key: any, value: any) {
      if (value.geometry) {
        var type;
        var rawType = value.type;
        var geometry = value.geometry;

        if (rawType === 1) {
          type = geometry.length === 1 ? 'Point' : 'MultiPoint';
        } else if (rawType === 2) {
          type = geometry.length === 1 ? 'LineString' : 'MultiLineString';
        } else if (rawType === 3) {
          type = geometry.length === 1 ? 'Polygon' : 'MultiPolygon';
        }

        return {
          type: 'Feature',
          geometry: {
            type: type,
            coordinates: geometry.length == 1 ? geometry : [geometry],
          },
          properties: value.tags,
        };
      } else {
        return value;
      }
    };

    scene.on('loaded', () => {
      fetch('http://localhost:3000/file.mbtiles/7/99/52.pbf')
        .then((res) => res.arrayBuffer())
        .then((r) => {
          // var tile = new VectorTile(new Protobuf(r));
          fetch(
            'https://gw.alipayobjects.com/os/bmw-prod/7b3564b6-1e84-4e79-98c5-614b4842e76d.json',
          )
            .then((res) => res.json())
            .then((res) => {
              // console.log()

              let r = {
                features: [
                  {
                    geometry: [
                      [
                        [3236, 1610],
                        [3289, 1626],
                        [3316, 1667],
                        [3278, 1704],
                        [3209, 1673],
                        [3236, 1610],
                      ],
                    ],
                    type: 3,
                    tags: {},
                  },
                ],
                numPoints: 6,
                numSimplified: 6,
                numFeatures: 1,
                source: [
                  {
                    id: null,
                    type: 'Polygon',
                    geometry: [
                      [
                        0.7900390625,
                        0.39306640625000006,
                        1,
                        0.783447265625,
                        0.408447265625,
                        0.0001511138340212265,
                        0.80029296875,
                        0.416015625,
                        0.0006318092346191381,
                        0.8095703125,
                        0.406982421875,
                        0.00014775134482473615,
                        0.802978515625,
                        0.39697265625,
                        0.000018723858046475082,
                        0.7900390625,
                        0.39306640625000006,
                        1,
                      ],
                    ],
                    tags: {},
                    minX: 0.783447265625,
                    minY: 0.39306640625000006,
                    maxX: 0.8095703125,
                    maxY: 0.416015625,
                  },
                ],
                x: 0,
                y: 0,
                z: 0,
                transformed: true,
                minX: 0.783447265625,
                minY: 0.39306640625000006,
                maxX: 0.8095703125,
                maxY: 0.416015625,
              };
              let replaceJSON = JSON.stringify(
                {
                  type: 'FeatureCollection',
                  features: r ? r.features : [],
                },
                replacer,
              );
              let geojson = JSON.parse(replaceJSON);
              // console.log(geojson)
              let coordinates = geojson.features[0].geometry.coordinates[0];
              // console.log(coordinates)
              let coords: any[] = [];
              coordinates.map(([x, y]: [number, number]) => {
                // console.log(unprojectX(x/4096))
                // console.log(unprojectY(y/4096))
                let lng = unprojectX(x / 4096);
                let lat = unprojectY(y / 4096);
                coords.push([lng, lat]);
              });
              // console.log(JSON.stringify(coords))

              function projectX(x: number) {
                return x / 360 + 0.5;
              }

              function unprojectX(x: number) {
                return (x - 0.5) * 360;
              }

              function projectY(y: number) {
                var sin = Math.sin((y * Math.PI) / 180);
                var y2 =
                  0.5 - (0.25 * Math.log((1 + sin) / (1 - sin))) / Math.PI;
                return y2 < 0 ? 0 : y2 > 1 ? 1 : y2; // clamp 0 - 1
              }

              function unprojectY(y: number) {
                let n = Math.exp(4 * Math.PI * (0.5 - y));
                let y2 = (Math.asin((n - 1) / (n + 1)) * 180) / Math.PI;
                if (y2 > 85) {
                  y2 = 85;
                }
                return y2;
              }

              const polygonLayer = new PolygonLayer({ autoFit: true })
                .source({
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      properties: {},
                      geometry: {
                        type: 'Polygon',
                        coordinates: [coords],
                      },
                    },
                  ],
                })
                // .size('NAME_CHN', [0, 10000, 50000, 30000, 100000])
                .shape('fill')
                .color('#ff0')
                .style({
                  opacity: 0.5,
                });

              scene.addLayer(polygonLayer);
              // var tile = new VectorTile(geojson);
              // new VectorTileFeature(res)

              // console.log(new VectorTileFeature(res));
            });
          // var tile = new VectorTile(r);
          // console.log(tile);

          // console.log(tile.layers.city.feature(0).loadGeometry())

          // const pdata = tile.layers.city.feature(0).toGeoJSON(99, 52, 7);
          // console.log(pdata);
          // const polygonLayer = new PolygonLayer({ autoFit: true })
          //   .source({
          //     type: 'FeatureCollection',
          //     features: [pdata],
          //   })
          //   .size('NAME_CHN', [0, 10000, 50000, 30000, 100000])
          //   .shape('fill')
          //   .color('#ff0')
          //   .style({
          //     opacity: 0.5,
          //   });

          // scene.addLayer(polygonLayer);
          // tile.layers.city.feature(0).loadGeometry()
        });
    });
  }

  public render() {
    return (
      <>
        <div
          id="map"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </>
    );
  }
}
