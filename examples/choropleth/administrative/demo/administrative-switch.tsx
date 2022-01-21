import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Cascader } from 'antd';
import { Choropleth } from '@antv/l7plot';

function AdministrativeSwitch() {
  const administrativeList = useRef([]);
  const [administrativeTree, setAdministrativeTree] = useState([]);
  const map = useRef<Choropleth>();

  const getRandomNumber = (min = 10, max = 2000) => {
    return Math.random() * (max - min) + min;
  };

  useEffect(() => {
    fetch(
      `https://gw.alipayobjects.com/os/alisis/geo-data-v0.1.1/administrative-data/area-tree.json`,
    )
      .then((response) => response.json())
      .then((data) => {
        const china = data.filter(({ adcode }) => adcode === 100000);
        setAdministrativeTree(china);
      });
  }, []);

  useEffect(() => {
    fetch(
      `https://gw.alipayobjects.com/os/alisis/geo-data-v0.1.1/administrative-data/area-list.json`,
    )
      .then((response) => response.json())
      .then((list) => {
        administrativeList.current = list;
        const data = list
          .filter(({ level }) => level === 'province')
          .map((item) => Object.assign({}, item, { value: getRandomNumber() }));

        const chinaMap = new Choropleth('mapContainer', {
          map: {
            type: 'mapbox',
            style: 'blank',
            center: [120.19382669582967, 30.258134],
            zoom: 3,
            pitch: 0,
          },
          source: {
            data: data,
            joinBy: {
              sourceField: 'adcode',
              geoField: 'adcode',
            },
          },
          viewLevel: {
            level: 'country',
            adcode: '100000',
          },
          autoFit: true,
          color: {
            field: 'value',
            value: ['#B8E1FF', '#7DAAFF', '#3D76DD', '#0047A5', '#001D70'],
            scale: { type: 'quantize' },
          },
          style: {
            opacity: 1,
            stroke: '#ccc',
            lineWidth: 0.6,
            lineOpacity: 1,
          },
          chinaBorder: {
            // 国界
            national: { color: '#ccc', width: 1, opacity: 1 },
            // 争议
            dispute: {
              color: '#ccc',
              width: 1,
              opacity: 0.8,
              dashArray: [2, 2],
            },
            // 海洋
            coast: { color: '#ccc', width: 0.7, opacity: 0.8 },
            // 港澳
            hkm: { color: 'gray', width: 0.7, opacity: 0.8 },
          },
          label: {
            visible: true,
            field: 'name',
            style: {
              fill: '#000',
              opacity: 0.8,
              fontSize: 10,
              stroke: '#fff',
              strokeWidth: 1.5,
              textAllowOverlap: false,
              padding: [5, 5],
            },
          },
          state: {
            active: { stroke: 'black', lineWidth: 1 },
          },
          tooltip: {
            items: ['name', 'adcode', 'value'],
          },
          zoom: {
            position: 'bottomright',
          },
          legend: {
            position: 'bottomleft',
          },
        });

        map.current = chinaMap;
      });

    return () => map.current?.destroy();
  }, []);

  const onCascaderChange = (value, selectedOptions) => {
    const currentSelected = selectedOptions[selectedOptions.length - 1];
    const { adcode, level, children } = currentSelected;
    if (map.current) {
      const data = children
        ? children.map((item) => ({
            adcode: item.adcode,
            value: getRandomNumber(),
          }))
        : [{ adcode, value: getRandomNumber() }];
      map.current.changeView({ adcode, level }, { source: { data } });
    }
  };

  return (
    <>
      <div
        id="mapContainer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      {administrativeTree.length && (
        <Cascader
          style={{
            width: 300,
            zIndex: 2,
            position: 'absolute',
            right: '10px',
            top: '10px',
          }}
          changeOnSelect
          allowClear={false}
          fieldNames={{ label: 'name', value: 'adcode', children: 'children' }}
          defaultValue={[100000]}
          options={administrativeTree}
          onChange={onCascaderChange}
        />
      )}
    </>
  );
}

ReactDOM.render(<AdministrativeSwitch />, document.getElementById('map'));
