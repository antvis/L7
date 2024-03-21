/* eslint-disable no-undef */
import { LineLayer, Marker, PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import 'district-data';

function csvToJson(csv) {
  // 将CSV数据按行分割
  const lines = csv.split('\n').filter((line) => line.trim() !== '');

  // 假设第一行是列标题
  const headers = lines[0].split(',').filter((header) => header.trim() !== '');

  // 逐行处理CSV数据
  const result = lines.slice(1).map((line) => {
    // 将每行按照逗号分割成数组，并过滤掉空字符串
    const values = line.split(',').filter((value) => value.trim() !== '');
    // 根据标题和当前行的值创建一个对象
    const obj = headers.reduce((object, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
    return obj;
  });
  // 将结果转换为JSON字符串
  return result;
}

async function getProvinceCapitalCoordinates(provinceName) {
  const url = `https://restapi.amap.com/v3/geocode/geo?key=98d10f05a2da96697313a2ce35ebf1a2&address=${provinceName}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === '1' && data.geocodes.length > 0) {
      const location = data.geocodes[0].location; // "经度,纬度"
      const [lng, lat] = location.split(',');
      // 返回经纬度数据
      return { lng, lat };
    }
  } catch (error) {
    console.error('请求出错:', error);
    return null;
  }
}
const source = new District.RDBSource({
  version: '2023',
});
const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [111.4453125, 32.84267363195431],
    pitch: 40,
    zoom: 4,
  }),
});

scene.addImage(
  '00',
  'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*PPo0QYHNResAAAAAAAAAAAAADmJ7AQ/original',
);
scene.addImage(
  '01',
  'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*epXiTZ8B1McAAAAAAAAAAAAADmJ7AQ/original',
);
scene.addImage(
  '02',
  'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*6WGaQKkJppIAAAAAAAAAAAAADmJ7AQ/original',
);

scene.setBgColor('#131722');
scene.on('loaded', () => {
  const map = document.getElementById('map');
  map.style.background = '#131722';
  source
    .getData({
      level: 'province',
    })
    .then((data) => {
      fetch(
        'https://mass-office.alipay.com/huamei_koqzbu/afts/file/pJFyS4tqW2UAAAAAAAAAABAADnV5AQBr/%E5%A4%A7%E5%B1%8Fmock%E6%95%B0%E6%8D%AE.csv',
      )
        .then((res) => res.text())
        .then((csvData) => {
          console.log(csvToJson(csvData));
          const jsonData = csvToJson(csvData)
            .filter(
              (item) =>
                item.hy_name !== 'ALL' &&
                item.sec_type === 'ALL' &&
                item.hy_name !== '高速' &&
                item.prov_name !== 'ALL' &&
                item.prov_name !== '未知',
            )
            .map(async (data) => {
              return {
                ...data,
                ...(await getProvinceCapitalCoordinates(data.prov_name)),
              };
            });
          Promise.all(jsonData).then((data) => {
            const powerData = data.filter((item) => item.hy_name === '充电');

            console.log(powerData);
            const pointLayer = new PointLayer({
              depth: false,
              zIndex: 11,
              heightFixed: true,
            })
              .source(powerData, {
                parser: {
                  type: 'json',
                  x: 'lng',
                  y: 'lat',
                },
              })
              .shape('cylinder')
              .size([6, 6, 90])
              .active(true)
              .color('rgb(57,255,20)')
              .style({
                opacity: 1,
                opacityLinear: {
                  enable: true, // true - false
                  dir: 'up', // up - down
                },
                lightEnable: false,
              });
            const pointLayer2 = new PointLayer({ zIndex: 10 })
              .source(powerData, {
                parser: {
                  type: 'json',
                  x: 'lng',
                  y: 'lat',
                },
              })
              .shape('circle')
              .active(true)
              .animate(true)
              .size(30)
              .color('rgb(57,255,20)');
            const textLayer = new PointLayer({ zIndex: 2 })
              .source(powerData, {
                parser: {
                  type: 'json',
                  x: 'lng',
                  y: 'lat',
                },
              })
              .shape('trd_cnt_1d', 'text')
              .size(14)
              .color('#0ff')
              .style({
                textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
                spacing: 2, // 字符间距
                padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
                stroke: '#0ff', // 描边颜色
                strokeWidth: 0.2, // 描边宽度
                raisingHeight: 2551000,
                textAllowOverlap: true,
                heightFixed: true,
              });
            const imageLayer = new PointLayer({ zIndex: 15 })
              .source(powerData, {
                parser: {
                  type: 'json',
                  x: 'lng',
                  y: 'lat',
                },
              })
              .shape('00')
              .size(10)
              .style({
                raisingHeight: 110,
              });
            scene.addLayer(pointLayer);
            scene.addLayer(pointLayer2);
            scene.addLayer(textLayer);
            scene.addLayer(imageLayer);

            const refuelData = data
              .filter((item) => item.hy_name === '加油')
              .map((item) => {
                return { ...item, lat: +item.lat + 3 };
              });

            const refuelPointLayer = new PointLayer({
              depth: false,
              zIndex: 11,
              heightFixed: true,
            })
              .source(refuelData, {
                parser: {
                  type: 'json',
                  x: 'lng',
                  y: 'lat',
                },
              })
              .shape('cylinder')
              .size([6, 6, 90])
              .active(true)
              .color('#ffffff')
              .style({
                offsets: [10, 0],
                opacity: 1,
                opacityLinear: {
                  enable: true, // true - false
                  dir: 'up', // up - down
                },
                lightEnable: false,
              });
            const refuelPointLayer2 = new PointLayer({ zIndex: 10 })
              .source(refuelData, {
                parser: {
                  type: 'json',
                  x: 'lng',
                  y: 'lat',
                },
              })
              .shape('circle')
              .active(true)
              .animate(true)
              .size(30)
              .color('#ffffff');
            const refuelTextLayer = new PointLayer({ zIndex: 2 })
              .source(refuelData, {
                parser: {
                  type: 'json',
                  x: 'lng',
                  y: 'lat',
                },
              })
              .shape('trd_cnt_1d', 'text')
              .size(14)
              .color('#fff')
              .style({
                textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
                spacing: 2, // 字符间距
                padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
                stroke: '#fff', // 描边颜色
                strokeWidth: 0.2, // 描边宽度
                raisingHeight: 2551000,
                textAllowOverlap: true,
                heightFixed: true,
              });
            const refuelImageLayer = new PointLayer({ zIndex: 15 })
              .source(refuelData, {
                parser: {
                  type: 'json',
                  x: 'lng',
                  y: 'lat',
                },
              })
              .shape('01')
              .size(10)
              .style({
                raisingHeight: 110,
              });
            scene.addLayer(refuelPointLayer);
            scene.addLayer(refuelPointLayer2);
            scene.addLayer(refuelTextLayer);
            scene.addLayer(refuelImageLayer);
            const stopData = data.filter((item) => item.hy_name === '停车');
            console.log(stopData);
            for (let i = 0; i < stopData.length; i++) {
              const el = document.createElement('label');
              el.innerHTML = `<div style="display: flex;flex-direction: column;justify-content: flex-end;align-items: center;height: 100%;"><div>${stopData[i].trd_cnt_1d}</div> <div>天</div></div>`;
              el.style.background = '#e24c4c8c';
              el.style.borderRadius = '50%'; // 圆角半径设为半个宽度/高度，形成圆形
              el.style.width = '50px';
              el.style.height = '50px';
              el.style.borderColor = '#e24c4c8c';
              el.style.textAlign = 'center';
              el.style.color = '#fff';
              const marker = new Marker({
                element: el,
                offsets: [50, 10],
              }).setLnglat({
                lng: Number(stopData[i].lng) * 1,
                lat: Number(stopData[i].lat),
              });
              scene.addMarker(marker);
            }
          });
        });

      const newFeatures = data.features.filter((item) => {
        return item.properties.name;
      });
      const newData = {
        type: 'FeatureCollection',
        features: newFeatures,
      };
      const lineDown = new LineLayer()
        .source(newData)
        .shape('line')
        .color('#989494')
        .size(1)
        .style({
          raisingHeight: 200000,
        });

      scene.addLayer(lineDown);
      return '';
    });

  source
    .getData({
      level: 'country',
    })
    .then((data) => {
      const provincelayer = new PolygonLayer({})
        .source(data)
        .size(650000)
        .shape('extrude')
        .color('#1c355c')
        .style({
          heightfixed: true,
          pickLight: true,
          sourceColor: '#5886CF',
          targetColor: '#5886CF',
          //   raisingHeight: 200000,
          opacity: 0.8,
        });
      const boundaryLine = new LineLayer({ zIndex: 10 })
        .source(data)
        .shape('line')
        .color('#5dddff')
        .size(2)

        .style({
          raisingHeight: 650000,
        });

      scene.addLayer(boundaryLine);

      scene.addLayer(provincelayer);

      return '';
    });
  return '';
});
