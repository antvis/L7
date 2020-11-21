import { AMapScene, Marker, PointLayer } from '@antv/l7-react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.less';

const MarkerPinImg = {
  green:
    'https://gw.alipayobjects.com/mdn/rms_855bab/afts/img/A*JhBbT4LvHpQAAAAAAAAAAAAAARQnAQ',
  blue:
    'https://gw.alipayobjects.com/mdn/rms_855bab/afts/img/A*n6cXTb8R7iUAAAAAAAAAAAAAARQnAQ',
};
const MarkerInfo = ({ title }) => {
  return (
    <div className="markerContent">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '32px',
          padding: '0.05rem',
          background: '#1677ff',
          borderRadius: '44px',
        }}
      >
        <div
          style={{
            color: '#fff',
            fontSize: '12px',
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          style={{
            width: '20px',
            height: '30px',
          }}
          alt="marker"
          src={MarkerPinImg.blue}
        />
      </div>
    </div>
  );
};

const World = React.memo(function Map() {
  const [data, setData] = React.useState();
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
      );
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);
  return (
    <AMapScene
      map={{
        center: [121.4316962, 31.26082325],
        pitch: 0,
        style: 'light',
        zoom: 15,
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {data &&
        data.map((item: any) => {
          return (
            <Marker key={item.id} lnglat={[item.longitude, item.latitude]}>
              <MarkerInfo title={item.name} />
            </Marker>
          );
        })}
    </AMapScene>
  );
});

ReactDOM.render(<World />, document.getElementById('map'));
