import { isColor, rgb2arr, decodePickingColor, encodePickingColor, generateColorRamp } from '../src/color';

describe('utils/color', () => {
  it('isColor', () => {
    const isColor1 = isColor('color');
    expect(isColor1).toEqual(false);

    const isColor2 = isColor('#f00');
    expect(isColor2).toEqual(true);

    const isColor3 = isColor(999);
    expect(isColor3).toEqual(false);

    const red = rgb2arr('#f00')
    expect(red).toEqual([1, 0, 0, 1]);

    const green = rgb2arr('rgba(0, 255, 0, 1)');
    expect(green).toEqual([0, 1, 0, 1]);
    
    const id = decodePickingColor(new Uint8Array([200, 0, 0]))
    expect(id).toEqual(199);

    const pickColor = encodePickingColor(id)
    expect(pickColor).toEqual([200, 0, 0]);
    
    const imageData = generateColorRamp({
      positions: [0, 1],
      colors: ['#fff', '#000']
    })
    expect(imageData.width).toEqual(256);
    expect(imageData.height).toEqual(1);

    const imageData2 = generateColorRamp({
      weights: [0.5, 0.5],
      colors: ['#fff', '#000'],
      positions: [0, 1]
    })
    expect(imageData2.width).toEqual(256);
    expect(imageData2.height).toEqual(1);
   
  });
});
