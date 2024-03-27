/**
 * compact: true
 * inline: true
 */
import {
  CopyOutlined,
  DoubleLeftOutlined,
  DownloadOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { ChoroplethLayer, LarkMap, LayerPopup, LineLayer, MapThemeControl } from '@antv/larkmap';
import type { FeatureCollection } from '@turf/helpers';
import { Button, Col, Descriptions, Divider, Row, Select, Spin, message } from 'antd';
import geobuf from 'geobuf';
import Pbf from 'pbf';
import { useEffect, useState } from 'react';
import { downloadData, exportSVG } from '../utils/util';
import './index.less';
import type { IDataInfo } from './util';
import {
  defaultDataInfo,
  downloadDataType,
  layerOptions,
  lineLayerOptions,
  lineLayerOptions2,
  worldConfig,
} from './util';
const closePanel = {
  width: 20,
  display: 'none',
  rotate: 0,
};
const openPanel = {
  width: 370,
  rotate: 180,
  display: 'block',
};
export default () => {
  const [layerSource, setLayerSource] = useState({
    data: { type: 'FeatureCollection', features: [] },
    parser: { type: 'geojson' },
  });
  const [linedata, setLineData] = useState<any>();
  const [lineLayerSource, setLineLayerSource] = useState({
    data: { type: 'FeatureCollection', features: [] },
    parser: { type: 'geojson' },
  });
  const [lineLayerSource2, setLineLayerSource2] = useState({
    data: { type: 'FeatureCollection', features: [] },
    parser: { type: 'geojson' },
  });
  const [panelInfo, setPanelInfo] = useState(openPanel);
  const [loading, setLoading] = useState(false);
  const size = 'middle';
  const [dataInfo, setDataInfo] = useState<IDataInfo>(defaultDataInfo);

  const onDataConfigChange = (type: string, value: any) => {
    setDataInfo({
      ...dataInfo,
      [type]: value,
    });
  };
  useEffect(() => {
    const width = document.body.clientWidth;
    if (width < 768) {
      setPanelInfo(closePanel);
    }
  }, []);

  const getDownloadData = async (type?: string = 'fill') => {
    return type === 'line' ? linedata : layerSource.data;
  };

  const onDownload = async (type: string) => {
    const { datatype, currentName } = dataInfo;
    const data = await getDownloadData(type);
    downloadData(currentName, data, datatype);
  };
  const onDownloadSvg = async () => {
    const { currentName } = dataInfo;
    const data = (await getDownloadData()) as FeatureCollection;
    return downloadData(currentName, data, 'SVG');
  };

  const onCopyData = async (type) => {
    const data = (await getDownloadData(type)) as FeatureCollection;
    navigator.clipboard.writeText(JSON.stringify(data));
    message.success('复制成功');
  };
  const onCopySvg = async () => {
    const data = (await getDownloadData()) as FeatureCollection;
    const svgstring = await exportSVG(data);
    navigator.clipboard.writeText(svgstring);
    message.success('复制成功');
  };

  // 切换数据源
  useEffect(() => {
    setLoading(true);
    fetch('https://npm.elemecdn.com/xingzhengqu@2.0.8/data/world_polygon.pbf')
      .then((res) => res.arrayBuffer())
      .then((data) => {
        const jsonData = geobuf.decode(new Pbf(data)) as FeatureCollection;
        setLayerSource({ data: jsonData, parser: { type: 'geojson' } });
        setLoading(false);
      });
    fetch('https://npm.elemecdn.com/xingzhengqu@2.0.8/data/world_line.pbf')
      .then((res) => res.arrayBuffer())
      .then((data) => {
        const jsonData = geobuf.decode(new Pbf(data)) as FeatureCollection;
        setLineData(jsonData);
        const linedata1 = {
          // 确定边界
          type: 'FeatureCollection',
          features: jsonData.features.filter((item) => {
            return ['0', '2', '7', '9'].indexOf(item.properties?.type.replace('\x00', '')) !== -1;
          }),
        };
        const linedata2 = {
          // 确定边界
          type: 'FeatureCollection',
          features: jsonData.features.filter((item) => {
            return ['1', '8', '10', '11'].indexOf(item.properties?.type.replace('\x00', '')) !== -1;
          }),
        };

        setLineLayerSource({ data: linedata1, parser: { type: 'geojson' } });
        setLineLayerSource2({ data: linedata2, parser: { type: 'geojson' } });
      });
  }, []);

  return (
    <Spin spinning={loading} tip={'数据加载中……'}>
      <div
        style={{
          display: 'flex',
        }}
      >
        <LarkMap
          {...worldConfig}
          style={{
            height: 'calc(100vh - 240px)',
            width: `calc(100% - ${panelInfo.width}px)`,
          }}
        >
          <ChoroplethLayer {...layerOptions} source={layerSource} id="myChoroplethLayer" />
          <LineLayer {...lineLayerOptions} source={lineLayerSource} id="lineLayer"></LineLayer>
          <LineLayer {...lineLayerOptions2} source={lineLayerSource2} id="lineLayer"></LineLayer>
          <LayerPopup
            closeButton={false}
            closeOnClick={false}
            anchor="bottom-left"
            trigger="hover"
            items={[
              {
                layer: 'myChoroplethLayer',
                fields: [
                  {
                    field: 'NAME_CHN',
                    formatField: () => '名称',
                  },
                  {
                    field: 'SOC',
                    formatField: '行政编号',
                  },
                ],
              },
            ]}
          />
          <MapThemeControl position="bottomright" />
        </LarkMap>
        <div className="panel" style={{ width: panelInfo.width }}>
          <div className="toggle">
            <DoubleLeftOutlined
              title="展开收起"
              rotate={panelInfo.rotate}
              className="icon"
              onClick={() => {
                setPanelInfo(panelInfo.width === 20 ? openPanel : closePanel);
              }}
            />
          </div>
          <div style={{ paddingLeft: '10px', display: panelInfo.display }}>
            {/* <Row className="row">
              <Col span={8} className="label">
                版本：
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <Select
                  value={dataInfo.sourceVersion}
                  size={'small'}
                  onChange={onDataConfigChange.bind(null, 'sourceVersion')}
                  options={editionOptions[dataInfo.sourceType]}
                />
              </Col>
            </Row> */}
            <Divider style={{ margin: '8px 0' }}></Divider>

            <Descriptions title="当前地区">
              <Descriptions.Item style={{ width: '180px' }} label="名称">
                {dataInfo.currentName}
              </Descriptions.Item>
              <Descriptions.Item label="adcode">{dataInfo.currentCode}</Descriptions.Item>
            </Descriptions>

            <Row className="row">
              <Col span={6} className="label">
                面数据:
              </Col>
              <Col span={18} style={{ textAlign: 'right' }}>
                <Select
                  value={dataInfo.datatype}
                  style={{ width: 120 }}
                  size={size}
                  options={downloadDataType}
                  onChange={onDataConfigChange.bind(null, 'datatype')}
                />

                <Button
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  icon={<DownloadOutlined />}
                  size={size}
                  onClick={onDownload.bind(null, 'fill')}
                />

                <Button
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  icon={<CopyOutlined />}
                  onClick={onCopyData.bind(null, 'fill')}
                  size={size}
                />
              </Col>
            </Row>
            <Row className="row">
              <Col span={6} className="label">
                国界数据:
              </Col>
              <Col span={18} style={{ textAlign: 'right' }}>
                <Select
                  value={dataInfo.datatype}
                  style={{ width: 120 }}
                  size={size}
                  options={downloadDataType}
                  onChange={onDataConfigChange.bind(null, 'datatype', 'line')}
                />

                <Button
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  icon={<DownloadOutlined />}
                  size={size}
                  onClick={onDownload.bind(null, 'line')}
                />

                <Button
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  icon={<CopyOutlined />}
                  onClick={onCopyData.bind(null, 'fill')}
                  size={size}
                />
              </Col>
            </Row>
            <Row className="row">
              <Col span={6} className="label">
                SVG下载:
              </Col>
              <Col span={18} style={{ textAlign: 'right' }}>
                <Button style={{ pointerEvents: 'none', width: 120 }}>
                  {' '}
                  <PictureOutlined /> SVG{' '}
                </Button>
                <Button
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  icon={<DownloadOutlined />}
                  size={size}
                  onClick={onDownloadSvg}
                />

                <Button
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  icon={<CopyOutlined />}
                  onClick={onCopySvg}
                  size={size}
                />
              </Col>
            </Row>

            {/* 全国边界下载：包含国界线、海岸线、香港界、海上省界、未定国界等线要素 */}
            <div className="originData" style={{}}>
              <div>
                <div>数据来源：</div>
                <a href={`https://lbs.amap.com/api/jsapi-v2/guide/layers/districtlayer`}>
                  {'高德地图'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};
