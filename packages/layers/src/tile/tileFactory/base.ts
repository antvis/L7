import {
  ILayer,
  IMapService,
  IParseDataItem,
  IRendererService,
  ISubLayerInitOptions,
} from '@antv/l7-core';
import Source from '@antv/l7-source';
import { Tile, TilesetManager } from '@antv/l7-utils';
import { setStyleAttributeField, setScale } from '../style/utils';
import { registerLayers } from '../utils';
import { readRasterValue } from '../interaction/getRasterData';
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

type IEvent = { lngLat: {lng: number, lat: number}, x: number, y: number, value: any};

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
      layers: [] as ILayer[]
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
    setStyleAttributeField(layer, this.parentLayer, 'shape', shape);
    if(usage !== 'basemap') {
       // set scale
      setScale(layer, this.parentLayer);

      setStyleAttributeField(layer, this.parentLayer, 'color', color);
      setStyleAttributeField(layer, this.parentLayer, 'size', size);
    } else {
      layer.style({
        color: basemapColor,
        size: basemapSize
      })
    }

    // set mask
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

      registerLayers(this.parentLayer, [masklayer]);

      layer.addMaskLayer(masklayer);
    }

    this.layers = [layer];

    return layer;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public updateStyle(styles: ITileStyles) {
    return '';
  }

  protected getTile(lng: number, lat: number) {
    const zoom = this.mapService.getZoom();
    return this.tilesetManager.getTileByLngLat(lng, lat, zoom);
  }

  private bindVectorEvent(layer: ILayer) {
    layer.on('click', (e) => {
      this.eventCache.click = 1;
      this.getFeatureAndEmitEvent('subLayerClick', e);
    });
    layer.on('mousemove', (e) => {
      this.eventCache.mousemove = 1;
      this.getFeatureAndEmitEvent('subLayerMouseMove', e);
    });
    layer.on('mouseenter', (e) => {
      this.getFeatureAndEmitEvent('subLayerMouseEnter', e);
    });
  }

  
  private readRasterTile(e: IEvent, name: string) {
    const { lng, lat } = e.lngLat;
    const tile = this.getTile(lng, lat);
    if(!tile) return;
    const data = readRasterValue(tile, this.mapService, e.x, e.y);
    e.value = data;
    this.parentLayer.emit(name, e);
  }

  private bindRasterEvent(layer: ILayer) {
    layer.on('click', (e) => {
      this.eventCache.click = 1;
      this.readRasterTile(e, 'subLayerClick');
    });
    layer.on('mousemove', (e) => {
      this.eventCache.mousemove = 1;
      this.readRasterTile(e, 'subLayerMouseMove');
    });
    layer.on('mouseenter', (e) => {
      this.readRasterTile(e, 'subLayerMouseMove');
    });
  }

  private bindCommonEvent(layer: ILayer) {
    layer.on('mouseup', (e) => {
      this.eventCache.mouseup = 1;
      this.getFeatureAndEmitEvent('subLayerMouseUp', e);
    });
   
    layer.on('mouseout', (e) => {
      this.getFeatureAndEmitEvent('subLayerMouseOut', e);
    });
    layer.on('mousedown', (e) => {
      this.eventCache.mousedown = 1;
      this.getFeatureAndEmitEvent('subLayerMouseDown', e);
    });
    layer.on('contextmenu', (e) => {
      this.eventCache.contextmenu = 1;
      this.getFeatureAndEmitEvent('subLayerContextmenu', e);
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
  }

  protected emitEvent(layers: ILayer[]) {
    layers.map((layer) => {
      layer.once('inited', () => {
        this.bindVectorEvent(layer);

        this.bindCommonEvent(layer);
        
      });
    });
  }

  protected emitRasterEvent(layers: ILayer[]) {
    layers.map((layer) => {
      layer.once('inited', () => {
        
        this.bindRasterEvent(layer);
      
        this.bindCommonEvent(layer);
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
    eventName: string,
    e: any,
  ) {
    const featureId = e.featureId;
    const features = this.getAllFeatures(featureId);
    try {
      e.feature = this.getCombineFeature(features);
    } catch (err) {
      console.warn('Combine Featuer Err! Return First Feature!');
      e.feature = features[0];
    }
    
    this.parentLayer.emit(eventName, e);
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
        this.getFeatureAndEmitEvent(emitType, e);
      }
    }, 64);
  }
}
