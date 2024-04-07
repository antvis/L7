import { DOM } from '@antv/l7-utils';
import type { L7Container } from '../../inversify.config';
import type { IMapService } from '../map/IMapService';
import type {
  IControl,
  IControlCorners,
  IControlService,
  IControlServiceCfg,
  PositionName,
} from './IControlService';
import { PositionType } from './IControlService';

const ControlDirectionConfig: Record<PositionName, 'column' | 'row'> = {
  topleft: 'column',
  topright: 'column',
  bottomright: 'column',
  bottomleft: 'column',
  leftcenter: 'column',
  rightcenter: 'column',
  topcenter: 'row',
  bottomcenter: 'row',
  lefttop: 'row',
  righttop: 'row',
  leftbottom: 'row',
  rightbottom: 'row',
};

export default class ControlService implements IControlService {
  public container: HTMLElement;
  public controlCorners: IControlCorners;
  public controlContainer: HTMLElement;
  public scene: L7Container;
  public mapsService: IMapService;
  private controls: IControl[] = [];
  private unAddControls: IControl[] = [];
  public init(cfg: IControlServiceCfg, sceneContainer: L7Container) {
    this.container = cfg.container;
    this.scene = sceneContainer;
    this.mapsService = sceneContainer.mapService;
    this.initControlPos();
  }
  public addControl(ctr: IControl, sceneContainer: L7Container): void {
    const mapsService = sceneContainer.mapService;
    if (mapsService.map) {
      ctr.addTo(this.scene); // scene对象
      this.controls.push(ctr);
    } else {
      this.unAddControls.push(ctr);
    }
  }
  public getControlByName(name: string | number): IControl | undefined {
    return this.controls.find((ctr) => {
      return ctr.controlOption.name === name;
    });
  }
  public removeControl(ctr: IControl): this {
    const index = this.controls.indexOf(ctr);
    if (index > -1) {
      this.controls.splice(index, 1);
    }
    ctr.remove();
    return this;
  }

  public addControls() {
    this.unAddControls.forEach((ctr: IControl) => {
      ctr.addTo(this.scene); // scene对象
      this.controls.push(ctr);
    });
    this.unAddControls = [];
  }

  public destroy(): void {
    for (const ctr of this.controls) {
      ctr.remove();
    }
    this.controls = [];
    this.clearControlPos();
  }

  private initControlPos() {
    const corners: IControlCorners = (this.controlCorners = {});
    const l = 'l7-';
    const container = (this.controlContainer = DOM.create(
      'div',
      l + 'control-container',
      this.container,
    ));

    function createCorner(vSideList: string[] = []) {
      const className = vSideList.map((item) => l + item).join(' ');
      corners[vSideList.filter((item) => !['row', 'column'].includes(item)).join('')] = DOM.create(
        'div',
        className,
        container,
      );
    }

    function getCornerClassList(positionName: PositionName) {
      const positionList = positionName
        .replace(/^(top|bottom|left|right|center)/, '$1-')
        .split('-');
      return [...positionList, ControlDirectionConfig[positionName]];
    }

    Object.values(PositionType).forEach((position) => {
      createCorner(getCornerClassList(position));
    });

    this.checkCornerOverlap();
  }

  private clearControlPos() {
    for (const i in this.controlCorners) {
      if (this.controlCorners[i]) {
        DOM.remove(this.controlCorners[i]);
      }
    }
    if (this.controlContainer) {
      DOM.remove(this.controlContainer);
    }
  }

  private checkCornerOverlap() {
    const Observer = window.MutationObserver;
    // 在 jest 或者低版本的浏览器下，如果不支持 MutationObserver 则直接不处理
    if (!Observer) {
      return;
    }
    for (const cornerType of Object.keys(this.controlCorners)) {
      const matchResult = cornerType.match(/^(top|bottom)(left|right)$/);
      if (matchResult) {
        const [, pos1, pos2] = matchResult;
        const dom = this.controlCorners[`${pos1}${pos2}`];
        const observer = new Observer(([{ target }]) => {
          if (dom) {
            // @ts-ignore
            dom.style[pos1] = (target as HTMLDivElement).clientHeight + 'px';
          }
        });
        observer.observe(this.controlCorners[`${pos2}${pos1}`], {
          childList: true,
          attributes: true,
        });
      }
    }
  }
}
