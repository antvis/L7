import { TestScene } from '@antv/l7-test-utils';
import ExportImage from '../src/control/exportImage';

describe('exportImage', () => {
  const scene = TestScene();

  it('life cycle', () => {
    const control = new ExportImage({});
    scene.addControl(control);

    const container = control.getContainer();
    expect(container.parentElement).toBeInstanceOf(HTMLElement);

    scene.removeControl(control);
    expect(container.parentElement).not.toBeInstanceOf(HTMLElement);
  });

  it('image', () => {
    const control = new ExportImage({
      onExport: () => {
        // tslint:disable-next-line:no-console
        // console.log(base64);
      },
    });
    scene.addControl(control);

    const button = control.getContainer() as HTMLDivElement;
    button.click();

    expect(button.parentElement).toBeInstanceOf(HTMLElement);
  });
});
