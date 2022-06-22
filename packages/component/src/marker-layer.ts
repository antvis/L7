import { IMapService, IMarker, TYPES } from '@antv/l7-core';
import {
  bindAll,
  boundsContains,
  DOM,
  IBounds,
  padBounds,
  Satistics,
} from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';
import { merge } from 'lodash';
// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import Supercluster from 'supercluster/dist/supercluster';
import { IMarkerLayerOption, IMarkerStyleOption } from './interface';
import Marker from './marker';

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
  private bbox: IBounds;

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
      this.mapsService.on('camerachange', this.update); // amap1.x 更新事件
      this.mapsService.on('viewchange', this.update); // amap2.0 更新事件
    }
    this.addMarkers();
    return this;
  }
  public addMarker(marker: IMarker) {
    const cluster = this.markerLayerOption.cluster;
    if (cluster) {
      this.addPoint(marker, this.markers.length);
      if (this.mapsService) {
        // 在新增 marker 的时候需要更新聚合信息（哪怕此时的 zoom 没有发生变化）
        const zoom = this.mapsService.getZoom();
        const bbox = this.mapsService.getBounds();
        this.bbox = padBounds(bbox, 0.5);
        this.zoom = Math.floor(zoom);
        this.getClusterMarker(this.bbox, this.zoom);
      }
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

  /**
   * 隐藏 marker 在每个 marker 上单独修改属性而不是在 markerContainer 上修改（在 markerContainer 修改会有用户在场景加载完之前调用失败的问题）
   */
  public hide() {
    this.markers.map((m) => {
      m.getElement().style.opacity = '0';
    });

    this.clusterMarkers.map((m) => {
      m.getElement().style.opacity = '0';
    });
  }

  /**
   * 显示 marker
   */
  public show() {
    this.markers.map((m) => {
      m.getElement().style.opacity = '1';
    });

    this.clusterMarkers.map((m) => {
      m.getElement().style.opacity = '1';
    });
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
    this.clusterMarkers.forEach((clusterMarker: IMarker) => {
      clusterMarker.remove();
    });
    this.mapsService.off('camerachange', this.update);
    this.markers = [];
    this.clusterMarkers = [];
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
    if (this.clusterIndex) {
      // 在新增点的时候需要更新 cluster 的数据
      this.clusterIndex.load(this.points);
    }
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

  private getClusterMarker(viewBounds: IBounds, zoom: number) {
    const viewBBox = viewBounds[0].concat(viewBounds[1]);
    const clusterPoint = this.clusterIndex.getClusters(viewBBox, zoom);
    this.clusterMarkers.forEach((marker: IMarker) => {
      marker.remove();
    });
    this.clusterMarkers = [];
    clusterPoint.forEach((feature: any) => {
      const { field, method } = this.markerLayerOption.clusterOption;
      // 处理聚合数据
      if (feature.properties && feature.properties?.cluster_id) {
        const clusterData = this.getLeaves(feature.properties?.cluster_id);
        feature.properties.clusterData = clusterData;
        if (field && method) {
          const columnData = clusterData?.map((item: any) => {
            const data = {
              [field]: item.properties[field],
            };
            return data;
          });
          const column = Satistics.getColumn(columnData as any, field);
          const stat = Satistics.getSatByColumn(method, column);
          const fieldName = 'point_' + method;
          feature.properties[fieldName] = stat.toFixed(2);
        }
      }
      const marker = this.clusterMarker(feature);
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
    if (!this.mapsService) {
      return;
    }
    const zoom = this.mapsService.getZoom();
    const bbox = this.mapsService.getBounds();
    if (
      !this.bbox ||
      Math.abs(zoom - this.zoom) >= 1 ||
      !boundsContains(this.bbox, bbox)
    ) {
      this.bbox = padBounds(bbox, 0.5);
      this.zoom = Math.floor(zoom);
      this.getClusterMarker(this.bbox, this.zoom);
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
    return el;
  }
}
