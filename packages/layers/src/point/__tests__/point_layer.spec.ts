
import PointLayer from '..';
import { TestScene } from '@antv/l7-test-utils';
describe('pointLayer', () => {
    let scene: any;
    let layer: any;

    beforeEach(() => {
        scene = TestScene();

    });


    it('pontlayer extrude', () => {
        layer = new PointLayer({
            name: 'layer',
        })
            .source(
                [
                    {
                        lng: 120,
                        lat: 30,
                        value: 1
                    },
                    {
                        lng: 121,
                        lat: 31,
                        value: 2
                    },
                ],
                {
                    parser: {
                        type: 'json',
                        x: 'lng',
                        y: 'lat',
                    },
                },
            )
            .shape('cylinder')
            .size('t', function (level) {
                return [1, 1, level * 2 + 20];
            })
            .active(true)
            .color('#006CFF')
            .style({
                opacity: 0.6,
                opacityLinear: {
                    enable: true, // true - false
                    dir: 'up' // up - down
                },
                lightEnable: false
            });
            scene.addLayer(layer);

    });

});
