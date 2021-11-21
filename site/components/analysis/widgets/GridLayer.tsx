import {
  useSceneService,
  useConfigService,
  LayerGroupEventEnum,
  useLayerService,
} from '@antv/dipper';
import React, { useEffect, useMemo, useState } from 'react';
import { GridLayerGroup } from '@antv/dipper';
import { randomNumBoth } from '../configs/mock';
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
  const brandValue = getWidgetsValue('brand');
  const [geoData, setGeoData] = useState();

  const layerProps = useMemo(() => {
    return layers.find((item: any) => item.type === 'gridLayer');
  }, [layers]);

  const updateLayerLegend = (items: any[]) => {
    updateLegend('gridLayerLegend', {
      type: 'classifyColor',
      display: true,
      position: 'bottomleft',
      options: {
        title: '充电宝投放数量',
        unkownName: layerProps.options.unkownName,
        items: items.map((item) => {
          return {
            color: item.color,
            value: item.value.map((v) => {
              return (v / 10000).toFixed(2);
            }),
          };
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
        const geoDataList =
          data &&
          data.features?.map((item) => {
            return {
              ...item,
              properties: {
                ...item.properties,
                brand_type: randomNumBoth(1, 4).toString(), // 充电宝品牌
              },
            };
          });

        // 品牌 过滤
        if (brandValue && geoDataList) {
          // @ts-ignore
          const data =
            brandValue === '1'
              ? geoDataList
              : geoDataList.filter(
                  (item) => item.properties.brand_type === brandValue,
                );
          if (data.length) {
            // @ts-ignore
            setGeoData({ type: 'FeatureCollection', features: data });
          }
        } else {
          // @ts-ignore
          setGeoData({ type: 'FeatureCollection', features: geoDataList });
        }
      });
    // 切换城市 高德地图方法
    sceneService.getScene().map?.setCity(cityValue[1]);
  }, [JSON.stringify(cityValue), brandValue]);

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
      data: geoData,
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
