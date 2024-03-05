import RasterLayer from '../../raster/index';
import { TestScene } from '@antv/l7-test-utils';
describe('RasterLayer', () => {
    let scene: any;
    beforeEach(() => {
        scene = TestScene();

    });
    // vector data
    it('rasterLayer raster', async () => {
        const url1 =
            'https://tiles{1-3}.geovisearth.com/base/v1/ter/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
        const layer1 = new RasterLayer({
            zIndex: 1,
        }).source(url1, {
            parser: {
                type: 'rasterTile',
                tileSize: 256,
                zoomOffset: 0,
            },
        });


        scene.addLayer(layer1);

    });



});