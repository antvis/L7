import { createL7Icon } from '../utils/icon';
import ButtonControl, {
  IButtonControlOption,
} from './baseControl/buttonControl';

export interface IExportImageControlOption extends IButtonControlOption {
  imageType: 'png' | 'jpeg';
  onExport: (base64: string) => void;
}

export { ExportImage };

export default class ExportImage extends ButtonControl<IExportImageControlOption> {
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
      btnIcon: createL7Icon('l7-icon-export-picture'),
      imageType: 'png',
    };
  }

  public async getImage() {
    const mapImage = await this.mapsService.exportMap('png');
    const layerImage = await this.scene.exportPng('png');
    return this.mergeImage(
      // 在 Map 底图模式下 mapImage 为 undefined
      ...[mapImage, layerImage].filter((base64) => base64),
    );
  }

  protected onClick = async () => {
    const { onExport } = this.controlOption;
    onExport?.(await this.getImage());
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
