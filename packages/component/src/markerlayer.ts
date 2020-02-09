import { IMapService, IMarker, TYPES } from '@antv/l7-core';
import { bindAll, DOM, Satistics } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';
import { merge } from 'lodash';
import Supercluster from 'supercluster';
import Marker from './marker';
type CallBack = (...args: any[]) => any;
interface IMarkerStyleOption {
  element?: CallBack;
  style: { [key: string]: any } | CallBack;
  className: string;
  field?: string;
  method?: 'sum' | 'max' | 'min' | 'mean';
  radius: number;
  maxZoom: number;
  minZoom: number;
  zoom: number;
}

interface IMarkerLayerOption {
  cluster: boolean;
  clusterOption: Partial<IMarkerStyleOption>;
}

interface IPointFeature {
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: any;
}
export default class MarkerLayer extends EventEmitter {
  private markers: IMarker[] = [];
  private markerLayerOption: IMarkerLayerOption;
  private clusterIndex: Supercluster;
  private points: IPointFeature[] = [];
  private clusterMarkers: IMarker[] = [];
  private mapsService: IMapService<unknown>;
  private scene: Container;
  private zoom: number;

  constructor(option?: Partial<IMarkerLayerOption>) {
    super();
    this.markerLayerOption = merge(this.getDefault(), option);
    bindAll(['update'], this);
    this.zoom = this.markerLayerOption.clusterOption?.zoom || -99;
  }
  public getDefault() {
    return {
      cluster: false,
      clusterOption: {
        radius: 80,
        maxZoom: 20,
        minZoom: 0,
        zoom: -99,
        style: {},
        className: '',
      },
    };
  }
  public addTo(scene: Container) {
    // this.remove();
    this.scene = scene;
    this.mapsService = scene.get<IMapService>(TYPES.IMapService);
    if (this.markerLayerOption.cluster) {
      this.initCluster();
      this.update();
      // 地图视野变化时，重新计算视野内的聚合点。
      this.mapsService.on('camerachange', this.update);
    }
    this.addMarkers();
    return this;
  }
  public addMarker(marker: IMarker) {
    const cluster = this.markerLayerOption.cluster;
    if (cluster) {
      this.addPoint(marker, this.markers.length);
    }
    this.markers.push(marker);
  }

  public removeMarker(marker: IMarker) {
    this.markers.indexOf(marker);
    const markerIndex = this.markers.indexOf(marker);
    if (markerIndex > -1) {
      this.markers.splice(markerIndex, 1);
    }
  }

  public getMarkers() {
    const cluster = this.markerLayerOption.cluster;
    return cluster ? this.clusterMarkers : this.markers;
  }

  public addMarkers() {
    this.getMarkers().forEach((marker: IMarker) => {
      marker.addTo(this.scene);
    });
  }
  public clear() {
    this.markers.forEach((marker: IMarker) => {
      marker.remove();
    });
    this.mapsService.off('camerachange', this.update);
    this.markers = [];
  }

  public destroy() {
    this.clear();
    this.removeAllListeners();
  }

  private addPoint(marker: IMarker, id: number) {
    const { lng, lat } = marker.getLnglat();
    const feature: IPointFeature = {
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: {
        ...marker.getExtData(),
        marker_id: id,
      },
    };
    this.points.push(feature);
  }

  private initCluster() {
    if (!this.markerLayerOption.cluster) {
      return;
    }
    const { radius, minZoom = 0, maxZoom } = this.markerLayerOption
      .clusterOption as IMarkerStyleOption;
    this.clusterIndex = new Supercluster({
      radius,
      minZoom,
      maxZoom,
    });
    // @ts-ignore
    this.clusterIndex.load(this.points);
  }

  private getClusterMarker(zoom: number) {
    // 之前的参数为  [-180, -85, 180, 85]，基本等于全地图的范围
    // 优化后的逻辑为：
    // 取当前视野范围 * 2，只渲染视野内 * 2 范围的点
    const viewBounds = this.mapsService.getBounds();
    const viewBBox = viewBounds[0].concat(viewBounds[1]) as GeoJSON.BBox;
    const clusterPoint = this.clusterIndex.getClusters(viewBBox, zoom);
    this.clusterMarkers.forEach((marker: IMarker) => {
      marker.remove();
    });
    this.clusterMarkers = [];
    clusterPoint.forEach((feature) => {
      const { field, method } = this.markerLayerOption.clusterOption;
      // 处理聚合数据
      if (feature.properties && feature.properties?.cluster_id) {
        const clusterData = this.getLeaves(feature.properties?.cluster_id);
        feature.properties.clusterData = clusterData;
        if (field && method) {
          const columnData = clusterData?.map((item) => {
            const data = {
              [field]: item.properties[field],
            };
            return data;
          });
          const column = Satistics.getColumn(columnData as any, field);
          const stat = Satistics.getSatByColumn(method, column);
          const fieldName = 'point_' + method;
          feature.properties[fieldName] = stat;
        }
      }
      const marker = this.clusterMarker(feature);
      // feature.properties && feature.properties.hasOwnProperty('point_count')
      //   ? this.clusterMarker(feature)
      //   : this.normalMarker(feature);

      this.clusterMarkers.push(marker);
      marker.addTo(this.scene);
    });
  }
  private getLeaves(
    clusterId: number,
    limit: number = Infinity,
    offset: number = 0,
  ) {
    if (!clusterId) {
      return null;
    }
    return this.clusterIndex.getLeaves(clusterId, limit, offset);
  }
  private clusterMarker(feature: any) {
    const clusterOption = this.markerLayerOption.clusterOption;

    const {
      element = this.generateElement.bind(this),
    } = clusterOption as IMarkerStyleOption;
    const marker = new Marker({
      element: element(feature),
    }).setLnglat({
      lng: feature.geometry.coordinates[0],
      lat: feature.geometry.coordinates[1],
    });
    return marker;
  }
  private normalMarker(feature: any) {
    const marker_id = feature.properties.marker_id;
    return this.markers[marker_id];
  }

  private update() {
    const zoom = this.mapsService.getZoom();
    // 在 zoom 变化的时候，通过控制触发的阈值 (0.4)，减少小层级的 zoom 变化引起的频繁重绘
    if (zoom !== this.zoom && Math.abs(zoom - this.zoom) > 0.4) {
      // 按照当前地图的放大层级向下取整，进行聚合点的绘制
      this.zoom = Math.floor(zoom);
      this.getClusterMarker(Math.floor(zoom));
    } else if (zoom === this.zoom) {
      // 如果 zoom 没有变化，只是平移，进行重新计算渲染加载s
      this.getClusterMarker(Math.floor(zoom));
    }
  }

  private generateElement(feature: any) {
    const el = DOM.create('div', 'l7-marker-cluster');
    const label = DOM.create('div', '', el);
    const span = DOM.create('span', '', label);
    const { field, method } = this.markerLayerOption.clusterOption;
    feature.properties.point_count = feature.properties.point_count || 1;

    const text =
      field && method
        ? feature.properties['point_' + method] || feature.properties[field]
        : feature.properties.point_count;
    span.textContent = text;
    // const elStyle = isFunction(style)
    //   ? style(feature.properties.point_count)
    //   : style;

    // Object.keys(elStyle).forEach((key: string) => {
    //   // @ts-ignore
    //   el.style[key] = elStyle[key];
    // });
    return el;
  }
}
