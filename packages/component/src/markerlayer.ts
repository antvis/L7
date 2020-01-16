import { IMapService, IMarker, TYPES } from '@antv/l7-core';
import { bindAll, DOM } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';
import { isFunction } from 'lodash';
import Supercluster from 'supercluster';
import Marker from './marker';
type CallBack = (...args: any[]) => any;
interface IMarkerStyleOption {
  el: HTMLDivElement | string;
  style: { [key: string]: any } | CallBack;
  className: string;
  radius: number;
  maxZoom: number;
  minZoom: number;
  zoom: number;
}

interface IMarkerLayerOption {
  cluster: boolean;
  clusterOption: IMarkerStyleOption;
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
    this.markerLayerOption = {
      ...this.getDefault(),
      ...option,
    };
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
        el: '',
      },
    };
  }
  public addTo(scene: Container) {
    // this.remove();
    this.scene = scene;
    this.mapsService = scene.get<IMapService>(TYPES.IMapService);
    this.initCluster();
    this.update();
    this.mapsService.on('zoom', this.update);
    this.mapsService.on('zoomchange', this.update);
    this.addMarkers();
    return this;
  }
  public addMarker(marker: IMarker) {
    const cluster = this.markerLayerOption.cluster;
    if (cluster) {
      this.addPoint(marker);
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
    this.mapsService.off('zoomchange', this.update);
    this.markers = [];
  }

  public destroy() {
    this.clear();
    this.removeAllListeners();
  }

  private addPoint(marker: IMarker) {
    const { lng, lat } = marker.getLnglat();
    const feature: IPointFeature = {
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: marker.getExtData(),
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
      const marker =
        feature.properties && feature.properties.hasOwnProperty('point_count')
          ? this.clusterMarker(feature)
          : this.normalMarker(feature);

      this.clusterMarkers.push(marker);
      marker.addTo(this.scene);
    });
  }
  private clusterMarker(feature: any) {
    const clusterOption = this.markerLayerOption.clusterOption;

    const { className = '', style } = clusterOption as IMarkerStyleOption;
    const el = DOM.create('div', 'l7-marker-cluster');
    const label = DOM.create('div', '', el);
    const span = DOM.create('span', '', label);
    if (className !== '') {
      DOM.addClass(el, className);
    }
    span.textContent = feature.properties.point_count;
    const elStyle = isFunction(style)
      ? style(feature.properties.point_count)
      : style;

    Object.keys(elStyle).forEach((key: string) => {
      // @ts-ignore
      el.style[key] = elStyle[key];
    });
    const marker = new Marker({
      element: el,
    }).setLnglat({
      lng: feature.geometry.coordinates[0],
      lat: feature.geometry.coordinates[1],
    });
    return marker;
  }
  private normalMarker(feature: any) {
    const marker = new Marker().setLnglat({
      lng: feature.geometry.coordinates[0],
      lat: feature.geometry.coordinates[1],
    });
    return marker;
  }
  private update() {
    const zoom = this.mapsService.getZoom();
    if (Math.abs(zoom - this.zoom) > 1) {
      this.getClusterMarker(Math.floor(zoom));
      this.zoom = Math.floor(zoom);
    }
  }
}
