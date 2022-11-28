import { DOM } from '@antv/l7-utils';
import { Control, IControlOption, PositionType } from './baseControl';

export interface ILogoControlOption extends IControlOption {
  // Logo 展示的图片 url
  img: string;
  // 点击 Logo 跳转的超链接，不传或传 '' | null 则纯展示 Logo，点击不跳转
  href?: string | null;
}

export { Logo };

export default class Logo extends Control<ILogoControlOption> {
  public getDefault(): ILogoControlOption {
    return {
      position: PositionType.BOTTOMLEFT,
      name: 'logo',
      href: 'https://l7.antv.antgroup.com/',
      img: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*GRb1TKp4HcMAAAAAAAAAAAAAARQnAQ',
    };
  }

  public onAdd() {
    const container = DOM.create('div', 'l7-control-logo');
    this.setLogoContent(container);
    return container;
  }

  public onRemove() {
    return null;
  }

  public setOptions(option: Partial<ILogoControlOption>) {
    super.setOptions(option);
    if (this.checkUpdateOption(option, ['img', 'href'])) {
      DOM.clearChildren(this.container);
      this.setLogoContent(this.container);
    }
  }

  protected setLogoContent(container: HTMLElement) {
    const { href, img } = this.controlOption;
    const imgDOM = DOM.create('img') as HTMLElement;
    imgDOM.setAttribute('src', img);
    imgDOM.setAttribute('aria-label', 'AntV logo');
    DOM.setUnDraggable(imgDOM);
    if (href) {
      const anchorDOM = DOM.create(
        'a',
        'l7-control-logo-link',
      ) as HTMLLinkElement;
      anchorDOM.target = '_blank';
      anchorDOM.href = href;
      anchorDOM.rel = 'noopener nofollow';
      anchorDOM.setAttribute('rel', 'noopener nofollow');
      anchorDOM.appendChild(imgDOM);
      container.appendChild(anchorDOM);
    } else {
      container.appendChild(imgDOM);
    }
  }
}
