import {
  ILayer,
  IMapService,
  IParseDataItem,
  IRendererService,
  IScaleValue,
  ISubLayerInitOptions,
  ScaleAttributeType,
} from '@antv/l7-core';
import Source from '@antv/l7-source';
import { osmLonLat2TileXY, Tile, TilesetManager } from '@antv/l7-utils';

import {
  getLayerShape,
  readRasterValue,
  registerLayers,
} from '../utils';
import VectorLayer from './layers/vectorLayer';

import * as turf from '@turf/helpers';
import union from '@turf/union';
import clone from '@turf/clone';
import polygonToLineString from '@turf/polygon-to-line';
import {
  CacheEvent,
  ILayerTileConfig,
  ITileFactory,
  ITileFactoryOptions,
  ITileStyles,
  Timeout,
} from '../interface';

const EMPTY_FEATURE_DATA = {
  features: [],
  featureId: null,
  vectorTileLayer: null,
  source: null,
};
export default class TileFactory implements ITileFactory {
  public type: string;
  public parentLayer: ILayer;
  public mapService: IMapService;
  public rendererService: IRendererService;
  public outSideEventTimer: Timeout | null = null;
  protected zoomOffset: number;
  protected tilesetManager: TilesetManager;
  protected layers: ILayer[];
  // 用于记录图层内事件，辅助判断图层外事件逻辑
  private eventCache = {
    click: 0,
    mousemove: 0,
    mouseup: 0,
    mousedown: 0,
    contextmenu: 0,
  };
  constructor(option: ITileFactoryOptions) {
    this.parentLayer = option.parent;
    this.mapService = option.mapService;
    this.rendererService = option.rendererService;

    const source = this.parentLayer.getSource();
    this.zoomOffset = source.parser.zoomOffset || 0;
    this.tilesetManager = source.tileset as TilesetManager;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public createTile(tile: Tile, initOptions: ISubLayerInitOptions) {
    return {
      layers: [] as ILayer[],
      layerIDList: [] as string[],
    };
  }

  public getFeatureData(tile: Tile, initOptions: ISubLayerInitOptions) {
    const { sourceLayer, featureId, transforms = [], layerType, shape } = initOptions;
    if (!sourceLayer) {
      return EMPTY_FEATURE_DATA;
    }
    const vectorTileLayer = tile.data.layers[sourceLayer];
    const features = vectorTileLayer?.features;
    if (!(Array.isArray(features) && features.length > 0)) {
      return EMPTY_FEATURE_DATA;
    } else {
      let geofeatures = [];
      if(layerType === 'LineLayer' && shape === 'simple') {
        features.map(feature => {
          const cloneFeature = clone(feature);
          if(cloneFeature.geometry.type === 'MultiPolygon') {
            // @ts-ignore
            const linefeatures = polygonToLineString(cloneFeature).features
            geofeatures.push(...linefeatures)
          } else if(cloneFeature.geometry.type === 'Polygon') {
            cloneFeature.geometry.type = 'MultiLineString'
            geofeatures.push(cloneFeature);
          } else {
            geofeatures.push(cloneFeature);
          }
        })
      } else {
        geofeatures = features;
      }
     
      const source = new Source(
        {
          type: 'FeatureCollection',
          features: geofeatures,
        },
        {
          parser: {
            type: 'geojson',
            featureId,
            cancelExtent: true
          },
          transforms
        },
      );

      return {
        features: geofeatures,
        featureId,
        vectorTileLayer,
        source,
      };
    }
  }

  public createLayer(tileLayerOption: ILayerTileConfig) {
    const {
      L7Layer,
      tile,
      initOptions,
      vectorTileLayer,
      source,
      needListen = true,
    } = tileLayerOption;
    const { mask, color, layerType, size, shape, usage, basemapColor, basemapSize } = initOptions;
    const FactoryTileLayer = L7Layer ? L7Layer : VectorLayer;
    const layer = new FactoryTileLayer({
      visible: tile.isVisible,
      tileOrigin: vectorTileLayer?.l7TileOrigin,
      coord: vectorTileLayer?.l7TileCoord,
      needListen,
      ...this.getLayerInitOption(initOptions),
    });

    if(layerType) layer.type = layerType;

    // Tip: sign tile layer
    layer.isTileLayer = true; // vector 、raster
    
    // vector layer set event
    if (layer.isVector && usage !== 'basemap') {
      this.emitEvent([layer]);
      layer.select(true);
    }

    // set source
    layer.source(source);

    // set scale attribute field
    this.setStyleAttributeField(layer, 'shape', shape);
    if(usage !== 'basemap') {
       // set scale
      this.setScale(layer);

      this.setStyleAttributeField(layer, 'color', color);
      this.setStyleAttributeField(layer, 'size', size);
    } else {
      layer.style({
        color: basemapColor,
        size: basemapSize
      })
    }

    // set mask
    const layers = [layer];
    if (mask && layer.isVector) {
      const masklayer = new VectorLayer({layerType: "MaskLayer"})
        .source({
          type: 'FeatureCollection',
          features: [tile.bboxPolygon],
        }, {
          parser: {
            type: 'geojson',
            cancelExtent: true
          }
        });

      layers.push(masklayer as VectorLayer);

      layer.addMaskLayer(masklayer);
    }
    // regist layer
    registerLayers(this.parentLayer, layers);

    this.layers = [layer];

    return layer;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public updateStyle(styles: ITileStyles) {
    return '';
  }

  public getDefaultStyleAttributeField(layer: ILayer, type: string) {
    switch (type) {
      case 'size':
        return 1;
      case 'color':
        return '#fff';
      case 'shape':
        return getLayerShape(this.parentLayer.type, layer);
      default:
        return '';
    }
  }

  public setStyleAttributeField(
    layer: ILayer,
    type: ScaleAttributeType,
    value: IScaleValue | undefined | string | string[],
  ) {
    if (Array.isArray(value)) {
      // @ts-ignore
      layer[type](...value);
      return;
    }
    if (typeof value === 'string') {
      layer[type](value);
      return;
    }
    const defaultValue = this.getDefaultStyleAttributeField(layer, type);
    if (!value) {
      layer[type](defaultValue);
      return layer;
    }
    const params = this.parseScaleValue(value, type);
    if (params.length === 0) {
      layer[type](defaultValue);
    } else {
      // @ts-ignore
      layer[type](...params);
    }
  }

  protected parseScaleValue(value: IScaleValue | string, type: string) {
    if (type === 'shape') {
      if (typeof value === 'string') {
        return [value];
      } else if (value?.field) {
        return [value?.field];
      } else {
        return [];
      }
    }
    const { field, values, callback } = value as IScaleValue;
    if (field && values && Array.isArray(values)) {
      return [field, values];
    } else if (field && callback) {
      return [field, callback];
    } else if (field) {
      return [field];
    }
    return [];
  }

  protected getTile(lng: number, lat: number) {
    const zoom = this.mapService.getZoom();
    const z = Math.ceil(zoom) + this.zoomOffset;
    const xy = osmLonLat2TileXY(lng, lat, z);

    const tiles = this.tilesetManager.tiles.filter(
      (t) => t.key === `${xy[0]},${xy[1]},${z}`,
    );
    return tiles[0];
  }

  protected emitEvent(layers: ILayer[], isVector?: boolean) {
    layers.map((layer) => {
      layer.once('modelLoaded', () => {
        layer.on('click', (e) => {
          this.eventCache.click = 1;
          if (this.parentLayer.type === 'RasterLayer') {
            const { lng, lat } = e.lngLat;
            const tile = this.getTile(lng, lat);
            tile && this.getFeatureAndEmitEvent(
              layer,
              'subLayerClick',
              e,
              isVector,
              tile,
            );
          } else {
            this.getFeatureAndEmitEvent(layer, 'subLayerClick', e);
          }
        });

        layer.on('mousemove', (e) => {
          this.eventCache.mousemove = 1;
          if (this.parentLayer.type === 'RasterLayer') {
            const { lng, lat } = e.lngLat;
            const tile = this.getTile(lng, lat);
            tile && this.getFeatureAndEmitEvent(
              layer,
              'subLayerMouseMove',
              e,
              isVector,
              tile,
            );
          } else {
            this.getFeatureAndEmitEvent(layer, 'subLayerMouseMove', e);
          }
        });
        layer.on('mouseup', (e) => {
          this.eventCache.mouseup = 1;
          this.getFeatureAndEmitEvent(layer, 'subLayerMouseUp', e);
        });
        layer.on('mouseenter', (e) => {
          if (this.parentLayer.type === 'RasterLayer') {
            const { lng, lat } = e.lngLat;
            const tile = this.getTile(lng, lat);
            tile && this.getFeatureAndEmitEvent(
              layer,
              'subLayerMouseMove',
              e,
              isVector,
              tile,
            );
          } else {
            this.getFeatureAndEmitEvent(layer, 'subLayerMouseEnter', e);
          }
        });
        layer.on('mouseout', (e) => {
          this.getFeatureAndEmitEvent(layer, 'subLayerMouseOut', e);
        });
        layer.on('mousedown', (e) => {
          this.eventCache.mousedown = 1;
          this.getFeatureAndEmitEvent(layer, 'subLayerMouseDown', e);
        });
        layer.on('contextmenu', (e) => {
          this.eventCache.contextmenu = 1;
          this.getFeatureAndEmitEvent(layer, 'subLayerContextmenu', e);
        });

        // out side
        layer.on('unclick', (e) =>
          this.handleOutsideEvent('click', 'subLayerUnClick', layer, e),
        );
        layer.on('unmouseup', (e) =>
          this.handleOutsideEvent('mouseup', 'subLayerUnMouseUp', layer, e),
        );
        layer.on('unmousedown', (e) =>
          this.handleOutsideEvent('mousedown', 'subLayerUnMouseDown', layer, e),
        );
        layer.on('uncontextmenu', (e) =>
          this.handleOutsideEvent(
            'contextmenu',
            'subLayerUnContextmenu',
            layer,
            e,
          ),
        );
      });
    });
  }

  protected getCombineFeature(features: IParseDataItem[]) {
    let p: any = null;
    const properties = features[0];
    features.map((feature) => {
      const polygon = turf.polygon(feature.coordinates);
      if (p === null) {
        p = polygon;
      }
      {
        p = union(p, polygon);
      }
    });
    if (properties) {
      p.properties = { ...properties };
    }
    return p;
  }

  protected getFeatureAndEmitEvent(
    layer: ILayer,
    eventName: string,
    e: any,
    isVector?: boolean,
    tile?: any,
  ) {
    if (isVector === false) {
      // raster tile get rgb
      // e.pickedColors = readPixel(e.x, e.y, this.rendererService);
      // raster tile origin value
      e.value = readRasterValue(tile, this.mapService, e.x, e.y);
    } else {
      // VectorLayer
      const featureId = e.featureId;
      const features = this.getAllFeatures(featureId);
      try {
        e.feature = this.getCombineFeature(features);
      } catch (err) {
        console.warn('Combine Featuer Err! Return First Feature!');
        e.feature = features[0];
      }
    }
    this.parentLayer.emit(eventName, e);
  }

  private setScale(layer: ILayer) {
    const scaleOptions = this.parentLayer.tileLayer.scaleField;
    const scaleKeys = Object.keys(scaleOptions);
    scaleKeys.map((key) => {
      layer.scale(key, scaleOptions[key]);
    });
  }

  private getAllFeatures(featureId: number) {
    const allLayers: ILayer[] = this.parentLayer.tileLayer.children;
    const features: IParseDataItem[] = [];
    allLayers.map((layer) => {
      const source = layer.getSource();
      source.data.dataArray.map((feature) => {
        if (feature._id === featureId) {
          features.push(feature);
        }
      });
    });
    return features;
  }

  private getLayerInitOption(initOptions: ISubLayerInitOptions) {
    const option = { ...initOptions };
    delete option.color;
    delete option.shape;
    delete option.size;
    delete option.coords;
    delete option.sourceLayer;
    delete option.coords;
    return option;
  }

  private handleOutsideEvent(
    type: CacheEvent,
    emitType: string,
    layer: ILayer,
    e: any,
  ) {
    if (this.outSideEventTimer) {
      clearTimeout(this.outSideEventTimer);
      this.outSideEventTimer = null;
    }
    this.outSideEventTimer = setTimeout(() => {
      if (this.eventCache[type] > 0) {
        this.eventCache[type] = 0;
      } else {
        this.getFeatureAndEmitEvent(layer, emitType, e);
      }
    }, 64);
  }
}
