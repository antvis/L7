import {
  LayerEvent,
  LineLayer,
  MapboxScene,
  Marker,
  PointLayer,
  PolygonLayer,
  Popup,
} from '@antv/l7-react';
import * as React from 'react';
import ReactDOM from 'react-dom';
const colors = [
  '#732200',
  '#CC3D00',
  '#FF6619',
  '#FF9466',
  '#FFC1A6',
  '#FCE2D7',
  '#ffffff',
].reverse();
function joinData(geodata: any, ncovData: any) {
  const ncovDataObj: any = {};
  ncovData.forEach((item: any) => {
    const {
      countryName,
      countryEnglishName,
      currentConfirmedCount,
      confirmedCount,
      suspectedCount,
      curedCount,
      deadCount,
    } = item;
    if (countryName === '中国') {
      if (!ncovDataObj[countryName]) {
        ncovDataObj[countryName] = {
          countryName,
          countryEnglishName,
          currentConfirmedCount: 0,
          confirmedCount: 0,
          suspectedCount: 0,
          curedCount: 0,
          deadCount: 0,
        };
      } else {
        ncovDataObj[countryName].currentConfirmedCount += currentConfirmedCount;
        ncovDataObj[countryName].confirmedCount += confirmedCount;
        ncovDataObj[countryName].suspectedCount += suspectedCount;
        ncovDataObj[countryName].curedCount += curedCount;
        ncovDataObj[countryName].deadCount += deadCount;
      }
    } else {
      ncovDataObj[countryName] = {
        countryName,
        countryEnglishName,
        currentConfirmedCount,
        confirmedCount,
        suspectedCount,
        curedCount,
        deadCount,
      };
    }
  });
  const geoObj: any = {};
  geodata.features.forEach((feature: any) => {
    const { name } = feature.properties;
    geoObj[name] = feature.properties;
    const ncov = ncovDataObj[name] || {};
    feature.properties = {
      ...feature.properties,
      ...ncov,
    };
  });
  return geodata;
}

const World = React.memo(function Map() {
  const [data, setData] = React.useState();
  const [filldata, setfillData] = React.useState();
  const [popupInfo, setPopupInfo] = React.useState<{
    lnglat: number[];
    feature: any;
  }>();
  React.useEffect(() => {
    const fetchData = async () => {
      const [geoData, ncovData] = await Promise.all([
        fetch(
          'https://gw.alipayobjects.com/os/bmw-prod/e62a2f3b-ea99-4c98-9314-01d7c886263d.json',
        ).then((d) => d.json()),
       // https://lab.isaaclin.cn/nCoV/api/area?latest=1
       fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/55a7dd2e-3fb4-4442-8899-900bb03ee67a.json',
      ).then((d) => d.json()),
      ]);
      const worldData = joinData(geoData, ncovData.results);
      const pointdata = worldData.features.map((feature: any) => {
        return feature.properties;
      });
      setfillData(worldData);
      setData(pointdata);
    };
    fetchData();
  }, []);
  function showPopup(args: any): void {
    setPopupInfo({
      lnglat: args.lngLat,
      feature: args.feature,
    });
  }

  return (
    <>
      <MapboxScene
        map={{
          center: [110.19382669582967, 50.258134],
          pitch: 0,
          style: 'blank',
          zoom: 1,
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {popupInfo && (
          <Popup lnglat={popupInfo.lnglat}>
            {popupInfo.feature.name}
            <ul
              style={{
                margin: 0,
              }}
            >
              <li>现有确诊:{popupInfo.feature.currentConfirmedCount}</li>
              <li>累计确诊:{popupInfo.feature.confirmedCount}</li>
              <li>治愈:{popupInfo.feature.curedCount}</li>
              <li>死亡:{popupInfo.feature.deadCount}</li>
            </ul>
          </Popup>
        )}
        {data && [
          <PolygonLayer
            key={'1'}
            options={{
              autoFit: true,
            }}
            source={{
              data: filldata,
            }}
            scale={{
              values: {
                confirmedCount: {
                  type: 'quantile',
                },
              },
            }}
            color={{
              values: '#ddd',
            }}
            shape={{
              values: 'fill',
            }}
            style={{
              opacity: 1,
            }}
          />,
          <LineLayer
            key={'3'}
            source={{
              data: filldata,
            }}
            size={{
              values: 0.6,
            }}
            color={{
              values: '#fff',
            }}
            shape={{
              values: 'line',
            }}
            style={{
              opacity: 1,
            }}
          />,
          <PointLayer
            key={'2'}
            options={{
              autoFit: true,
            }}
            source={{
              data,
              parser: {
                type: 'json',
                coordinates: 'centroid',
              },
            }}
            scale={{
              values: {
                confirmedCount: {
                  type: 'log',
                },
              },
            }}
            color={{
              field: 'confirmedCount',
              values: (count) => {
                return count > 10000
                  ? colors[6]
                  : count > 1000
                  ? colors[5]
                  : count > 500
                  ? colors[4]
                  : count > 100
                  ? colors[3]
                  : count > 10
                  ? colors[2]
                  : count > 1
                  ? colors[1]
                  : colors[0];
              },
            }}
            shape={{
              values: 'circle',
            }}
            active={{
              option: {
                color: '#0c2c84',
                mix: .6,
              },
            }}
            size={{
              field: 'confirmedCount',
              values: [0, 30],
            }}
            style={{
              opacity: 0.8,
            }}
          >
            <LayerEvent type="mousemove" handler={showPopup} />
          </PointLayer>,
          <PointLayer
            key={'5'}
            source={{
              data,
              parser: {
                type: 'json',
                coordinates: 'centroid',
              },
            }}
            color={{
              values: '#fff',
            }}
            shape={{
              field: 'countryName',
              values: 'text',
            }}
            filter={{
              field: 'currentConfirmedCount',
              values: (v) => {
                return v > 500;
              },
            }}
            size={{
              values: 12,
            }}
            style={{
              opacity: 1,
              strokeOpacity: 1,
              strokeWidth: 0,
            }}
          >
            <LayerEvent type="mousemove" handler={showPopup} />
          </PointLayer>,
        ]}
      </MapboxScene>
    </>
  );
});
ReactDOM.render(<World />, document.getElementById('map'));
