import { createSceneContainer } from '@antv/l7-core';
import AMapService from '../src/amap-next/map';

describe('maps', () => {
  it('AMapService', () => {
    const container = createSceneContainer();
    // // 绑定地图服务

    // const service = new AMapService({
    //     style: 'dark',
    //     center: [120.145, 30.238915],
    //     pitch: 60,
    //     zoom: 13.2
    // });
    // service.ma;

    new AMapService(container);

    // service.setContainer(sceneContainer, id, canvas);

    // expect(service).toBeTruthy();
  });
});
