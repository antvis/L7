import {
  useSceneService,
  useConfigService,
  LayerGroupEventEnum,
  useLayerService,
} from '@antv/dipper';
import React, { useEffect, useMemo, useState } from 'react';
import { GridLayerGroup } from '@antv/dipper';
const formatLegend = (data: any[]) => {
  return data.map((item) => {
    if (Array.isArray(item.value)) {
      return {
        ...item,
        value: item.value.map((v) => v.toFixed(2)),
      };
    } else {
      return {
        ...item,
        value: item.value.toFixed(2),
      };
    }
  });
};
export function GridLayer() {
  const { layerService } = useLayerService();
  const { sceneService } = useSceneService();
  const { globalConfig, updateLegend, getWidgetsValue } = useConfigService();
  const { layers } = globalConfig;
  const [gridLayer, setGridLayer] = useState<GridLayerGroup>();
  const cityValue = getWidgetsValue('citySelect');
  const [geoData, setGeoData] = useState();

  const layerProps = useMemo(() => {
    return layers.find((item: any) => item.type === 'gridLayer');
  }, [layers]);

  const testData = {
    title: '图例',
    items: [
      {
        colors: ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#b30000'],
        title: '已分配',
      },
      {
        colors: ['#f1eef6', '#bdc9e1', '#74a9cf', '#2b8cbe', '#045a8d'],
        title: '未分配',
      },
    ],
  };

  const updateLayerLegend = (items: any[]) => {
    updateLegend('gridLayerLegend', {
      type: 'multiClassifyColor',
      display: true,
      position: 'bottomleft',
      options: {
        title: '网格',
        unkownName: layerProps.options.unkownName,
        items: [
          {
            colors: ['#BEC3BD', '#A1A6A0', '#828681', '#646763'],
            title: '已分配',
          },
          {
            colors: ['#CFE1B9', '#B0C298', '#90A276', '#718355'],
            title: '未分配',
          },
        ],
        values: items.map((item) => {
          return item.value.map((v) => {
            return (v / 10000).toFixed(2);
          });
        }),
      },
    });
  };

  // 根据筛选器条件请求数据
  useEffect(() => {
    // 可以根据业务需求配置接口
    fetch(
      `https://gw.alipayobjects.com/os/antvdemo/assets/dipper-city/${cityValue[1]}.json`,
    )
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
      });
    // 切换城市 高德地图方法
    sceneService.getScene().map?.setCity(cityValue[1]);
  }, [JSON.stringify(cityValue)]);

  useEffect(() => {
    if (!geoData) {
      return;
    }
    if (gridLayer) {
      gridLayer.setData(geoData);
      return;
    }

    const color = ['#CFE1B9','#B0C298','#90A276','#718355']

    const layer = new GridLayerGroup({
      name: 'grid',
      data: geoData,
      options: {
        ...layerProps.options,
        fill:{
          ...layerProps.options.fill,
          color
        }
      },
    });
    layerService.addLayer(layer);

    layer.on(LayerGroupEventEnum.DATAUPDATE, () => {
      layer.getLegendItem().map((item) => {
        if (Array.isArray(item.value)) {
          return {
            ...item,
            value: item.value.map((v) => v.toFixed(2)),
          };
        } else {
          return {
            ...item,
            value: item.value.toFixed(2),
          };
        }
      });
      updateLayerLegend(formatLegend(layer.getLegendItem()));
    });

    // 更新图例
    updateLayerLegend(formatLegend(layer.getLegendItem()));

    setGridLayer(layer);
  }, [geoData]);

  return <></>;
}
