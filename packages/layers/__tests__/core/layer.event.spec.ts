import { TestScene } from '@antv/l7-test-utils';
import PolygonLayer from '../../src/polygon';
describe('layer event', () => {
  let scene: any;
  let layer: any;
  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          base_height: 100,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [119.948198, 30.339818],
              [120.344273, 30.513865],
              [120.414729, 30.288859],
              [120.346177, 30.160522],
              [120.100535, 30.041909],
              [119.906306, 30.094644],
              [119.845646, 30.175339],
              [119.81137, 30.244454],
              [119.807562, 30.352965],
              [119.948198, 30.339818],
            ],
          ],
        },
      },
    ],
  };
  beforeEach(() => {
    scene = TestScene({
      center: [120.11114550000002, 30.27817071635984],
      zoom: 8.592359444611867,
    });
  });
  it('layer click', async () => {
    layer = new PolygonLayer({
      autoFit: true,
    })
      .source(data)
      .shape('fill')
      .active(true)
      .color('red');
    scene.addLayer(layer);

    // layer.on('inited', async (e: any) => {
    //   layer.on('unclick', (e: any) => {
    //     console.log('unclick', e)
    //   });
    //   layer.on('click', (e: any) => {
    //     console.log('click', e)
    //   });
    //   // @ts-ignore
    //   const interaction = layer
    //     .getContainer().get<IInteractionService>(
    //       TYPES.IInteractionService,
    //     );
    //   // @ts-ignore
    //   const render = layer
    //     .getContainer().get<IRendererService>(
    //       TYPES.IRendererService,
    //     );

    //   // target

    //   const target = {
    //     type: 'click',
    //     x: 211,
    //     y: 189,
    //     lnglat: {
    //       lng: 120.100535,
    //       lat: 30.041909,
    //     }

    //   }
    //   console.log(layer.getEncodedData())
    //   interaction.emit(InteractionEvent.Hover, target);

    //   // const gl = render.getGLContext();
    //   // const { width, height } = render.getViewportSize();
    //   // const pixels = new Uint8Array(width * height * 4)
    //   // gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
    //   // process.stdout.write(['P3\n# gl.ppm\n', width, " ", height, '\n255\n'].join(''))
    //   // for (let i = 0; i < pixels.length; i += 4) {
    //   //   for (let j = 0; j < 3; ++j) {
    //   //     process.stdout.write(pixels[i + j] + ' ')
    //   //   }
    //   // }

    // });
  });

  // it('gl render', async () => {
  //   // Create context
  //   const width = 10
  //   const height = 10
  //   const context = gl(width, height, { preserveDrawingBuffer: true })

  //   //Clear screen to red
  //   context.clearColor(1, 1, 0, 1)
  //   context.clear(context.COLOR_BUFFER_BIT)

  //   //Write output as a PPM formatted image
  //   const pixels = new Uint8Array(width * height * 4)
  //   context.readPixels(0, 0, width, height, context.RGBA, context.UNSIGNED_BYTE, pixels)
  //   process.stdout.write(['P3\n# gl.ppm\n', width, " ", height, '\n255\n'].join(''))
  //   console.log(pixels)
  //   for (let i = 0; i < pixels.length; i += 4) {
  //     for (let j = 0; j < 3; ++j) {
  //       process.stdout.write(pixels[i + j] + ' ')
  //     }
  //   }
  // })
});
