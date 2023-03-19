/**
 * compact: true
 * inline: true
 */
import {
  CopyOutlined,
  DoubleLeftOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import {
  ChoroplethLayer,
  CustomControl,
  LarkMap,
  LayerPopup,
  LayerPopupProps,
  MapThemeControl,
} from '@antv/larkmap';
import { FeatureCollection } from '@turf/helpers';
import {
  Button,
  Col,
  Descriptions,
  Divider,
  message,
  Radio,
  Row,
  Select,
  Spin,
  Switch,
  Tooltip,
} from 'antd';
import type { BaseSource, DataLevel } from 'district-data';
import { DataSourceMap } from 'district-data';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { downloadData, exportSVG } from '../utils/util';
import './index.less';
import {
  config,
  defaultDataInfo,
  downloadDataLevel,
  downloadDataType,
  editionOptions,
  getChildrenLevel,
  getChildrenList,
  getRawData,
  IDataInfo,
  item,
  layerOptions,
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
  const [panelInfo, setPanelInfo] = useState(openPanel);
  const [loading, setLoading] = useState(false);
  const size = 'middle';
  const [dataInfo, setDataInfo] = useState<IDataInfo>(defaultDataInfo);
  const [drillList, setDrillList] = useState<any[]>([
    {
      currentLevel: 'country',
      currentName: '中国',
      currentCode: 100000,
    },
  ]);
  const childrenLevelList = useMemo(() => {
    return getChildrenList(dataInfo.currentLevel);
  }, [dataInfo.currentLevel]);
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
  const [dataSource, setDataSource] = useState<BaseSource>();

  const getDownloadData = async () => {
    const { currentLevel, hasSubChildren, childrenLevel, currentCode } =
      dataInfo;
    let data;
    if (!hasSubChildren) {
      data = (await dataSource?.getChildrenData({
        parentLevel: currentLevel,
        parentAdcode: currentCode,
        childrenLevel: currentLevel,
      })) as FeatureCollection;
      // 没有子级,取父级数据
    } else {
      data = (await dataSource?.getChildrenData({
        parentLevel: currentLevel,
        parentAdcode: currentCode,
        childrenLevel,
      })) as FeatureCollection;
    }
    return data;
  };

  const onDownload = async () => {
    const { datatype, currentName } = dataInfo;
    const data = await getDownloadData();
    downloadData(currentName, data, datatype);
  };
  const onDownloadSvg = async () => {
    const { currentName } = dataInfo;
    const data = (await getDownloadData()) as FeatureCollection;
    return downloadData(currentName, data, 'SVG');
  };
  const onDownloadRawData = async () => {
    const { dataLevel, datatype } = dataInfo;
    setLoading(true);
    const data = await getRawData(dataLevel);
    setLoading(false);
    downloadData(`全量数据${dataLevel}`, data, datatype);
  };

  const onDownloadGUOJIE = async () => {
    const { datatype } = dataInfo;
    const data = await (
      await fetch(
        'https://mdn.alipayobjects.com/afts/file/A*zMVuS7mKBI4AAAAAAAAAAAAADrd2AQ/%E5%85%A8%E5%9B%BD%E8%BE%B9%E7%95%8C.json',
      )
    ).json();
    downloadData('中国边界', data, datatype);
  };

  const onCopyData = async () => {
    const data = (await getDownloadData()) as FeatureCollection;
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
    const { sourceType, sourceVersion } = dataInfo;
    const currentSource = new DataSourceMap[sourceType]({
      version: sourceVersion,
    });
    setLoading(true);
    setDataSource(currentSource);
    // 初始化数据
    currentSource
      .getChildrenData({
        childrenLevel: 'province',
        parentAdcode: 100000,
        parentLevel: 'country',
        precision: 'low',
      })
      .then((data) => {
        setLayerSource((prevState: any) => ({
          ...prevState,
          data,
        }));
        // 数据预加载
        setTimeout(() => {
          currentSource.getData({ level: 'city' });
        }, 4000);
        setTimeout(() => {
          currentSource.getData({ level: 'county' });
        }, 6000);
        // message.info(`${dataInfo.sourceVersion}版加载完成`);
        setLoading(false);
      });
  }, [dataInfo.sourceType, dataInfo.sourceVersion]);

  // 下钻
  const onDblClick = debounce(async (e: any) => {
    const currentLevel = getChildrenLevel(dataInfo.currentLevel) as DataLevel;
    if (currentLevel === 'county') {
      message.info('已下钻到最底层');
      return;
    }
    setLoading(true);
    const currentInfo = {
      currentLevel,
      currentName: e.feature.properties.name,
      currentCode: e.feature.properties.adcode,
    };
    setDrillList([...drillList, currentInfo]);
    setDataInfo({
      ...dataInfo,
      ...currentInfo,
      childrenLevel: getChildrenLevel(currentLevel),
    });
    const data = await dataSource?.getChildrenData({
      parentLevel: currentInfo.currentLevel,
      parentAdcode: currentInfo.currentCode,
      childrenLevel: getChildrenLevel(currentLevel),
      precision: 'low',
    });
    setLayerSource((prevState: any) => ({
      ...prevState,
      data,
    }));
    setLoading(false);
  }, 600);

  const onUndblclick = debounce(async () => {
    const currentList = drillList.slice(0, drillList.length - 1);
    const currentInfo = currentList[currentList.length - 1];
    const currentLevel = dataInfo.currentLevel;
    if (currentLevel === 'country') {
      message.info('已上卷到最上层');
      return;
    }
    setLoading(true);
    setDataInfo({
      ...dataInfo,
      ...currentInfo,
      childrenLevel: currentLevel,
    });
    setDrillList(currentList);
    const data = await dataSource?.getChildrenData({
      parentLevel: currentInfo.currentLevel,
      parentAdcode: currentInfo.currentCode,
      childrenLevel: currentLevel,
      precision: 'low',
    });
    setLayerSource((prevState: any) => ({
      ...prevState,
      data,
    }));
    setLoading(false);
  }, 600);

  const items: LayerPopupProps['items'] = useMemo(() => {
    return item();
  }, [dataInfo.sourceType, dataInfo.currentLevel]);
  return (
    <Spin spinning={loading} tip={'数据加载中……'}>
      <div
        style={{
          display: 'flex',
        }}
      >
        <LarkMap
          {...config}
          style={{
            height: 'calc(100vh - 240px)',
            width: `calc(100% - ${panelInfo.width}px)`,
          }}
        >
          <ChoroplethLayer
            {...layerOptions}
            source={layerSource}
            onDblClick={onDblClick}
            onUndblclick={onUndblclick}
            id="myChoroplethLayer"
          />
          <LayerPopup
            closeButton={false}
            closeOnClick={false}
            anchor="bottom-left"
            trigger="hover"
            items={items}
          />
          <MapThemeControl position="bottomright" />
          <CustomControl
            position="bottomleft"
            className="custom-control-class"
            style={{
              background: '#fff',
              borderRadius: 4,
              overflow: 'hidden',
              padding: 16,
            }}
          >
            <div>下钻: 双击要下钻的区域</div>
            <div>上卷: 双击非行政区划区域</div>
          </CustomControl>
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
            <Row className="row">
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
            </Row>
            <Divider style={{ margin: '8px 0' }}></Divider>

            <Descriptions title="当前地区">
              <Descriptions.Item style={{ width: '180px' }} label="名称">
                {dataInfo.currentName}
              </Descriptions.Item>
              <Descriptions.Item label="adcode">
                {dataInfo.currentCode}
              </Descriptions.Item>
            </Descriptions>

            <Row className="row">
              <Col span={12} className="label">
                包含子区域:
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Switch
                  style={{ width: '32px' }}
                  checked={dataInfo.hasSubChildren}
                  onChange={onDataConfigChange.bind(null, 'hasSubChildren')}
                />
              </Col>
            </Row>

            {dataInfo.hasSubChildren && (
              <Row className="row">
                <Col span={10} className="label">
                  子区域级别:
                </Col>
                <Col span={14} style={{ textAlign: 'right' }}>
                  <Radio.Group
                    defaultValue={childrenLevelList[0] || 'province'}
                    size={size}
                    value={dataInfo.childrenLevel}
                    onChange={(e) => {
                      onDataConfigChange('childrenLevel', e.target.value);
                    }}
                  >
                    {childrenLevelList.indexOf('province') !== -1 && (
                      <Radio.Button value="province">省</Radio.Button>
                    )}
                    {childrenLevelList.indexOf('city') !== -1 && (
                      <Radio.Button value="city">市</Radio.Button>
                    )}
                    <Radio.Button value="county">县</Radio.Button>
                  </Radio.Group>
                </Col>
              </Row>
            )}

            <Row className="row">
              <Col span={6} className="label">
                数据下载:
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
                  onClick={onDownload}
                />

                <Button
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  icon={<CopyOutlined />}
                  onClick={onCopyData}
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
            <h3>其他下载</h3>
            <Row className="row">
              <Col span={12} className="label">
                中国边界下载{' '}
                <Tooltip
                  placement="top"
                  overlayInnerStyle={{
                    color: '#111',
                  }}
                  color={'#fff'}
                  title={
                    '全国边界下载：包含国界线、海岸线、香港界、海上省界、未定国界等线要素.'
                  }
                >
                  {' '}
                  <InfoCircleOutlined />
                </Tooltip>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  icon={<DownloadOutlined />}
                  onClick={onDownloadGUOJIE}
                  size={size}
                />
              </Col>
            </Row>
            <Row className="row">
              <Col span={12} className="label">
                高精度数据下载{' '}
                <Tooltip
                  placement="top"
                  overlayInnerStyle={{
                    color: '#111',
                  }}
                  color={'#fff'}
                  title={
                    '省市县原始精度下载，数据量比较大，适合线下数据分析场景'
                  }
                >
                  {' '}
                  <InfoCircleOutlined />
                </Tooltip>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Select
                  value={dataInfo.dataLevel}
                  style={{ width: 100 }}
                  size={size}
                  options={downloadDataLevel}
                  onChange={onDataConfigChange.bind(null, 'dataLevel')}
                />
                <Button
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  icon={<DownloadOutlined />}
                  onClick={onDownloadRawData}
                  size={size}
                />
              </Col>
            </Row>

            {/* 全国边界下载：包含国界线、海岸线、香港界、海上省界、未定国界等线要素 */}
            <div className="originData" style={{}}>
              <div>
                <div>数据来源：</div>
                <a
                  href={`${dataSource?.info?.desc?.href}`}
                >{`${dataSource?.info?.desc?.text}`}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};
