// import Flatbush from 'flatbush';
// https://github.com/mourner/kdbush
import type { Scene } from '@antv/l7-scene';
import KDBush from 'kdbush';
import type { TestCase } from '../../types';

export const idw: TestCase = async (options) => {
  const rawdata = await (
    await fetch('https://mdn.alipayobjects.com/afts/file/A*yHeJTaQ6iVsAAAAAAAAAAAAADrd2AQ/aqi.json')
  ).json();
  const data = rawdata.map((row: any) => {
    const { CityCode, Area, PositionName, Latitude, Longitude, AQI } = row;
    return {
      CityCode,
      Area,
      PositionName,
      Latitude: Latitude * 1,
      Longitude: Longitude * 1,
      AQI: AQI * 1,
    };
  });
  const dataIndex = new KDBush(data.length);
  for (const { Longitude, Latitude } of data) {
    dataIndex.add(Longitude, Latitude);
  }
  dataIndex.finish();

  console.log(dataIndex);

  const scene = {
    destroy: () => {},
  };

  return scene as Scene;
};
