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
      this.mapsService.on('zoom', this.update);
      this.mapsService.on('zoomchange', this.update);
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
    this.mapsService.off('zoom', this.update);
    this.mapsService.off('zoomchange', this.update);
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
    const clusterPoint = this.clusterIndex.getClusters(
      [-180, -85, 180, 85],
      zoom,
    );
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
    if (Math.abs(zoom - this.zoom) > 1) {
      this.getClusterMarker(Math.floor(zoom));
      this.zoom = Math.floor(zoom);
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
