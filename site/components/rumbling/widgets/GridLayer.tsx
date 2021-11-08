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

  const updateLayerLegend = (items: any[]) => {
    updateLegend('gridLayerLegend', {
      type: 'discreteColor',
      display: true,
      position: 'bottomleft',
      options: {
        targetName: '区域类型',
        unkownName: layerProps.options.unkownName,
        items,
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

    const layer = new GridLayerGroup({
      name: 'grid',
      geodata: geoData,
      options: layerProps.options,
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
