import { IMapService } from '@l7/core';
import { bindAll, DOM } from '@l7/utils';
import Control, { IControlOption, PositionType } from './BaseControl';
export default class Logo extends Control {
  public getDefault() {
    return {
      position: PositionType.BOTTOMLEFT,
    };
  }
  public onAdd(MapService: IMapService) {
    const className = 'l7-control-logo';
    const container = DOM.create('div', className);
    const anchor: HTMLLinkElement = DOM.create(
      'a',
      'l7-ctrl-logo',
    ) as HTMLLinkElement;
    anchor.target = '_blank';
    anchor.rel = 'noopener nofollow';
    anchor.href = 'https://antv.alipay.com/l7';
    anchor.setAttribute('aria-label', 'AntV logo');
    anchor.setAttribute('rel', 'noopener nofollow');
    container.appendChild(anchor);
    return container;
  }
}
