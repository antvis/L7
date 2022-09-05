import { createL7Icon } from '../utils/icon';
import ButtonControl, {
  IButtonControlOption,
} from './baseControl/buttonControl';

export interface IExportImageControlOption extends IButtonControlOption {
  imageType: 'png' | 'jpeg';
  onExport: (base64: string) => void;
}

export { ExportImage };

export default class ExportImage extends ButtonControl<
  IExportImageControlOption
> {
  public onAdd(): HTMLElement {
    const button = super.onAdd();
    button.addEventListener('click', this.onClick);
    return button;
  }

  public getDefault(
    option?: Partial<IExportImageControlOption>,
  ): IExportImageControlOption {
    return {
      ...super.getDefault(option),
      title: '导出图片',
      btnIcon: createL7Icon('l7-icon-tupian'),
      imageType: 'png',
    };
  }

  protected onClick = async () => {
    const { onExport } = this.controlOption;
    const mapImage = this.mapsService.exportMap('png');
    const layerImage = this.scene.exportPng('png');
    onExport?.(await this.mergeImage(mapImage, layerImage));
  };

  /**
   * 将多张图片合并为一张图片
   * @protected
   * @param base64List
   */
  protected mergeImage = async (...base64List: string[]) => {
    const { imageType } = this.controlOption;
    const { width = 0, height = 0 } =
      this.mapsService.getContainer()?.getBoundingClientRect() ?? {};
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    const imgList = await Promise.all(
      base64List.map((base64) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => {
            resolve(img);
          };
          img.src = base64;
        });
      }),
    );
    imgList.forEach((img) => {
      context?.drawImage(img, 0, 0, width, height);
    });
    return canvas.toDataURL(`image/${imageType}`) as string;
  };
}
