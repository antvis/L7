// import Flatbush from 'flatbush';
// https://github.com/mourner/kdbush
import KDBush from 'kdbush'

export async function MapRender() {
   const rawdata = await (await fetch('https://mdn.alipayobjects.com/afts/file/A*yHeJTaQ6iVsAAAAAAAAAAAAADrd2AQ/aqi.json')).json();
   const data = rawdata.map((row) => {
      const { CityCode, Area, PositionName, Latitude, Longitude, AQI, } = row;
      return {
         CityCode,
         Area,
         PositionName,
         Latitude: Latitude * 1,
         Longitude: Longitude * 1,
         AQI: AQI * 1
      }
   })
   const dataIndex = new KDBush(data.length)
   for (const {Longitude, Latitude} of data) {
      dataIndex.add(Longitude, Latitude);
  }
  dataIndex.finish();

const ARRAY_TYPES = [
   Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array,
   Int32Array, Uint32Array, Float32Array, Float64Array
];

//   const dataArray = Array.from(new Float64Array(dataIndex.data));
   console.log(dataIndex);
   const [magic, versionAndType] = new Uint8Array(dataIndex.data, 0, 2);
   const [nodeSize] = new Uint16Array(dataIndex.data, 2, 1);
   const [numItems] = new Uint32Array(dataIndex.data, 4, 1);
   const ArrayType = ARRAY_TYPES[versionAndType & 0x0f];
   console.log(magic, versionAndType)
   console.log(nodeSize, numItems,ArrayType)

}
