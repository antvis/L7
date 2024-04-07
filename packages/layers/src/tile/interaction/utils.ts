import type { ILayer } from '@antv/l7-core';
import { decodePickingColor } from '@antv/l7-utils';

export function clearPickState(layers: ILayer[]) {
  layers
    .filter((layer) => layer.inited && layer.isVisible())
    .filter((layer) => layer.getCurrentSelectedId() !== null)
    .map((layer) => {
      selectFeature(layer, new Uint8Array([0, 0, 0, 0]));
      layer.setCurrentSelectedId(null);
    });
}

export function setSelect(layers: ILayer[], pickedColors: any, renderList: ILayer[]) {
  const selectedId = decodePickingColor(pickedColors);
  let pickColor;
  layers.map((layer) => {
    if (layer.getCurrentSelectedId() === null || selectedId !== layer.getCurrentSelectedId()) {
      selectFeature(layer, pickedColors);
      layer.setCurrentSelectedId(selectedId);
      pickColor = pickedColors;
    } else {
      selectFeature(layer, new Uint8Array([0, 0, 0, 0])); // toggle select
      layer.setCurrentSelectedId(null);
      pickColor = null;
    }
  });
  // unselect normal layer
  renderList
    .filter((layer) => layer.inited && layer.isVisible() && layer.needPick('click'))
    .filter((layer) => layer.getCurrentSelectedId() !== null)
    .map((layer) => {
      selectFeature(layer, new Uint8Array([0, 0, 0, 0]));
      layer.setCurrentSelectedId(null);
    });
  return pickColor;
}

export function setHighlight(layers: ILayer[], pickedColors: any) {
  const pickId = decodePickingColor(pickedColors);
  layers
    .filter((layer) => layer.inited && layer.isVisible())
    // @ts-ignore
    .filter((layer) => layer.getPickID() !== pickId)
    .map((layer) => {
      // @ts-ignore
      layer.setPickID(pickId);
      layer.hooks.beforeHighlight.call(pickedColors);
    });
}

export function setPickState(layers: ILayer[], pickColors: { select: any; active: any }) {
  if (pickColors.select) {
    layers.map((layer) => {
      selectFeature(layer, pickColors.select);
    });
  }

  if (pickColors.active) {
    layers
      .filter((layer) => layer.inited && layer.isVisible())
      .map((layer) => {
        layer.hooks.beforeHighlight.call(pickColors.active);
      });
  }
}

export function selectFeature(layer: ILayer, pickedColors: Uint8Array | undefined) {
  // @ts-ignore
  const [r, g, b] = pickedColors;
  layer.hooks.beforeSelect.call([r, g, b]);
}

export function setFeatureSelect(color: any, layers: ILayer[]) {
  const id = decodePickingColor(color);
  layers.map((layer) => {
    selectFeature(layer, color);
    layer.setCurrentSelectedId(id);
  });
}

export function setFeatureActive(color: any, layers: ILayer[]) {
  const id = decodePickingColor(color);
  layers.map((layer) => {
    layer.hooks.beforeHighlight.call(color);
    layer.setCurrentPickId(id);
  });
}
